package handlers

import (
	"net/http"
	"strings"
	"time"
	"github.com/gin-gonic/gin"
	"github.com/glohib/identity-service/internal/config"
	"github.com/glohib/identity-service/internal/db"
	"github.com/glohib/identity-service/internal/jwt"
	"github.com/glohib/identity-service/internal/logger"
	"github.com/glohib/identity-service/internal/models"
	"github.com/glohib/identity-service/internal/redis"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
)

func generateID() string {
	return uuid.New().String()
}

type AuthHandler struct {
	db    *db.DB
	redis *redis.Client
	jwt   *jwt.Helper
	cfg   *config.Config
}

func NewAuthHandler(db *db.DB, redis *redis.Client, jwt *jwt.Helper, cfg *config.Config) *AuthHandler {
	return &AuthHandler{db: db, redis: redis, jwt: jwt, cfg: cfg}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req models.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		logger.Error("hash password failed", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal error"})
		return
	}

	user := models.User{
		ID:        generateID(),
		Email:     req.Email,
		Password:  string(hashed),
		Roles:     []string{strings.ToUpper(req.Role)},
		Provider:  "local",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	_, err = h.db.Exec(c, `
		INSERT INTO users (id, email, password, role, status, "createdAt", "updatedAt")
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`, user.ID, user.Email, user.Password, user.Roles[0], "ACTIVE", user.CreatedAt, user.UpdatedAt)
	if err != nil {
		logger.Error("insert user failed", zap.Error(err))
		c.JSON(http.StatusConflict, gin.H{"error": "user exists"})
		return
	}

	tokens, err := h.jwt.GenerateTokens(user.ID, user.Roles)
	if err != nil {
		logger.Error("generate tokens failed", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal error"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"tokens": tokens})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	var role string
	err := h.db.QueryRow(c, `
		SELECT id, email, password, role FROM users WHERE email=$1
	`, req.Email).Scan(&user.ID, &user.Email, &user.Password, &role)
	if err != nil {
		logger.Error("login query error", zap.Error(err), zap.String("email", req.Email))
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}
	user.Roles = []string{role}
	logger.Info("user found", zap.String("email", req.Email), zap.String("role", role))

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		logger.Error("password comparison failed", zap.String("email", req.Email))
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}
	logger.Info("password verified", zap.String("email", req.Email))

	tokens, err := h.jwt.GenerateTokens(user.ID, user.Roles)
	if err != nil {
		logger.Error("generate tokens failed", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal error"})
		return
	}

	h.redis.Set(c, "refresh:"+tokens.RefreshToken, user.ID, time.Duration(h.cfg.JWT.RefreshExpiry)*24*time.Hour)

	c.JSON(http.StatusOK, gin.H{"tokens": tokens})
}

func (h *AuthHandler) Logout(c *gin.Context) {
	refreshToken := c.GetHeader("X-Refresh-Token")
	if refreshToken == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing refresh token"})
		return
	}
	h.redis.Del(c, "refresh:"+refreshToken)
	c.JSON(http.StatusOK, gin.H{"message": "logged out"})
}

func (h *AuthHandler) Refresh(c *gin.Context) {
	var body struct {
		RefreshToken string `json:"refresh_token" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, err := h.redis.Get(c, "refresh:"+body.RefreshToken).Result()
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid refresh token"})
		return
	}

	var roles []string
	var role string
	err = h.db.QueryRow(c, `SELECT role FROM users WHERE id=$1`, userID).Scan(&role)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user not found"})
		return
	}
	roles = []string{role}

	tokens, err := h.jwt.GenerateTokens(userID, roles)
	if err != nil {
		logger.Error("generate tokens failed", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal error"})
		return
	}

	h.redis.Del(c, "refresh:"+body.RefreshToken)
	h.redis.Set(c, "refresh:"+tokens.RefreshToken, userID, time.Duration(h.cfg.JWT.RefreshExpiry)*24*time.Hour)

	c.JSON(http.StatusOK, gin.H{"tokens": tokens})
}

func (h *AuthHandler) Me(c *gin.Context) {
	userID := c.GetString("user_id")
	var user models.User
	var role string
	var createdAt interface{}
	err := h.db.QueryRow(c, `
		SELECT id, email, role, "createdAt" FROM users WHERE id=$1
	`, userID).Scan(&user.ID, &user.Email, &role, &createdAt)
	if err != nil {
		logger.Error("Me query error", zap.Error(err), zap.String("user_id", userID))
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}
	user.Roles = []string{role}
	c.JSON(http.StatusOK, user)
}
