package models

import (
	"time"
	"github.com/google/uuid"
)

type ProfileVector struct {
	ID         uuid.UUID   `json:"id" db:"id"`
	StudentID  uuid.UUID   `json:"student_id" db:"student_id"`
	Vector     []float32   `json:"vector" db:"vector"`
	VectorType string      `json:"vector_type" db:"vector_type"`
	Metadata   *Metadata   `json:"metadata,omitempty" db:"metadata"`
	CreatedAt  time.Time   `json:"created_at" db:"created_at"`
	UpdatedAt  time.Time   `json:"updated_at" db:"updated_at"`
}

type Metadata struct {
	ModelVersion string            `json:"model_version"`
	TextSource   string            `json:"text_source"`
	TextLength   int               `json:"text_length"`
	Confidence   float64           `json:"confidence"`
	Tags         map[string]string `json:"tags,omitempty"`
}

type VectorSearchRequest struct {
	Vector     []float32 `json:"vector" validate:"required,len=512"`
	Limit      int       `json:"limit" validate:"min=1,max=100"`
	Threshold  float64   `json:"threshold" validate:"min=0,max=1"`
	VectorType string    `json:"vector_type" validate:"required,oneof=profile skills experience"`
}

type VectorSearchResult struct {
	StudentID  uuid.UUID `json:"student_id"`
	Similarity float64   `json:"similarity"`
	Student    *Student  `json:"student,omitempty"`
}

type ProfileScore struct {
	StudentID      uuid.UUID      `json:"student_id"`
	TotalScore     float64        `json:"total_score"`
	MaxScore       float64        `json:"max_score"`
	Percentage     float64        `json:"percentage"`
	Breakdown      ScoreBreakdown `json:"breakdown"`
	LastCalculated time.Time      `json:"last_calculated"`
}

type ScoreBreakdown struct {
	BasicInfo      float64 `json:"basic_info"`
	ContactInfo    float64 `json:"contact_info"`
	Education      float64 `json:"education"`
	Experience     float64 `json:"experience"`
	Skills         float64 `json:"skills"`
	Bio            float64 `json:"bio"`
	Links          float64 `json:"links"`
	ProfilePicture float64 `json:"profile_picture"`
}
