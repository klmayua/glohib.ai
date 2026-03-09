package router

import (
	"github.com/gin-gonic/gin"
	"github.com/glohib-ai/student-service/internal/handlers"
)

func New(studentHandler *handlers.StudentHandler) *gin.Engine {
	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery())

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// API v1 routes
	v1 := r.Group("/api/v1")
	{
		students := v1.Group("/students")
		{
			students.POST("", studentHandler.Create)
			students.GET("", studentHandler.List)
			students.GET("/:id", studentHandler.Get)
			students.PUT("/:id", studentHandler.Update)
			students.DELETE("/:id", studentHandler.Delete)

			students.POST("/:id/skills", studentHandler.AddSkill)
			students.POST("/:id/education", studentHandler.AddEducation)
			students.POST("/:id/experience", studentHandler.AddExperience)
		}
	}

	return r
}
