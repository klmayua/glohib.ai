package router

import (
	"github.com/gin-gonic/gin"
	"github.com/glohib/identity-service/internal/handlers"
	"github.com/glohib/identity-service/internal/middleware"
	"github.com/glohib/identity-service/internal/jwt"
)

func New(authHandler *handlers.AuthHandler, oauthHandler *handlers.OAuthHandler, apiKeyHandler *handlers.APIKeyHandler, jwtHelper *jwt.Helper) *gin.Engine {
	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery())

	v1 := r.Group("/api/v1")
	{
		auth := v1.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
			auth.POST("/logout", authHandler.Logout)
			auth.POST("/refresh", authHandler.Refresh)
			auth.GET("/me", middleware.Auth(jwtHelper), authHandler.Me)
		}

		oauth := v1.Group("/oauth")
		{
			oauth.POST("/google", oauthHandler.GoogleLogin)
			oauth.GET("/google/callback", oauthHandler.GoogleCallback)
		}

		keys := v1.Group("/apikeys")
		keys.Use(middleware.Auth(jwtHelper))
		{
			keys.POST("", apiKeyHandler.Create)
			keys.GET("", apiKeyHandler.List)
			keys.DELETE("/:id", apiKeyHandler.Delete)
		}
	}

	return r
}
