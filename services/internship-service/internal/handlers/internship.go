package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/glohib.ai/internship/internal/models"
	"github.com/glohib.ai/internship/internal/services"
)

type InternshipHandler struct {
	service services.InternshipService
}

func NewInternshipHandler(service services.InternshipService) *InternshipHandler {
	return &InternshipHandler{service: service}
}

// CreateInternship creates a new internship
func (h *InternshipHandler) Create(c *gin.Context) {
	var internship models.Internship
	if err := c.ShouldBindJSON(&internship); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := h.service.CreateInternship(c.Request.Context(), &internship)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, result)
}

// GetInternship gets an internship by ID
func (h *InternshipHandler) Get(c *gin.Context) {
	id := c.Param("id")

	internship, err := h.service.GetInternship(c.Request.Context(), id)
	if err != nil {
		if err == services.ErrInternshipNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "internship not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, internship)
}

// UpdateInternship updates an internship
func (h *InternshipHandler) Update(c *gin.Context) {
	id := c.Param("id")

	var internship models.Internship
	if err := c.ShouldBindJSON(&internship); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	internship.ID = id
	result, err := h.service.UpdateInternship(c.Request.Context(), &internship)
	if err != nil {
		if err == services.ErrInternshipNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "internship not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}

// DeleteInternship deletes an internship
func (h *InternshipHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	if err := h.service.DeleteInternship(c.Request.Context(), id); err != nil {
		if err == services.ErrInternshipNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "internship not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

// ListInternships lists all internships with pagination
func (h *InternshipHandler) List(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	internships, err := h.service.ListInternships(c.Request.Context(), limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"internships": internships,
		"total":       len(internships),
	})
}

// SearchInternships searches for internships
func (h *InternshipHandler) Search(c *gin.Context) {
	var filter models.SearchFilter
	if err := c.ShouldBindJSON(&filter); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	internships, err := h.service.SearchInternships(c.Request.Context(), &filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"internships": internships,
		"total":       len(internships),
	})
}

// VectorSearch performs vector similarity search
func (h *InternshipHandler) VectorSearch(c *gin.Context) {
	var req models.VectorSearchRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	internships, err := h.service.VectorSearch(c.Request.Context(), req.Vector, int(req.Limit))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"internships": internships,
		"total":       len(internships),
	})
}

// CreateApplication creates a new application
func (h *InternshipHandler) CreateApplication(c *gin.Context) {
	internshipID := c.Param("id")

	var app models.Application
	if err := c.ShouldBindJSON(&app); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	app.InternshipID = internshipID
	result, err := h.service.CreateApplication(c.Request.Context(), &app)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, result)
}

// GetApplication gets an application by ID
func (h *InternshipHandler) GetApplication(c *gin.Context) {
	id := c.Param("appId")

	application, err := h.service.GetApplication(c.Request.Context(), id)
	if err != nil {
		if err == services.ErrApplicationNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "application not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, application)
}

// UpdateApplication updates an application status
func (h *InternshipHandler) UpdateApplication(c *gin.Context) {
	id := c.Param("appId")

	var app models.Application
	if err := c.ShouldBindJSON(&app); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	app.ID = id
	result, err := h.service.UpdateApplication(c.Request.Context(), &app)
	if err != nil {
		if err == services.ErrApplicationNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "application not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}

// ListInternshipApplications lists all applications for an internship
func (h *InternshipHandler) ListInternshipApplications(c *gin.Context) {
	internshipID := c.Param("id")

	applications, err := h.service.ListInternshipApplications(c.Request.Context(), internshipID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"applications": applications,
		"total":        len(applications),
	})
}

// ListStudentApplications lists all applications by a student
func (h *InternshipHandler) ListStudentApplications(c *gin.Context) {
	studentID := c.Param("studentId")

	applications, err := h.service.ListStudentApplications(c.Request.Context(), studentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"applications": applications,
		"total":        len(applications),
	})
}
