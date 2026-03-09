package middleware

import (
	"net/http"
	"strings"
	"github.com/gin-gonic/gin"
	"github.com/glohib/identity-service/internal/jwt"
)

func Auth(jwtHelper *jwt.Helper) gin.HandlerFunc {
	return func(c *gin.Context) {
		auth := c.GetHeader("Authorization")
		if auth == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing token"})
			return
		}
		bearer := strings.Split(auth, " ")
		if len(bearer) != 2 || bearer[0] != "Bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token format"})
			return
		}
		claims, err := jwtHelper.ValidateToken(bearer[1])
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			return
		}
		c.Set("user_id", claims.UserID)
		c.Set("roles", claims.Roles)
		c.Next()
	}
}
