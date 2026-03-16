package middleware

import (
	"time"
	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	httpRequestsTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "http_requests_total",
			Help: "Total number of HTTP requests",
		},
		[]string{"service", "method", "endpoint", "status"},
	)

	httpRequestDuration = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "http_request_duration_seconds",
			Help:    "HTTP request duration in seconds",
			Buckets: prometheus.DefBuckets,
		},
		[]string{"service", "method", "endpoint"},
	)

	httpRequestsInFlight = promauto.NewGauge(
		prometheus.GaugeOpts{
			Name: "http_requests_in_flight",
			Help: "Number of HTTP requests currently being processed",
		},
	)
)

// Metrics returns a Gin middleware that records HTTP request metrics
func Metrics(serviceName string) gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		httpRequestsInFlight.Inc()
		defer httpRequestsInFlight.Dec()

		c.Next()

		duration := time.Since(start).Seconds()
		status := c.Writer.Status()
		
		if status == 0 {
			status = 200
		}

		httpRequestsTotal.WithLabelValues(
			serviceName,
			c.Request.Method,
			c.FullPath(),
			string(rune(status)),
		).Inc()

		httpRequestDuration.WithLabelValues(
			serviceName,
			c.Request.Method,
			c.FullPath(),
		).Observe(duration)
	}
}
