package router

import (
	"github.com/gin-gonic/gin"
	"github.com/glohib.ai/internship/internal/handlers"
)

func New(internshipHandler *handlers.InternshipHandler) *gin.Engine {
	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery())

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// API v1 routes
	v1 := r.Group("/api/v1")
	{
		internships := v1.Group("/internships")
		{
			internships.POST("", internshipHandler.Create)
			internships.GET("", internshipHandler.List)
			internships.GET("/:id", internshipHandler.Get)
			internships.PUT("/:id", internshipHandler.Update)
			internships.DELETE("/:id", internshipHandler.Delete)
			internships.POST("/search", internshipHandler.Search)
			internships.POST("/vector-search", internshipHandler.VectorSearch)

			// Applications
			internships.GET("/:id/applications", internshipHandler.ListInternshipApplications)
			internships.POST("/:id/applications", internshipHandler.CreateApplication)
		}

		applications := v1.Group("/applications")
		{
			applications.GET("/student/:studentId", internshipHandler.ListStudentApplications)
			applications.GET("/:appId", internshipHandler.GetApplication)
			applications.PUT("/:appId", internshipHandler.UpdateApplication)
		}
	}

	return r
}
