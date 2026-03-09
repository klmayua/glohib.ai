package models

import (
	"time"
	"github.com/google/uuid"
)

type Stage struct {
	ID           uuid.UUID  `db:"id" json:"id"`
	AssessmentID uuid.UUID  `db:"assessment_id" json:"assessment_id"`
	Name         string     `db:"name" json:"name"`
	Status       string     `db:"status" json:"status"`
	Score        float64    `db:"score" json:"score"`
	Pass         bool       `db:"pass" json:"pass"`
	Feedback     string     `db:"feedback" json:"feedback"`
	Answers      []byte     `db:"answers" json:"-"`
	StartedAt    *time.Time `db:"started_at" json:"started_at,omitempty"`
	SubmittedAt  *time.Time `db:"submitted_at" json:"submitted_at,omitempty"`
	ExpiresAt    *time.Time `db:"expires_at" json:"expires_at,omitempty"`
	CreatedAt    time.Time  `db:"created_at" json:"created_at"`
}

const (
	StatusPending   = "pending"
	StatusActive    = "active"
	StatusSubmitted = "submitted"
	StatusGraded    = "graded"
	StatusExpired   = "expired"
)

const (
	StageScreening   = "screening"
	StageTechnical   = "technical"
	StageCultural    = "cultural"
	StageFinal       = "final"
	StagePsychomotor = "psychomotor"
	StageSituational = "situational"
)
