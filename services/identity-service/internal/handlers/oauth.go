package handlers

import (
	"context"
	"encoding/json"
	"net/http"
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
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

type OAuthHandler struct {
	db     *db.DB
	redis  *redis.Client
	jwt    *jwt.Helper
	cfg    *config.Config
	google *oauth2.Config
}

func NewOAuthHandler(db *db.DB, redis *redis.Client, jwt *jwt.Helper, cfg *config.Config) *OAuthHandler {
	googleConfig := &oauth2.Config{
		ClientID:     cfg.OAuth.GoogleClientID,
		ClientSecret: cfg.OAuth.GoogleClientSecret,
		RedirectURL:  cfg.OAuth.GoogleRedirectURL,
		Scopes:       []string{"openid", "profile", "email"},
		Endpoint:     google.Endpoint,
	}
	return &OAuthHandler{
		db:     db,
		redis:  redis,
		jwt:    jwt,
		cfg:    cfg,
		google: googleConfig,
	}
}

func (h *OAuthHandler) GoogleLogin(c *gin.Context) {
	state := uuid.NewString()
	h.redis.Set(c, "oauth:state:"+state, "pending", 10*time.Minute)
	url := h.google.AuthCodeURL(state)
	c.JSON(http.StatusOK, gin.H{"url": url})
}

func (h *OAuthHandler) GoogleCallback(c *gin.Context) {
	state := c.Query("state")
	code := c.Query("code")

	val, err := h.redis.Get(c, "oauth:state:"+state).Result()
	if err != nil || val != "pending" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid state"})
		return
	}

	token, err := h.google.Exchange(context.Background(), code)
	if err != nil {
		logger.Error("exchange code failed", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "oauth exchange failed"})
		return
	}

	client := h.google.Client(context.Background(), token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		logger.Error("get userinfo failed", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "fetch userinfo failed"})
		return
	}
	defer resp.Body.Close()

	var googleUser struct {
		ID    string `json:"id"`
		Email string `json:"email"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&googleUser); err != nil {
		logger.Error("decode userinfo failed", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "decode userinfo failed"})
		return
	}

	var user models.User
	err = h.db.QueryRow(c, `
		SELECT id, email, roles FROM users WHERE provider=$1 AND provider_id=$2
	`, "google", googleUser.ID).Scan(&user.ID, &user.Email, &user.Roles)
	if err != nil {
		user = models.User{
			ID:         uuid.New(),
			Email:      googleUser.Email,
			Roles:      []string{"student"},
			Provider:   "google",
			ProviderID: googleUser.ID,
			CreatedAt:  time.Now(),
			UpdatedAt:  time.Now(),
		}
		_, err = h.db.Exec(c, `
			INSERT INTO users (id, email, roles, provider, provider_id, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
		`, user.ID, user.Email, user.Roles, user.Provider, user.ProviderID, user.CreatedAt, user.UpdatedAt)
		if err != nil {
			logger.Error("insert google user failed", zap.Error(err))
			c.JSON(http.StatusInternalServerError, gin.H{"error": "create user failed"})
			return
		}
	}

	tokens, err := h.jwt.GenerateTokens(user.ID.String(), user.Roles)
	if err != nil {
		logger.Error("generate tokens failed", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal error"})
		return
	}

	h.redis.Set(c, "refresh:"+tokens.RefreshToken, user.ID.String(), time.Duration(h.cfg.JWT.RefreshExpiry)*24*time.Hour)

	c.JSON(http.StatusOK, gin.H{"tokens": tokens})
}
