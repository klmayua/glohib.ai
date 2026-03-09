package models

import (
	"time"
	"github.com/google/uuid"
)

type Internship struct {
	ID          string    `json:"id" db:"id"`
	EmployerID  string    `json:"employer_id" db:"employer_id"`
	Title       string    `json:"title" db:"title"`
	Description string    `json:"description" db:"description"`
	Location    string    `json:"location" db:"location"`
	Remote      bool      `json:"remote" db:"remote"`
	Paid        bool      `json:"paid" db:"paid"`
	Duration    string    `json:"duration" db:"duration"`
	Skills      []string  `json:"skills" db:"skills"`
	Tags        []string  `json:"tags" db:"tags"`
	Vector      []float32 `json:"vector,omitempty" db:"vector"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

func NewInternship(employerID, title, description, location, duration string, remote, paid bool, skills, tags []string) *Internship {
	return &Internship{
		ID:          uuid.NewString(),
		EmployerID:  employerID,
		Title:       title,
		Description: description,
		Location:    location,
		Remote:      remote,
		Paid:        paid,
		Duration:    duration,
		Skills:      skills,
		Tags:        tags,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}
}

type Application struct {
	ID           string    `json:"id" db:"id"`
	InternshipID string    `json:"internship_id" db:"internship_id"`
	StudentID    string    `json:"student_id" db:"student_id"`
	Status       string    `json:"status" db:"status"`
	AppliedAt    time.Time `json:"applied_at" db:"applied_at"`
}

func NewApplication(internshipID, studentID string) *Application {
	return &Application{
		ID:           uuid.NewString(),
		InternshipID: internshipID,
		StudentID:    studentID,
		Status:       "pending",
		AppliedAt:    time.Now(),
	}
}
