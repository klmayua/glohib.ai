# GLOHIB.AI - STEP 4: IDENTITY SERVICE (GO)
**Generated:** 2026-02-28 03:36:08

---

```yaml
id: identity-service-go-atomic-spec
name: "Glohib.ai Identity Service - Go Implementation"
phase: "Step 4"
priority: "P0"
estimate: "8h"
context: |
  Build a production-grade Identity Service in Go that handles authentication, OAuth2, role management, API keys, and JWT tokens.
  The service exposes REST and gRPC interfaces, stores data in PostgreSQL and Redis, and integrates with Google OAuth2.
  All endpoints include proper validation, logging, and error handling.

tasks:
  # 1. Project bootstrap
  - id: task-1
    name: "Initialize Go module"
    action: shell_command
    command: |
      mkdir -p identity-service && cd identity-service
      go mod init github.com/glohib/identity-service
      go get github.com/gin-gonic/gin@latest
      go get github.com/golang-jwt/jwt/v5@latest
      go get golang.org/x/crypto/bcrypt@latest
      go get google.golang.org/grpc@latest
      go get github.com/jackc/pgx/v5@latest
      go get github.com/redis/go-redis/v9@latest
      go get github.com/google/uuid@latest
      go get github.com/spf13/viper@latest
      go get go.uber.org/zap@latest

  # 2. Proto definition
  - id: task-2
    name: "Create gRPC proto"
    action: create_file
    path: identity-service/pkg/proto/identity.proto
    content: |
      syntax = "proto3";

      package identity.v1;

      option go_package = "github.com/glohib/identity-service/pkg/proto/identityv1";

      service IdentityService {
        rpc ValidateToken(ValidateTokenRequest) returns (ValidateTokenResponse);
        rpc GetUser(GetUserRequest) returns (GetUserResponse);
        rpc GetAPIKey(GetAPIKeyRequest) returns (GetAPIKeyResponse);
      }

      message ValidateTokenRequest {
        string token = 1;
      }

      message ValidateTokenResponse {
        bool valid = 1;
        string user_id = 2;
        repeated string roles = 3;
      }

      message GetUserRequest {
        string user_id = 1;
      }

      message GetUserResponse {
        string user_id = 1;
        string email = 2;
        repeated string roles = 3;
      }

      message GetAPIKeyRequest {
        string key = 1;
      }

      message GetAPIKeyResponse {
        string api_key_id = 1;
        string user_id = 2;
        repeated string roles = 3;
      }

  # 3. Models
  - id: task-3
    name: "Create user model"
    action: create_file
    path: identity-service/internal/models/user.go
    content: |
      package models

      import (
        "time"
        "github.com/google/uuid"
      )

      type User struct {
        ID        uuid.UUID `json:"id" db:"id"`
        Email     string    `json:"email" db:"email"`
        Password  string    `json:"-" db:"password_hash"`
        Roles     []string  `json:"roles" db:"roles"`
        Provider  string    `json:"provider" db:"provider"`
        ProviderID string   `json:"provider_id" db:"provider_id"`
        CreatedAt time.Time `json:"created_at" db:"created_at"`
        UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
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

  - id: task-4
    name: "Create token model"
    action: create_file
    path: identity-service/internal/models/token.go
    content: |
      package models

      import "github.com/golang-jwt/jwt/v5"

      type Claims struct {
        UserID string   `json:"user_id"`
        Roles  []string `json:"roles"`
        jwt.RegisteredClaims
      }

      type TokenPair struct {
        AccessToken  string `json:"access_token"`
        RefreshToken string `json:"refresh_token"`
      }

  # 4. Configuration
  - id: task-5
    name: "Create config"
    action: create_file
    path: identity-service/internal/config/config.go
    content: |
      package config

      import (
        "github.com/spf13/viper"
      )

      type Config struct {
        Server   ServerConfig
        Database DBConfig
        Redis    RedisConfig
        JWT      JWTConfig
        OAuth    OAuthConfig
      }

      type ServerConfig struct {
        Port         string
        GRPCPort     string
        ReadTimeout  int
        WriteTimeout int
      }

      type DBConfig struct {
        Host     string
        Port     int
        User     string
        Password string
        DBName   string
        SSLMode  string
      }

      type RedisConfig struct {
        Addr     string
        Password string
        DB       int
      }

      type JWTConfig struct {
        Secret         string
        AccessExpiry   int
        RefreshExpiry  int
      }

      type OAuthConfig struct {
        GoogleClientID     string
        GoogleClientSecret string
        GoogleRedirectURL  string
      }

      func Load() (*Config, error) {
        viper.SetConfigName("config")
        viper.SetConfigType("yaml")
        viper.AddConfigPath(".")
        viper.AutomaticEnv()

        if err := viper.ReadInConfig(); err != nil {
          return nil, err
        }

        var cfg Config
        if err := viper.Unmarshal(&cfg); err != nil {
          return nil, err
        }
        return &cfg, nil
      }

  # 5. Logger
  - id: task-6
    name: "Create logger"
    action: create_file
    path: identity-service/internal/logger/logger.go
    content: |
      package logger

      import "go.uber.org/zap"

      var log *zap.Logger

      func Init() error {
        var err error
        log, err = zap.NewProduction()
        return err
      }

      func Info(msg string, fields ...zap.Field) {
        log.Info(msg, fields...)
      }

      func Error(msg string, fields ...zap.Field) {
        log.Error(msg, fields...)
      }

      func Fatal(msg string, fields ...zap.Field) {
        log.Fatal(msg, fields...)
      }

  # 6. Database
  - id: task-7
    name: "Create database connection"
    action: create_file
    path: identity-service/internal/db/db.go
    content: |
      package db

      import (
        "context"
        "fmt"
        "github.com/glohib/identity-service/internal/config"
        "github.com/jackc/pgx/v5/pgxpool"
      )

      type DB struct {
        *pgxpool.Pool
      }

      func New(cfg *config.DBConfig) (*DB, error) {
        dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
          cfg.Host, cfg.Port, cfg.User, cfg.Password, cfg.DBName, cfg.SSLMode)
        pool, err := pgxpool.New(context.Background(), dsn)
        if err != nil {
          return nil, err
        }
        return &DB{pool}, nil
      }

  # 7. Redis
  - id: task-8
    name: "Create Redis client"
    action: create_file
    path: identity-service/internal/redis/redis.go
    content: |
      package redis

      import (
        "context"
        "github.com/glohib/identity-service/internal/config"
        "github.com/redis/go-redis/v9"
      )

      type Client struct {
        *redis.Client
      }

      func New(cfg *config.RedisConfig) *Client {
        rdb := redis.NewClient(&redis.Options{
          Addr:     cfg.Addr,
          Password: cfg.Password,
          DB:       cfg.DB,
        })
        return &Client{rdb}
      }

  # 8. JWT helper
  - id: task-9
    name: "Create JWT helper"
    action: create_file
    path: identity-service/internal/jwt/jwt.go
    content: |
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
        accessClaims := models.Claims{
          UserID: userID,
          Roles:  roles,
          RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Duration(h.cfg.AccessExpiry) * time.Minute)),
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

  # 9. Auth handlers
  - id: task-10
    name: "Create auth handlers"
    action: create_file
    path: identity-service/internal/handlers/auth.go
    content: |
      package handlers

      import (
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
        "golang.org/x/crypto/bcrypt"
      )

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
          ID:        uuid.New(),
          Email:     req.Email,
          Password:  string(hashed),
          Roles:     []string{req.Role},
          Provider:  "local",
          CreatedAt: time.Now(),
          UpdatedAt: time.Now(),
        }

        _, err = h.db.Exec(c, `
          INSERT INTO users (id, email, password_hash, roles, provider, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, user.ID, user.Email, user.Password, user.Roles, user.Provider, user.CreatedAt, user.UpdatedAt)
        if err != nil {
          logger.Error("insert user failed", zap.Error(err))
          c.JSON(http.StatusConflict, gin.H{"error": "user exists"})
          return
        }

        tokens, err := h.jwt.GenerateTokens(user.ID.String(), user.Roles)
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
        err := h.db.QueryRow(c, `
          SELECT id, email, password_hash, roles FROM users WHERE email=$1
        `, req.Email).Scan(&user.ID, &user.Email, &user.Password, &user.Roles)
        if err != nil {
          c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
          return
        }

        if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
          c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
          return
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
        err = h.db.QueryRow(c, `SELECT roles FROM users WHERE id=$1`, userID).Scan(&roles)
        if err != nil {
          c.JSON(http.StatusUnauthorized, gin.H{"error": "user not found"})
          return
        }

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
        err := h.db.QueryRow(c, `
          SELECT id, email, roles, created_at FROM users WHERE id=$1
        `, userID).Scan(&user.ID, &user.Email, &user.Roles, &user.CreatedAt)
        if err != nil {
          c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
          return
        }
        c.JSON(http.StatusOK, user)
      }

  # 10. OAuth handlers
  - id: task-11
    name: "Create OAuth handlers"
    action: create_file
    path: identity-service/internal/handlers/oauth.go
    content: |
      package handlers

      import (
        "context"
        "encoding/json"
        "fmt"
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

  # 11. API key handlers
  - id: task-12
    name: "Create API key handlers"
    action: create_file
    path: identity-service/internal/handlers/apikeys.go
    content: |
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

  # 12. gRPC server
  - id: task-13
    name: "Create gRPC server"
    action: create_file
    path: identity-service/internal/server/grpc.go
    content: |
      package server

      import (
        "context"
        "net"
        "github.com/glohib/identity-service/internal/config"
        "github.com/glohib/identity-service/internal/db"
        "github.com/glohib/identity-service/internal/jwt"
        "github.com/glohib/identity-service/pkg/proto/identityv1"
        "google.golang.org/grpc"
        "google.golang.org/grpc/codes"
        "google.golang.org/grpc/status"
      )

      type GRPCServer struct {
        identityv1.UnimplementedIdentityServiceServer
        db  *db.DB
        jwt *jwt.Helper
      }

      func NewGRPCServer(db *db.DB, jwt *jwt.Helper) *GRPCServer {
        return &GRPCServer{db: db, jwt: jwt}
      }

      func (s *GRPCServer) ValidateToken(ctx context.Context, req *identityv1.ValidateTokenRequest) (*identityv1.ValidateTokenResponse, error) {
        claims, err := s.jwt.ValidateToken(req.Token)
        if err != nil {
          return &identityv1.ValidateTokenResponse{Valid: false}, nil
        }
        return &identityv1.ValidateTokenResponse{
          Valid:  true,
          UserId: claims.UserID,
          Roles:  claims.Roles,
        }, nil
      }

      func (s *GRPCServer) GetUser(ctx context.Context, req *identityv1.GetUserRequest) (*identityv1.GetUserResponse, error) {
        var email string
        var roles []string
        err := s.db.QueryRow(ctx, `SELECT email, roles FROM users WHERE id=$1`, req.UserId).Scan(&email, &roles)
        if err != nil {
          return nil, status.Error(codes.NotFound, "user not found")
        }
        return &identityv1.GetUserResponse{
          UserId: req.UserId,
          Email:  email,
          Roles:  roles,
        }, nil
      }

      func (s *GRPCServer) GetAPIKey(ctx context.Context, req *identityv1.GetAPIKeyRequest) (*identityv1.GetAPIKeyResponse, error) {
        var userID string
        var roles []string
        err := s.db.QueryRow(ctx, `
          SELECT u.id, u.roles
          FROM api_keys ak
          JOIN users u ON u.id = ak.user_id
          WHERE ak.key_hash = $1
        `, req.Key).Scan(&userID, &roles)
        if err != nil {
          return nil, status.Error(codes.NotFound, "api key not found")
        }
        return &identityv1.GetAPIKeyResponse{
          ApiKeyId: req.Key,
          UserId:   userID,
          Roles:    roles,
        }, nil
      }

      func StartGRPC(cfg *config.Config, db *db.DB, jwt *jwt.Helper) error {
        lis, err := net.Listen("tcp", ":"+cfg.Server.GRPCPort)
        if err != nil {
          return err
        }
        srv := grpc.NewServer()
        identityv1.RegisterIdentityServiceServer(srv, NewGRPCServer(db, jwt))
        return srv.Serve(lis)
      }

  # 13. Middleware
  - id: task-14
    name: "Create auth middleware"
    action: create_file
    path: identity-service/internal/middleware/auth.go
    content: |
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

  # 14. Routes
  - id: task-15
    name: "Create router"
    action: create_file
    path: identity-service/internal/router/router.go
    content: |
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

  # 15. Main
  - id: task-16
    name: "Create main.go"
    action: create_file
    path: identity-service/cmd/main.go
    content: |
      package main

      import (
        "context"
        "log"
        "os"
        "os/signal"
        "syscall"
        "github.com/glohib/identity-service/internal/config"
        "github.com/glohib/identity-service/internal/db"
        "github.com/glohib/identity-service/internal/handlers"
        "github.com/glohib/identity-service/internal/jwt"
        loggerPkg "github.com/glohib/identity-service/internal/logger"
        "github.com/glohib/identity-service/internal/redis"
        "github.com/glohib/identity-service/internal/router"
        "github.com/glohib/identity-service/internal/server"
      )

      func main() {
        if err := loggerPkg.Init(); err != nil {
          log.Fatalf("init logger: %v", err)
        }

        cfg, err := config.Load()
        if err != nil {
          loggerPkg.Fatal("load config", zap.Error(err))
        }

        database, err := db.New(&cfg.Database)
        if err != nil {
          loggerPkg.Fatal("connect db", zap.Error(err))
        }
        defer database.Close()

        rdb := redis.New(&cfg.Redis)
        defer rdb.Close()

        jwtHelper := jwt.NewHelper(&cfg.JWT)

        authHandler := handlers.NewAuthHandler(database, rdb, jwtHelper, cfg)
        oauthHandler := handlers.NewOAuthHandler(database, rdb, jwtHelper, cfg)
        apiKeyHandler := handlers.NewAPIKeyHandler(database)

        r := router.New(authHandler, oauthHandler, apiKeyHandler, jwtHelper)

        go func() {
          if err := server.StartGRPC(cfg, database, jwtHelper); err != nil {
            loggerPkg.Fatal("start grpc", zap.Error(err))
          }
        }()

        srv := &http.Server{Addr: ":" + cfg.Server.Port, Handler: r}

        go func() {
          loggerPkg.Info("http server started", zap.String("port", cfg.Server.Port))
          if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            loggerPkg.Fatal("http server", zap.Error(err))
          }
        }()

        quit := make(chan os.Signal, 1)
        signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
        <-quit

        ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
        defer cancel()
        if err := srv.Shutdown(ctx); err != nil {
          loggerPkg.Error("shutdown", zap.Error(err))
        }
      }

  # 16. SQL migrations
  - id: task-17
    name: "Create migrations"
    action: create_file
    path: identity-service/migrations/001_init.sql
    content: |
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        roles TEXT[] NOT NULL,
        provider VARCHAR(50) NOT NULL,
        provider_id VARCHAR(255),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE api_keys (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        key_hash VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX idx_users_email ON users(email);
      CREATE INDEX idx_users_provider ON users(provider, provider_id);
      CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);

  # 17. Config file
  - id: task-18
    name: "Create config.yaml"
    action: create_file
    path: identity-service/config.yaml
    content: |
      server:
        port: "8080"
        grpc_port: "50051"
        read_timeout: 10
        write_timeout: 10

      database:
        host: "postgres"
        port: 5432
        user: "postgres"
        password: "postgres"
        dbname: "identity"
        sslmode: "disable"

      redis:
        addr: "redis:6379"
        password: ""
        db: 0

      jwt:
        secret: "super-secret-change-me"
        access_expiry: 15
        refresh_expiry: 7

      oauth:
        google_client_id: "${GOOGLE_CLIENT_ID}"
        google_client_secret: "${GOOGLE_CLIENT_SECRET}"
        google_redirect_url: "http://localhost:8080/api/v1/oauth/google/callback"

  # 18. Dockerfile
  - id: task-19
    name: "Create Dockerfile"
    action: create_file
    path: identity-service/Dockerfile
    content: |
      FROM golang:1.22-alpine AS builder
      RUN apk add --no-cache git
      WORKDIR /app
      COPY go.mod go.sum ./
      RUN go mod download
      COPY . .
      RUN go build -o identity-service ./cmd/main.go

      FROM alpine:latest
      RUN apk --no-cache add ca-certificates
      WORKDIR /root/
      COPY --from=builder /app/identity-service .
      COPY --from=builder /app/config.yaml .
      EXPOSE 8080 50051
      CMD ["./identity-service"]

  # 19. Docker Compose
  - id: task-20
    name: "Create docker-compose.yaml"
    action: create_file
    path: identity-service/docker-compose.yaml
    content: |
      version: "3.9"
      services:
        postgres:
          image: postgres:15
          environment:
            POSTGRES_USER: postgres
            POSTGRES_PASSWORD: postgres
            POSTGRES_DB: identity
          ports:
            - "5432:5432"
          volumes:
            - postgres_data:/var/lib/postgresql/data

        redis:
          image: redis:7-alpine
          ports:
            -

---

**Token Usage:** {'prompt_tokens': 621, 'completion_tokens': 8192, 'total_tokens': 8813}
