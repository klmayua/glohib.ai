package handlers

import (
	"net/http"
	"time"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/glohib/assessment-service/internal/models"
	"github.com/glohib/assessment-service/internal/repository"
	"github.com/glohib/assessment-service/internal/services"
	"go.uber.org/zap"
)

type AssessmentHandler struct {
	repo      *repository.AssessmentRepo
	stageRepo *repository.StageRepo
	stateSvc  *services.StateMachineService
	timerSvc  *services.TimerService
	log       *zap.Logger
	stageTTL  time.Duration
}

func NewAssessmentHandler(repo *repository.AssessmentRepo, sr *repository.StageRepo, ss *services.StateMachineService, ts *services.TimerService, log *zap.Logger, stageTTL int) *AssessmentHandler {
	return &AssessmentHandler{
		repo: repo, stageRepo: sr, stateSvc: ss, timerSvc: ts, log: log,
		stageTTL: time.Duration(stageTTL) * time.Minute,
	}
}

func (h *AssessmentHandler) Start(c *gin.Context) {
	var req struct {
		CandidateID string `json:"candidate_id" binding:"required"`
		JobID       string `json:"job_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	aid := uuid.New()
	a := &models.Assessment{
		ID:          aid,
		CandidateID: uuid.MustParse(req.CandidateID),
		JobID:       uuid.MustParse(req.JobID),
		State:       models.StateDraft,
	}
	if err := h.repo.Create(c, a); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db"})
		return
	}
	if err := h.stateSvc.Start(c, aid); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "state"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{
		"assessment_id": aid,
		"stage":         models.StateScreening,
		"expires_at":    time.Now().Add(h.stageTTL).Unix(),
	})
}

func (h *AssessmentHandler) GetStatus(c *gin.Context) {
	aid, _ := uuid.Parse(c.Param("id"))
	a, err := h.repo.Get(c, aid)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	rem, _ := h.timerSvc.Remaining(c, aid.String(), a.State)
	c.JSON(http.StatusOK, gin.H{
		"stage":      a.State,
		"status":     "active",
		"expires_at": time.Now().Add(rem).Unix(),
	})
}

func (h *AssessmentHandler) FinalResult(c *gin.Context) {
	aid, _ := uuid.Parse(c.Param("id"))
	a, err := h.repo.Get(c, aid)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status":        a.State,
		"overall_score": a.OverallScore,
		"decision":      a.State,
	})
}
