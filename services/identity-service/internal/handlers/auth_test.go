package handlers_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/glohib/identity-service/internal/handlers"
	"github.com/glohib/identity-service/internal/config"
	"github.com/glohib/identity-service/internal/jwt"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// MockRedisClient is a mock implementation of Redis client
type MockRedisClient struct {
	mock.Mock
}

func (m *MockRedisClient) Set(key, value string, expiry int) error {
	args := m.Called(key, value, expiry)
	return args.Error(0)
}

func (m *MockRedisClient) Get(key string) (string, error) {
	args := m.Called(key)
	return args.String(0), args.Error(1)
}

func (m *MockRedisClient) Delete(key string) error {
	args := m.Called(key)
	return args.Error(0)
}

func (m *MockRedisClient) Close() {
	m.Called()
}

// MockDatabase is a mock implementation of database interface
type MockDatabase struct {
	mock.Mock
}

func (m *MockDatabase) CreateUser(user *handlers.User) error {
	args := m.Called(user)
	return args.Error(0)
}

func (m *MockDatabase) GetUserByEmail(email string) (*handlers.User, error) {
	args := m.Called(email)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*handlers.User), args.Error(1)
}

func (m *MockDatabase) GetUserByID(id string) (*handlers.User, error) {
	args := m.Called(id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*handlers.User), args.Error(1)
}

func (m *MockDatabase) Close() {
	m.Called()
}

func TestRegisterHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)

	db := new(MockDatabase)
	redisClient := new(MockRedisClient)
	jwtHelper := jwt.NewHelper(&jwt.Config{
		Secret:         "test-secret-key-minimum-32-characters",
		AccessExpiry:   15,
		RefreshExpiry:  7,
	})
	cfg := &config.Config{}

	handler := handlers.NewAuthHandler(db, redisClient, jwtHelper, cfg)

	t.Run("successful registration", func(t *testing.T) {
		user := &handlers.User{
			ID:       "12345",
			Email:    "test@example.com",
			Password: "password123",
		}

		db.On("GetUserByEmail", user.Email).Return(nil, nil)
		db.On("CreateUser", mock.Anything).Return(nil)

		body, _ := json.Marshal(map[string]string{
			"email":    user.Email,
			"password": user.Password,
		})

		req, _ := http.NewRequest("POST", "/api/v1/auth/register", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()

		handler.Register(c, w, req)

		assert.Equal(t, http.StatusCreated, w.Code)
		db.AssertExpectations(t)
	})

	t.Run("duplicate email", func(t *testing.T) {
		existingUser := &handlers.User{
			ID:    "99999",
			Email: "existing@example.com",
		}

		db.On("GetUserByEmail", existingUser.Email).Return(existingUser, nil)

		body, _ := json.Marshal(map[string]string{
			"email":    existingUser.Email,
			"password": "password123",
		})

		req, _ := http.NewRequest("POST", "/api/v1/auth/register", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()

		handler.Register(c, w, req)

		assert.Equal(t, http.StatusConflict, w.Code)
		db.AssertExpectations(t)
	})
}

func TestLoginHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)

	db := new(MockDatabase)
	redisClient := new(MockRedisClient)
	jwtHelper := jwt.NewHelper(&jwt.Config{
		Secret:         "test-secret-key-minimum-32-characters",
		AccessExpiry:   15,
		RefreshExpiry:  7,
	})
	cfg := &config.Config{}

	handler := handlers.NewAuthHandler(db, redisClient, jwtHelper, cfg)

	t.Run("successful login", func(t *testing.T) {
		user := &handlers.User{
			ID:       "12345",
			Email:    "test@example.com",
			Password: "$2a$10$hashedpassword", // bcrypt hash
		}

		db.On("GetUserByEmail", user.Email).Return(user, nil)

		body, _ := json.Marshal(map[string]string{
			"email":    user.Email,
			"password": "password123",
		})

		req, _ := http.NewRequest("POST", "/api/v1/auth/login", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()

		handler.Login(c, w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		db.AssertExpectations(t)
	})

	t.Run("invalid credentials", func(t *testing.T) {
		user := &handlers.User{
			ID:       "12345",
			Email:    "test@example.com",
			Password: "$2a$10$hashedpassword",
		}

		db.On("GetUserByEmail", user.Email).Return(user, nil)

		body, _ := json.Marshal(map[string]string{
			"email":    user.Email,
			"password": "wrongpassword",
		})

		req, _ := http.NewRequest("POST", "/api/v1/auth/login", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()

		handler.Login(c, w, req)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
		db.AssertExpectations(t)
	})
}
