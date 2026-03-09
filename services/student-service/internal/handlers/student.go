package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/glohib-ai/student-service/internal/models"
	"github.com/glohib-ai/student-service/internal/services"
	"github.com/google/uuid"
)

type StudentHandler struct {
	service services.StudentService
}

func NewStudentHandler(service services.StudentService) *StudentHandler {
	return &StudentHandler{service: service}
}

// CreateStudent godoc
// @Summary Create a new student
// @Description Create a new student profile
// @Tags students
// @Accept json
// @Produce json
// @Param student body models.StudentCreate true "Student data"
// @Success 201 {object} models.Student
// @Failure 400 {object} map[string]string
// @Failure 409 {object} map[string]string
// @Router /api/v1/students [post]
func (h *StudentHandler) Create(c *gin.Context) {
	var req models.StudentCreate
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	student, err := h.service.Create(c.Request.Context(), &req)
	if err != nil {
		if err == services.ErrStudentExists {
			c.JSON(http.StatusConflict, gin.H{"error": "student with this email already exists"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, student)
}

// GetStudent godoc
// @Summary Get student by ID
// @Description Get student details by ID
// @Tags students
// @Accept json
// @Produce json
// @Param id path string true "Student ID"
// @Success 200 {object} models.Student
// @Failure 404 {object} map[string]string
// @Router /api/v1/students/:id [get]
func (h *StudentHandler) Get(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid student id"})
		return
	}

	student, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		if err == services.ErrStudentNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "student not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, student)
}

// UpdateStudent godoc
// @Summary Update student
// @Description Update student details
// @Tags students
// @Accept json
// @Produce json
// @Param id path string true "Student ID"
// @Param student body models.StudentUpdate true "Student data"
// @Success 200 {object} models.Student
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /api/v1/students/:id [put]
func (h *StudentHandler) Update(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid student id"})
		return
	}

	var req models.StudentUpdate
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	student, err := h.service.Update(c.Request.Context(), id, &req)
	if err != nil {
		if err == services.ErrStudentNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "student not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, student)
}

// DeleteStudent godoc
// @Summary Delete student
// @Description Delete a student
// @Tags students
// @Accept json
// @Produce json
// @Param id path string true "Student ID"
// @Success 204
// @Failure 404 {object} map[string]string
// @Router /api/v1/students/:id [delete]
func (h *StudentHandler) Delete(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid student id"})
		return
	}

	if err := h.service.Delete(c.Request.Context(), id); err != nil {
		if err == services.ErrStudentNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "student not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

// ListStudents godoc
// @Summary List students
// @Description Get list of students with pagination
// @Tags students
// @Accept json
// @Produce json
// @Param limit query int false "Limit" default(20)
// @Param offset query int false "Offset" default(0)
// @Success 200 {array} models.Student
// @Router /api/v1/students [get]
func (h *StudentHandler) List(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	students, err := h.service.List(c.Request.Context(), limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"students": students,
		"total":    len(students),
	})
}

// AddSkill godoc
// @Summary Add skill to student
// @Description Add a skill to student profile
// @Tags students
// @Accept json
// @Produce json
// @Param id path string true "Student ID"
// @Param skill body models.SkillCreate true "Skill data"
// @Success 201 {object} models.Skill
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /api/v1/students/:id/skills [post]
func (h *StudentHandler) AddSkill(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid student id"})
		return
	}

	var req models.SkillCreate
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	skill, err := h.service.AddSkill(c.Request.Context(), id, &req)
	if err != nil {
		if err == services.ErrStudentNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "student not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, skill)
}

// AddEducation godoc
// @Summary Add education to student
// @Description Add education record to student profile
// @Tags students
// @Accept json
// @Produce json
// @Param id path string true "Student ID"
// @Param education body models.EducationCreate true "Education data"
// @Success 201 {object} models.Education
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /api/v1/students/:id/education [post]
func (h *StudentHandler) AddEducation(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid student id"})
		return
	}

	var req models.EducationCreate
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	education, err := h.service.AddEducation(c.Request.Context(), id, &req)
	if err != nil {
		if err == services.ErrStudentNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "student not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, education)
}

// AddExperience godoc
// @Summary Add experience to student
// @Description Add work experience to student profile
// @Tags students
// @Accept json
// @Produce json
// @Param id path string true "Student ID"
// @Param experience body models.ExperienceCreate true "Experience data"
// @Success 201 {object} models.Experience
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /api/v1/students/:id/experience [post]
func (h *StudentHandler) AddExperience(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid student id"})
		return
	}

	var req models.ExperienceCreate
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	experience, err := h.service.AddExperience(c.Request.Context(), id, &req)
	if err != nil {
		if err == services.ErrStudentNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "student not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, experience)
}
