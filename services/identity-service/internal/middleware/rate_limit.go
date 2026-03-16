package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	goredis "github.com/redis/go-redis/v9"
)

// RateLimiter middleware using Redis for distributed rate limiting
type RateLimiter struct {
	rdb    *goredis.Client
	limit  int           // max requests
	window time.Duration // time window
	mu     sync.RWMutex
}

// NewRateLimiter creates a new rate limiter
func NewRateLimiter(rdb *goredis.Client, limit int, window time.Duration) *RateLimiter {
	return &RateLimiter{
		rdb:    rdb,
		limit:  limit,
		window: window,
	}
}

// Middleware returns the Gin middleware handler
func (rl *RateLimiter) Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		clientIP := c.ClientIP()
		key := "rate_limit:" + clientIP

		rl.mu.RLock()
		current, err := rl.rdb.Get(c.Request.Context(), key).Int()
		rl.mu.RUnlock()

		if err == goredis.Nil {
			// Key doesn't exist, create it
			rl.mu.Lock()
			rl.rdb.Set(c.Request.Context(), key, 1, rl.window)
			rl.mu.Unlock()
			c.Next()
			return
		} else if err != nil {
			// Redis error, allow request but log
			c.Next()
			return
		}

		if current >= rl.limit {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error":       "rate limit exceeded",
				"message":     "Too many requests, please try again later",
				"retry_after": rl.window.Seconds(),
			})
			return
		}

		// Increment counter
		rl.mu.Lock()
		rl.rdb.Incr(c.Request.Context(), key)
		rl.mu.Unlock()

		c.Next()
	}
}

// LocalRateLimiter for in-memory rate limiting (fallback)
type LocalRateLimiter struct {
	clients map[string]*clientInfo
	limit   int
	window  time.Duration
	mu      sync.RWMutex
}

type clientInfo struct {
	count     int
	resetTime time.Time
}

// NewLocalRateLimiter creates a local rate limiter
func NewLocalRateLimiter(limit int, window time.Duration) *LocalRateLimiter {
	rl := &LocalRateLimiter{
		clients: make(map[string]*clientInfo),
		limit:   limit,
		window:  window,
	}

	// Cleanup old entries periodically
	go func() {
		ticker := time.NewTicker(window)
		defer ticker.Stop()
		for range ticker.C {
			rl.mu.Lock()
			now := time.Now()
			for ip, info := range rl.clients {
				if info.resetTime.Before(now) {
					delete(rl.clients, ip)
				}
			}
			rl.mu.Unlock()
		}
	}()

	return rl
}

// Middleware returns the Gin middleware handler
func (rl *LocalRateLimiter) Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		clientIP := c.ClientIP()
		now := time.Now()

		rl.mu.Lock()
		info, exists := rl.clients[clientIP]

		if !exists || info.resetTime.Before(now) {
			rl.clients[clientIP] = &clientInfo{
				count:     1,
				resetTime: now.Add(rl.window),
			}
			rl.mu.Unlock()
			c.Next()
			return
		}

		if info.count >= rl.limit {
			rl.mu.Unlock()
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error":       "rate limit exceeded",
				"message":     "Too many requests, please try again later",
				"retry_after": info.resetTime.Sub(now).Seconds(),
			})
			return
		}

		info.count++
		rl.mu.Unlock()
		c.Next()
	}
}
