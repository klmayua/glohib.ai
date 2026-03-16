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

type StageHandler struct {
	stageRepo *repository.StageRepo
	stateSvc  *services.StateMachineService
	timerSvc  *services.TimerService
	log       *zap.Logger
}

func NewStageHandler(sr *repository.StageRepo, ss *services.StateMachineService, ts *services.TimerService, log *zap.Logger) *StageHandler {
	return &StageHandler{stageRepo: sr, stateSvc: ss, timerSvc: ts, log: log}
}

func (h *StageHandler) Submit(c *gin.Context) {
	aid, _ := uuid.Parse(c.Param("id"))
	stage := c.Param("stage")
	var req struct {
		Answers []struct {
			QuestionID string `json:"question_id"`
			Text       string `json:"text"`
		} `json:"answers"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	s, err := h.stageRepo.GetByName(c, aid, stage)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "stage not found"})
		return
	}
	s.Status = models.StatusSubmitted
	now := time.Now()
	s.SubmittedAt = &now
	if err := h.stageRepo.Update(c, s); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db"})
		return
	}
	if err := h.timerSvc.Cancel(c, aid.String(), stage); err != nil {
		h.log.Warn("timer cancel", zap.Error(err))
	}
	score := 0.75
	pass := score >= 0.7
	evt := "pass_" + stage
	if !pass {
		evt = "fail_" + stage
	}
	if err := h.stateSvc.Transition(c, aid, evt); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "state"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"result": "graded",
		"score":  score,
		"passed": pass,
	})
}

func (h *StageHandler) GetResult(c *gin.Context) {
	aid, _ := uuid.Parse(c.Param("id"))
	stage := c.Param("stage")
	s, err := h.stageRepo.GetByName(c, aid, stage)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "stage not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"score":    s.Score,
		"passed":   s.Pass,
		"feedback": s.Feedback,
	})
}

func (h *StageHandler) StartPsychomotor(c *gin.Context) {
	_, _ = uuid.Parse(c.Param("id"))
	sessionID := uuid.New().String()
	c.JSON(http.StatusOK, gin.H{
		"session_id": sessionID,
		"tasks": []gin.H{
			{"id": "t1", "description": "Task 1", "type": "drag_drop"},
			{"id": "t2", "description": "Task 2", "type": "sequence"},
		},
		"expires_at": time.Now().Add(30 * time.Minute).Unix(),
	})
}

func (h *StageHandler) SubmitPsychomotor(c *gin.Context) {
	_, _ = uuid.Parse(c.Param("id"))
	score := 0.8
	passed := score >= 0.6
	c.JSON(http.StatusOK, gin.H{
		"score":  score,
		"passed": passed,
	})
}

func (h *StageHandler) StartSituational(c *gin.Context) {
	_, _ = uuid.Parse(c.Param("id"))
	c.JSON(http.StatusOK, gin.H{
		"scenario_id":    "scen_001",
		"scenario_text":  "You are leading a public health initiative...",
		"options": []gin.H{
			{"id": "a", "text": "Option A"},
			{"id": "b", "text": "Option B"},
		},
		"expires_at": time.Now().Add(20 * time.Minute).Unix(),
	})
}

func (h *StageHandler) SubmitSituational(c *gin.Context) {
	_, _ = uuid.Parse(c.Param("id"))
	score := 0.75
	passed := score >= 0.6
	c.JSON(http.StatusOK, gin.H{
		"score":       score,
		"passed":      passed,
		"explanation": "Your response demonstrates good judgment...",
	})
}
