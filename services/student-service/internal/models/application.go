package models

import (
	"time"
	"github.com/google/uuid"
)

type ApplicationStatus string

const (
	ApplicationStatusDraft     ApplicationStatus = "draft"
	ApplicationStatusSubmitted ApplicationStatus = "submitted"
	ApplicationStatusReviewing ApplicationStatus = "reviewing"
	ApplicationStatusInterview ApplicationStatus = "interview"
	ApplicationStatusOffered   ApplicationStatus = "offered"
	ApplicationStatusAccepted  ApplicationStatus = "accepted"
	ApplicationStatusRejected  ApplicationStatus = "rejected"
	ApplicationStatusWithdrawn ApplicationStatus = "withdrawn"
)

type Application struct {
	ID            uuid.UUID         `json:"id" db:"id"`
	StudentID     uuid.UUID         `json:"student_id" db:"student_id"`
	InternshipID  uuid.UUID         `json:"internship_id" db:"internship_id"`
	CompanyID     uuid.UUID         `json:"company_id" db:"company_id"`
	Status        ApplicationStatus `json:"status" db:"status"`
	CoverLetter   *string           `json:"cover_letter,omitempty" db:"cover_letter"`
	ResumeURL     string            `json:"resume_url" db:"resume_url"`
	TranscriptURL *string           `json:"transcript_url,omitempty" db:"transcript_url"`
	PortfolioURL  *string           `json:"portfolio_url,omitempty" db:"portfolio_url"`
	ExpectedSalary *float64         `json:"expected_salary,omitempty" db:"expected_salary"`
	AvailableFrom *time.Time        `json:"available_from,omitempty" db:"available_from"`
	AvailableTo   *time.Time        `json:"available_to,omitempty" db:"available_to"`
	Notes         *string           `json:"notes,omitempty" db:"notes"`
	SubmittedAt   *time.Time        `json:"submitted_at,omitempty" db:"submitted_at"`
	ReviewedAt    *time.Time        `json:"reviewed_at,omitempty" db:"reviewed_at"`
	InterviewAt   *time.Time        `json:"interview_at,omitempty" db:"interview_at"`
	DecisionAt    *time.Time        `json:"decision_at,omitempty" db:"decision_at"`
	CreatedAt     time.Time         `json:"created_at" db:"created_at"`
	UpdatedAt     time.Time         `json:"updated_at" db:"updated_at"`
}

type ApplicationCreate struct {
	InternshipID   uuid.UUID  `json:"internship_id" validate:"required"`
	CompanyID      uuid.UUID  `json:"company_id" validate:"required"`
	CoverLetter    *string    `json:"cover_letter,omitempty" validate:"omitempty,max=5000"`
	ResumeURL      string     `json:"resume_url" validate:"required,url"`
	TranscriptURL  *string    `json:"transcript_url,omitempty" validate:"omitempty,url"`
	PortfolioURL   *string    `json:"portfolio_url,omitempty" validate:"omitempty,url"`
	ExpectedSalary *float64   `json:"expected_salary,omitempty" validate:"omitempty,min=0"`
	AvailableFrom  *time.Time `json:"available_from,omitempty"`
	AvailableTo    *time.Time `json:"available_to,omitempty"`
	Notes          *string    `json:"notes,omitempty" validate:"omitempty,max=1000"`
}

type ApplicationUpdate struct {
	CoverLetter    *string            `json:"cover_letter,omitempty" validate:"omitempty,max=5000"`
	ResumeURL      *string            `json:"resume_url,omitempty" validate:"omitempty,url"`
	TranscriptURL  *string            `json:"transcript_url,omitempty" validate:"omitempty,url"`
	PortfolioURL   *string            `json:"portfolio_url,omitempty" validate:"omitempty,url"`
	ExpectedSalary *float64           `json:"expected_salary,omitempty" validate:"omitempty,min=0"`
	AvailableFrom  *time.Time         `json:"available_from,omitempty"`
	AvailableTo    *time.Time         `json:"available_to,omitempty"`
	Notes          *string            `json:"notes,omitempty" validate:"omitempty,max=1000"`
	Status         *ApplicationStatus `json:"status,omitempty"`
}

type ApplicationFilters struct {
	StudentID    *uuid.UUID
	InternshipID *uuid.UUID
	CompanyID    *uuid.UUID
	Status       *ApplicationStatus
	FromDate     *time.Time
	ToDate       *time.Time
	Limit        int
	Offset       int
}
