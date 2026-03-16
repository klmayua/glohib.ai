package router

import (
	"time"
	"github.com/gin-gonic/gin"
	"github.com/glohib/identity-service/internal/handlers"
	"github.com/glohib/identity-service/internal/middleware"
	"github.com/glohib/identity-service/internal/jwt"
	"github.com/glohib/identity-service/internal/redis"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

func New(authHandler *handlers.AuthHandler, oauthHandler *handlers.OAuthHandler, apiKeyHandler *handlers.APIKeyHandler, jwtHelper *jwt.Helper, rdb *redis.Client) *gin.Engine {
	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery())

	// Metrics middleware
	r.Use(middleware.Metrics("identity-service"))

	// Rate limiting: 100 requests per minute for auth endpoints
	rateLimiter := middleware.NewRateLimiter(rdb.Client, 100, time.Minute)
	localRateLimiter := middleware.NewLocalRateLimiter(100, time.Minute)

	// Apply rate limiting to all routes
	r.Use(localRateLimiter.Middleware())

	// Prometheus metrics endpoint
	r.GET("/metrics", gin.WrapH(promhttp.Handler()))

	// Health check endpoint with detailed status
	r.HEAD("/health", func(c *gin.Context) {
		c.Status(200)
	})
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "healthy",
			"service": "identity-service",
			"version": "1.0.0",
		})
	})

	v1 := r.Group("/api/v1")
	{
		auth := v1.Group("/auth", rateLimiter.Middleware())
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
			auth.POST("/logout", authHandler.Logout)
			auth.POST("/refresh", authHandler.Refresh)
			auth.GET("/me", middleware.Auth(jwtHelper), authHandler.Me)
		}

		oauth := v1.Group("/oauth")
		{
			oauth.POST("/google", oauthHandler.GoogleLogin)
			oauth.GET("/google/callback", oauthHandler.GoogleCallback)
		}

		keys := v1.Group("/apikeys")
		keys.Use(middleware.Auth(jwtHelper))
		{
			keys.POST("", apiKeyHandler.Create)
			keys.GET("", apiKeyHandler.List)
			keys.DELETE("/:id", apiKeyHandler.Delete)
		}
	}

	return r
}
