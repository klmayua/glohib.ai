package models

import (
	"time"
	"github.com/google/uuid"
)

type Student struct {
	ID                uuid.UUID  `json:"id" db:"id"`
	UserID            uuid.UUID  `json:"user_id" db:"user_id"`
	FirstName         string     `json:"first_name" db:"first_name"`
	LastName          string     `json:"last_name" db:"last_name"`
	Email             string     `json:"email" db:"email"`
	Phone             *string    `json:"phone,omitempty" db:"phone"`
	DateOfBirth       *time.Time `json:"date_of_birth,omitempty" db:"date_of_birth"`
	Gender            *string    `json:"gender,omitempty" db:"gender"`
	Nationality       *string    `json:"nationality,omitempty" db:"nationality"`
	Address           *string    `json:"address,omitempty" db:"address"`
	City              *string    `json:"city,omitempty" db:"city"`
	State             *string    `json:"state,omitempty" db:"state"`
	Country           *string    `json:"country,omitempty" db:"country"`
	PostalCode        *string    `json:"postal_code,omitempty" db:"postal_code"`
	ProfilePictureURL *string    `json:"profile_picture_url,omitempty" db:"profile_picture_url"`
	Bio               *string    `json:"bio,omitempty" db:"bio"`
	LinkedInURL       *string    `json:"linkedin_url,omitempty" db:"linkedin_url"`
	GitHubURL         *string    `json:"github_url,omitempty" db:"github_url"`
	WebsiteURL        *string    `json:"website_url,omitempty" db:"website_url"`
	IsActive          bool       `json:"is_active" db:"is_active"`
	ProfileComplete   float64    `json:"profile_complete" db:"profile_complete"`
	CreatedAt         time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt         time.Time  `json:"updated_at" db:"updated_at"`
	DeletedAt         *time.Time `json:"deleted_at,omitempty" db:"deleted_at"`
}

type StudentCreate struct {
	UserID            uuid.UUID  `json:"user_id" validate:"required"`
	FirstName         string     `json:"first_name" validate:"required,min=1,max=100"`
	LastName          string     `json:"last_name" validate:"required,min=1,max=100"`
	Email             string     `json:"email" validate:"required,email"`
	Phone             *string    `json:"phone,omitempty" validate:"omitempty,e164"`
	DateOfBirth       *time.Time `json:"date_of_birth,omitempty"`
	Gender            *string    `json:"gender,omitempty" validate:"omitempty,oneof=male female other"`
	Nationality       *string    `json:"nationality,omitempty"`
	Address           *string    `json:"address,omitempty"`
	City              *string    `json:"city,omitempty"`
	State             *string    `json:"state,omitempty"`
	Country           *string    `json:"country,omitempty"`
	PostalCode        *string    `json:"postal_code,omitempty"`
	ProfilePictureURL *string    `json:"profile_picture_url,omitempty" validate:"omitempty,url"`
	Bio               *string    `json:"bio,omitempty" validate:"omitempty,max=2000"`
	LinkedInURL       *string    `json:"linkedin_url,omitempty" validate:"omitempty,url"`
	GitHubURL         *string    `json:"github_url,omitempty" validate:"omitempty,url"`
	WebsiteURL        *string    `json:"website_url,omitempty" validate:"omitempty,url"`
}

type StudentUpdate struct {
	FirstName         *string    `json:"first_name,omitempty" validate:"omitempty,min=1,max=100"`
	LastName          *string    `json:"last_name,omitempty" validate:"omitempty,min=1,max=100"`
	Email             *string    `json:"email,omitempty" validate:"omitempty,email"`
	Phone             *string    `json:"phone,omitempty" validate:"omitempty,e164"`
	DateOfBirth       *time.Time `json:"date_of_birth,omitempty"`
	Gender            *string    `json:"gender,omitempty" validate:"omitempty,oneof=male female other"`
	Nationality       *string    `json:"nationality,omitempty"`
	Address           *string    `json:"address,omitempty"`
	City              *string    `json:"city,omitempty"`
	State             *string    `json:"state,omitempty"`
	Country           *string    `json:"country,omitempty"`
	PostalCode        *string    `json:"postal_code,omitempty"`
	ProfilePictureURL *string    `json:"profile_picture_url,omitempty" validate:"omitempty,url"`
	Bio               *string    `json:"bio,omitempty" validate:"omitempty,max=2000"`
	LinkedInURL       *string    `json:"linkedin_url,omitempty" validate:"omitempty,url"`
	GitHubURL         *string    `json:"github_url,omitempty" validate:"omitempty,url"`
	WebsiteURL        *string    `json:"website_url,omitempty" validate:"omitempty,url"`
	IsActive          *bool      `json:"is_active,omitempty"`
}

type Skill struct {
	ID          uuid.UUID `json:"id" db:"id"`
	StudentID   uuid.UUID `json:"student_id" db:"student_id"`
	Name        string    `json:"name" db:"name"`
	Proficiency int       `json:"proficiency" db:"proficiency"`
	Category    *string   `json:"category,omitempty" db:"category"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

type SkillCreate struct {
	StudentID   uuid.UUID `json:"student_id"`
	Name        string    `json:"name" validate:"required,min=1,max=100"`
	Proficiency int       `json:"proficiency" validate:"required,min=1,max=5"`
	Category    *string   `json:"category,omitempty" validate:"omitempty,max=50"`
}

type Education struct {
	ID           uuid.UUID  `json:"id" db:"id"`
	StudentID    uuid.UUID  `json:"student_id" db:"student_id"`
	Institution  string     `json:"institution" db:"institution"`
	Degree       string     `json:"degree" db:"degree"`
	FieldOfStudy string     `json:"field_of_study" db:"field_of_study"`
	StartDate    time.Time  `json:"start_date" db:"start_date"`
	EndDate      *time.Time `json:"end_date,omitempty" db:"end_date"`
	GPA          *float64   `json:"gpa,omitempty" db:"gpa"`
	Description  *string    `json:"description,omitempty" db:"description"`
	IsCurrent    bool       `json:"is_current" db:"is_current"`
	CreatedAt    time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at" db:"updated_at"`
}

type EducationCreate struct {
	StudentID    uuid.UUID  `json:"student_id"`
	Institution  string     `json:"institution" validate:"required,min=1,max=200"`
	Degree       string     `json:"degree" validate:"required,min=1,max=100"`
	FieldOfStudy string     `json:"field_of_study" validate:"required,min=1,max=100"`
	StartDate    time.Time  `json:"start_date" validate:"required"`
	EndDate      *time.Time `json:"end_date,omitempty"`
	GPA          *float64   `json:"gpa,omitempty" validate:"omitempty,min=0,max=4"`
	Description  *string    `json:"description,omitempty" validate:"omitempty,max=1000"`
	IsCurrent    bool       `json:"is_current"`
}

type Experience struct {
	ID          uuid.UUID  `json:"id" db:"id"`
	StudentID   uuid.UUID  `json:"student_id" db:"student_id"`
	Company     string     `json:"company" db:"company"`
	Position    string     `json:"position" db:"position"`
	StartDate   time.Time  `json:"start_date" db:"start_date"`
	EndDate     *time.Time `json:"end_date,omitempty" db:"end_date"`
	Description *string    `json:"description,omitempty" db:"description"`
	IsCurrent   bool       `json:"is_current" db:"is_current"`
	CreatedAt   time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at" db:"updated_at"`
}

type ExperienceCreate struct {
	StudentID   uuid.UUID  `json:"student_id"`
	Company     string     `json:"company" validate:"required,min=1,max=100"`
	Position    string     `json:"position" validate:"required,min=1,max=100"`
	StartDate   time.Time  `json:"start_date" validate:"required"`
	EndDate     *time.Time `json:"end_date,omitempty"`
	Description *string    `json:"description,omitempty" validate:"omitempty,max=2000"`
	IsCurrent   bool       `json:"is_current"`
}
