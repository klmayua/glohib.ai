package models

import (
	"time"
	"github.com/google/uuid"
)

type Assessment struct {
	ID           uuid.UUID  `db:"id" json:"id"`
	CandidateID  uuid.UUID  `db:"candidate_id" json:"candidate_id"`
	JobID        uuid.UUID  `db:"job_id" json:"job_id"`
	State        string     `db:"state" json:"state"`
	OverallScore float64    `db:"overall_score" json:"overall_score"`
	CreatedAt    time.Time  `db:"created_at" json:"created_at"`
	UpdatedAt    time.Time  `db:"updated_at" json:"updated_at"`
	CompletedAt  *time.Time `db:"completed_at" json:"completed_at,omitempty"`
}

const (
	StateDraft      = "draft"
	StateScreening  = "screening"
	StateTechnical  = "technical"
	StateCultural   = "cultural"
	StateFinal      = "final"
	StatePassed     = "passed"
	StateFailed     = "failed"
)
