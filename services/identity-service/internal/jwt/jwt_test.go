package jwt_test

import (
	"testing"
	"time"
	"github.com/glohib/identity-service/internal/jwt"
	"github.com/stretchr/testify/assert"
)

func TestNewHelper(t *testing.T) {
	config := &jwt.Config{
		Secret:         "test-secret-key-minimum-32-characters",
		AccessExpiry:   15,  // 15 minutes
		RefreshExpiry:  7,   // 7 days
	}

	helper := jwt.NewHelper(config)
	assert.NotNil(t, helper)
}

func TestGenerateToken(t *testing.T) {
	config := &jwt.Config{
		Secret:         "test-secret-key-minimum-32-characters",
		AccessExpiry:   15,
		RefreshExpiry:  7,
	}

	helper := jwt.NewHelper(config)

	claims := jwt.Claims{
		UserID:   "12345",
		Email:    "test@example.com",
	}

	token, err := helper.GenerateToken(claims)
	assert.NoError(t, err)
	assert.NotEmpty(t, token)
}

func TestValidateToken(t *testing.T) {
	config := &jwt.Config{
		Secret:         "test-secret-key-minimum-32-characters",
		AccessExpiry:   15,
		RefreshExpiry:  7,
	}

	helper := jwt.NewHelper(config)

	claims := jwt.Claims{
		UserID:   "12345",
		Email:    "test@example.com",
	}

	token, err := helper.GenerateToken(claims)
	assert.NoError(t, err)

	validatedClaims, err := helper.ValidateToken(token)
	assert.NoError(t, err)
	assert.Equal(t, "12345", validatedClaims.UserID)
	assert.Equal(t, "test@example.com", validatedClaims.Email)
}

func TestValidateTokenExpired(t *testing.T) {
	config := &jwt.Config{
		Secret:         "test-secret-key-minimum-32-characters",
		AccessExpiry:   -1, // Expired token
		RefreshExpiry:  7,
	}

	helper := jwt.NewHelper(config)

	claims := jwt.Claims{
		UserID:   "12345",
		Email:    "test@example.com",
	}

	token, err := helper.GenerateToken(claims)
	assert.NoError(t, err)

	_, err = helper.ValidateToken(token)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "token expired")
}

func TestGenerateRefreshToken(t *testing.T) {
	config := &jwt.Config{
		Secret:         "test-secret-key-minimum-32-characters",
		AccessExpiry:   15,
		RefreshExpiry:  7,
	}

	helper := jwt.NewHelper(config)

	userID := "12345"
	refreshToken, err := helper.GenerateRefreshToken(userID)
	assert.NoError(t, err)
	assert.NotEmpty(t, refreshToken)
}

func TestValidateRefreshToken(t *testing.T) {
	config := &jwt.Config{
		Secret:         "test-secret-key-minimum-32-characters",
		AccessExpiry:   15,
		RefreshExpiry:  7,
	}

	helper := jwt.NewHelper(config)

	userID := "12345"
	refreshToken, err := helper.GenerateRefreshToken(userID)
	assert.NoError(t, err)

	validatedUserID, err := helper.ValidateRefreshToken(refreshToken)
	assert.NoError(t, err)
	assert.Equal(t, userID, validatedUserID)
}
