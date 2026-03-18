package jwt

import (
	"time"
	"github.com/glohib/identity-service/internal/config"
	"github.com/glohib/identity-service/internal/models"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type Helper struct {
	cfg *config.JWTConfig
}

func NewHelper(cfg *config.JWTConfig) *Helper {
	return &Helper{cfg: cfg}
}

func (h *Helper) GenerateTokens(userID string, roles []string) (*models.TokenPair, error) {
	accessExpiry := time.Duration(h.cfg.AccessExpiry) * time.Minute
	
	accessClaims := models.Claims{
		UserID: userID,
		Roles:  roles,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(accessExpiry)),
			ID:        uuid.NewString(),
		},
	}
	refreshClaims := jwt.RegisteredClaims{
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Duration(h.cfg.RefreshExpiry) * time.Hour * 24)),
		ID:        uuid.NewString(),
	}

	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)

	accessSigned, err := accessToken.SignedString([]byte(h.cfg.Secret))
	if err != nil {
		return nil, err
	}
	refreshSigned, err := refreshToken.SignedString([]byte(h.cfg.Secret))
	if err != nil {
		return nil, err
	}

	return &models.TokenPair{
		AccessToken:  accessSigned,
		RefreshToken: refreshSigned,
	}, nil
}

func (h *Helper) ValidateToken(tokenString string) (*models.Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &models.Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(h.cfg.Secret), nil
	})
	if err != nil {
		return nil, err
	}
	if claims, ok := token.Claims.(*models.Claims); ok && token.Valid {
		return claims, nil
	}
	return nil, jwt.ErrSignatureInvalid
}
