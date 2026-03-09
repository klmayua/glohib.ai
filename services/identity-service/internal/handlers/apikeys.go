package handlers

import (
	"net/http"
	"time"
	"github.com/gin-gonic/gin"
	"github.com/glohib/identity-service/internal/db"
	"github.com/glohib/identity-service/internal/logger"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

type APIKeyHandler struct {
	db *db.DB
}

func NewAPIKeyHandler(db *db.DB) *APIKeyHandler {
	return &APIKeyHandler{db: db}
}

func (h *APIKeyHandler) Create(c *gin.Context) {
	userID := c.GetString("user_id")
	key := "glohib_" + uuid.NewString()

	_, err := h.db.Exec(c, `
		INSERT INTO api_keys (id, user_id, key_hash, created_at)
		VALUES ($1, $2, $3, $4)
	`, uuid.New(), userID, key, time.Now())
	if err != nil {
		logger.Error("insert api key failed", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal error"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"api_key": key})
}

func (h *APIKeyHandler) List(c *gin.Context) {
	userID := c.GetString("user_id")
	rows, err := h.db.Query(c, `
		SELECT id, created_at FROM api_keys WHERE user_id=$1 ORDER BY created_at DESC
	`, userID)
	if err != nil {
		logger.Error("list api keys failed", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal error"})
		return
	}
	defer rows.Close()

	type Key struct {
		ID        string    `json:"id"`
		CreatedAt time.Time `json:"created_at"`
	}
	var keys []Key
	for rows.Next() {
		var k Key
		if err := rows.Scan(&k.ID, &k.CreatedAt); err != nil {
			continue
		}
		keys = append(keys, k)
	}
	c.JSON(http.StatusOK, gin.H{"api_keys": keys})
}

func (h *APIKeyHandler) Delete(c *gin.Context) {
	userID := c.GetString("user_id")
	keyID := c.Param("id")

	_, err := h.db.Exec(c, `DELETE FROM api_keys WHERE id=$1 AND user_id=$2`, keyID, userID)
	if err != nil {
		logger.Error("delete api key failed", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}
