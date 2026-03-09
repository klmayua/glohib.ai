package models

import (
	"time"
	"github.com/google/uuid"
)

type User struct {
	ID         uuid.UUID `json:"id" db:"id"`
	Email      string    `json:"email" db:"email"`
	Password   string    `json:"-" db:"password_hash"`
	Roles      []string  `json:"roles" db:"roles"`
	Provider   string    `json:"provider" db:"provider"`
	ProviderID string    `json:"provider_id" db:"provider_id"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
	UpdatedAt  time.Time `json:"updated_at" db:"updated_at"`
}

type RegisterRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
	Role     string `json:"role" binding:"required,oneof=student employer mentor institution admin"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}
