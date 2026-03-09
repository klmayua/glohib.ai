# GLOHIB.AI - STEP 11: MENTOR SERVICE (GO)
**Generated:** 2026-02-28 14:12:16

---

```yaml
# ================================================================================
# GLOHIB.AI - STEP 11: MENTOR SERVICE (Go) - ATOMIC YAML SPECIFICATION
# ================================================================================

step_metadata:
  id: 11
  name: mentor-service-go
  phase: backend-services
  priority: high
  estimate: 2d
  tags: [go, microservice, mentor, matching, booking, chat]

context:
  service: mentor-service
  language: go
  framework: gin-gonic + gRPC
  database: postgresql
  cache: redis
  algorithm: Google OR-Tools weighted bipartite matching
  domain: education, mentoring, career

tasks:

# 1. Initialize Go module
- id: 11.1
  name: init-go-module
  action: shell_command
  command: |
    mkdir -p mentor-service && cd mentor-service
    go mod init github.com/glohib/mentor-service
  working_directory: mentor-service
  depends_on: []

# 2. Create go.mod with dependencies
- id: 11.2
  name: create-go-mod
  action: create_file
  file_path: mentor-service/go.mod
  content: |
    module github.com/glohib/mentor-service

    go 1.22

    require (
        github.com/gin-gonic/gin v1.9.1
        google.golang.org/grpc v1.59.0
        google.golang.org/protobuf v1.31.0
        github.com/jackc/pgx/v5 v5.5.0
        github.com/redis/go-redis/v9 v9.3.0
        github.com/google/or-tools v9.8.3296
        github.com/golang-jwt/jwt/v5 v5.0.0
        github.com/google/uuid v1.4.0
        github.com/lib/pq v1.10.9
        github.com/spf13/viper v1.17.0
        go.uber.org/zap v1.26.0
    )
  depends_on: [11.1]

# 3. Create main.go entry point
- id: 11.3
  name: create-main-go
  action: create_file
  file_path: mentor-service/cmd/main.go
  content: |
    package main

    import (
        "context"
        "log"
        "net"
        "net/http"
        "os"
        "os/signal"
        "syscall"
        "time"

        "github.com/gin-gonic/gin"
        "github.com/spf13/viper"
        "go.uber.org/zap"
        "google.golang.org/grpc"

        "github.com/glohib/mentor-service/internal/config"
        "github.com/glohib/mentor-service/internal/db"
        "github.com/glohib/mentor-service/internal/handlers"
        "github.com/glohib/mentor-service/internal/services"
        "github.com/glohib/mentor-service/internal/repository"
        "github.com/glohib/mentor-service/pkg/pb"
    )

    func main() {
        // Load configuration
        cfg := config.Load()

        // Initialize logger
        logger, _ := zap.NewProduction()
        defer logger.Sync()
        sugar := logger.Sugar()

        // Initialize database
        database, err := db.NewPostgres(cfg.DatabaseURL)
        if err != nil {
            sugar.Fatalw("Failed to connect to database", "error", err)
        }
        defer database.Close()

        // Initialize Redis
        redisClient := db.NewRedis(cfg.RedisURL)
        defer redisClient.Close()

        // Initialize repositories
        mentorRepo := repository.NewMentorRepository(database, redisClient)
        matchingRepo := repository.NewMatchingRepository(database, redisClient)
        bookingRepo := repository.NewBookingRepository(database, redisClient)
        chatRepo := repository.NewChatRepository(database, redisClient)

        // Initialize services
        matchingService := services.NewMatchingService(matchingRepo, sugar)
        bookingService := services.NewBookingService(bookingRepo, mentorRepo, sugar)
        chatService := services.NewChatService(chatRepo, sugar)

        // Initialize handlers
        mentorHandler := handlers.NewMentorHandler(mentorRepo, sugar)
        matchingHandler := handlers.NewMatchingHandler(matchingService, sugar)
        bookingHandler := handlers.NewBookingHandler(bookingService, sugar)
        chatHandler := handlers.NewChatHandler(chatService, sugar)

        // Start HTTP server
        httpServer := setupHTTPServer(cfg, mentorHandler, matchingHandler, bookingHandler, chatHandler)
        go func() {
            sugar.Infow("Starting HTTP server", "port", cfg.HTTPPort)
            if err := httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
                sugar.Fatalw("HTTP server failed", "error", err)
            }
        }()

        // Start gRPC server
        grpcServer := setupGRPCServer(cfg, mentorHandler, matchingHandler, bookingHandler, chatHandler)
        lis, err := net.Listen("tcp", ":"+cfg.GRPCPort)
        if err != nil {
            sugar.Fatalw("Failed to listen for gRPC", "error", err)
        }
        go func() {
            sugar.Infow("Starting gRPC server", "port", cfg.GRPCPort)
            if err := grpcServer.Serve(lis); err != nil {
                sugar.Fatalw("gRPC server failed", "error", err)
            }
        }()

        // Wait for interrupt signal
        quit := make(chan os.Signal, 1)
        signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
        <-quit

        sugar.Info("Shutting down servers...")

        // Shutdown HTTP server
        ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
        defer cancel()
        if err := httpServer.Shutdown(ctx); err != nil {
            sugar.Errorw("HTTP server shutdown error", "error", err)
        }

        // Stop gRPC server
        grpcServer.GracefulStop()

        sugar.Info("Server shutdown complete")
    }

    func setupHTTPServer(cfg *config.Config, mentorHandler *handlers.MentorHandler, 
        matchingHandler *handlers.MatchingHandler, bookingHandler *handlers.BookingHandler,
        chatHandler *handlers.ChatHandler) *http.Server {
        
        gin.SetMode(gin.ReleaseMode)
        router := gin.New()
        router.Use(gin.Recovery())
        router.Use(corsMiddleware())

        api := router.Group("/api/v1")
        {
            // Mentor endpoints
            api.GET("/mentors", mentorHandler.ListMentors)
            api.GET("/mentors/:id", mentorHandler.GetMentor)
            api.POST("/mentors", mentorHandler.CreateMentor)
            api.PUT("/mentors/:id", mentorHandler.UpdateMentor)
            api.GET("/mentors/:id/availability", mentorHandler.GetAvailability)
            api.PUT("/mentors/:id/availability", mentorHandler.SetAvailability)
            api.GET("/mentors/:id/sessions", mentorHandler.GetSessions)
            api.POST("/mentors/:id/rating", mentorHandler.SubmitRating)

            // Booking endpoints
            api.POST("/mentors/:id/book", bookingHandler.BookSession)
            api.GET("/bookings/:id", bookingHandler.GetBooking)
            api.PUT("/bookings/:id/cancel", bookingHandler.CancelBooking)

            // Matching endpoints
            api.POST("/matching/find", matchingHandler.FindMatches)

            // Chat endpoints
            api.POST("/chat/send", chatHandler.SendMessage)
            api.GET("/chat/history", chatHandler.GetChatHistory)
        }

        return &http.Server{
            Addr:    ":" + cfg.HTTPPort,
            Handler: router,
        }
    }

    func setupGRPCServer(cfg *config.Config, mentorHandler *handlers.MentorHandler,
        matchingHandler *handlers.MatchingHandler, bookingHandler *handlers.BookingHandler,
        chatHandler *handlers.ChatHandler) *grpc.Server {

        server := grpc.NewServer()
        
        pb.RegisterMentorServiceServer(server, mentorHandler)
        pb.RegisterMatchingServiceServer(server, matchingHandler)
        pb.RegisterBookingServiceServer(server, bookingHandler)
        pb.RegisterChatServiceServer(server, chatHandler)

        return server
    }

    func corsMiddleware() gin.HandlerFunc {
        return func(c *gin.Context) {
            c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
            c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
            c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
            c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

            if c.Request.Method == "OPTIONS" {
                c.AbortWithStatus(204)
                return
            }

            c.Next()
        }
    }
  depends_on: [11.2]

# 4. Create mentor.proto
- id: 11.4
  name: create-proto-file
  action: create_file
  file_path: mentor-service/pkg/proto/mentor.proto
  content: |
    syntax = "proto3";

    package mentor.v1;

    option go_package = "github.com/glohib/mentor-service/pkg/pb";

    import "google/protobuf/timestamp.proto";

    service MentorService {
        rpc ListMentors(ListMentorsRequest) returns (ListMentorsResponse);
        rpc GetMentor(GetMentorRequest) returns (Mentor);
        rpc CreateMentor(CreateMentorRequest) returns (Mentor);
        rpc UpdateMentor(UpdateMentorRequest) returns (Mentor);
        rpc GetAvailability(GetAvailabilityRequest) returns (AvailabilityResponse);
        rpc SetAvailability(SetAvailabilityRequest) returns (AvailabilityResponse);
        rpc GetSessions(GetSessionsRequest) returns (SessionsResponse);
        rpc SubmitRating(SubmitRatingRequest) returns (Rating);
    }

    service MatchingService {
        rpc FindMatches(FindMatchesRequest) returns (FindMatchesResponse);
    }

    service BookingService {
        rpc BookSession(BookSessionRequest) returns (Booking);
        rpc GetBooking(GetBookingRequest) returns (Booking);
        rpc CancelBooking(CancelBookingRequest) returns (Booking);
    }

    service ChatService {
        rpc SendMessage(SendMessageRequest) returns (Message);
        rpc GetChatHistory(GetChatHistoryRequest) returns (ChatHistoryResponse);
        rpc StreamMessages(StreamMessagesRequest) returns (stream Message);
    }

    // Common types
    message Mentor {
        string id = 1;
        string user_id = 2;
        string first_name = 3;
        string last_name = 4;
        string email = 5;
        string bio = 6;
        repeated string specializations = 7;
        repeated string languages = 8;
        string timezone = 9;
        double hourly_rate = 10;
        double rating = 11;
        int32 review_count = 12;
        bool is_verified = 13;
        bool is_available = 14;
        google.protobuf.Timestamp created_at = 15;
        google.protobuf.Timestamp updated_at = 16;
    }

    message AvailabilitySlot {
        string id = 1;
        string mentor_id = 2;
        google.protobuf.Timestamp start_time = 3;
        google.protobuf.Timestamp end_time = 4;
        bool is_booked = 5;
    }

    message Booking {
        string id = 1;
        string mentor_id = 2;
        string mentee_id = 3;
        google.protobuf.Timestamp start_time = 4;
        google.protobuf.Timestamp end_time = 5;
        string status = 6; // pending, confirmed, completed, cancelled
        string notes = 7;
        double price = 8;
        google.protobuf.Timestamp created_at = 9;
        google.protobuf.Timestamp updated_at = 10;
    }

    message Message {
        string id = 1;
        string sender_id = 2;
        string receiver_id = 3;
        string content = 4;
        google.protobuf.Timestamp sent_at = 5;
        bool is_read = 6;
    }

    message Rating {
        string id = 1;
        string mentor_id = 2;
        string mentee_id = 3;
        int32 score = 4; // 1-5
        string comment = 5;
        google.protobuf.Timestamp created_at = 6;
    }

    // Request/Response messages
    message ListMentorsRequest {
        int32 page = 1;
        int32 page_size = 2;
        repeated string specializations = 3;
        repeated string languages = 4;
        double min_rating = 5;
        double max_hourly_rate = 6;
        string timezone = 7;
    }

    message ListMentorsResponse {
        repeated Mentor mentors = 1;
        int32 total_count = 2;
        int32 page = 3;
        int32 page_size = 4;
    }

    message GetMentorRequest {
        string id = 1;
    }

    message CreateMentorRequest {
        string user_id = 1;
        string first_name = 2;
        string last_name = 3;
        string email = 4;
        string bio = 5;
        repeated string specializations = 6;
        repeated string languages = 7;
        string timezone = 8;
        double hourly_rate = 9;
    }

    message UpdateMentorRequest {
        string id = 1;
        optional string bio = 2;
        optional repeated string specializations = 3;
        optional repeated string languages = 4;
        optional double hourly_rate = 5;
    }

    message GetAvailabilityRequest {
        string mentor_id = 1;
        google.protobuf.Timestamp from_date = 2;
        google.protobuf.Timestamp to_date = 3;
    }

    message AvailabilityResponse {
        repeated AvailabilitySlot slots = 1;
    }

    message SetAvailabilityRequest {
        string mentor_id = 1;
        repeated AvailabilitySlot slots = 2;
    }

    message GetSessionsRequest {
        string mentor_id = 1;
        string status = 2; // optional filter
        google.protobuf.Timestamp from_date = 3;
        google.protobuf.Timestamp to_date = 4;
    }

    message SessionsResponse {
        repeated Booking sessions = 1;
    }

    message SubmitRatingRequest {
        string mentor_id = 1;
        string mentee_id = 2;
        int32 score = 3;
        string comment = 4;
    }

    message FindMatchesRequest {
        string mentee_id = 1;
        repeated string specializations = 2;
        repeated string languages = 3;
        string timezone = 4;
        int32 max_results = 5;
    }

    message FindMatchesResponse {
        repeated MatchedMentor mentors = 1;
    }

    message MatchedMentor {
        Mentor mentor = 1;
        double match_score = 2;
        repeated string match_reasons = 3;
    }

    message BookSessionRequest {
        string mentor_id = 1;
        string mentee_id = 2;
        google.protobuf.Timestamp start_time = 3;
        google.protobuf.Timestamp end_time = 4;
        string notes = 5;
    }

    message GetBookingRequest {
        string id = 1;
    }

    message CancelBookingRequest {
        string id = 1;
        string reason = 2;
    }

    message SendMessageRequest {
        string sender_id = 1;
        string receiver_id = 2;
        string content = 3;
    }

    message GetChatHistoryRequest {
        string user_id_1 = 1;
        string user_id_2 = 2;
        int32 limit = 3;
        google.protobuf.Timestamp before = 4;
    }

    message ChatHistoryResponse {
        repeated Message messages = 1;
    }

    message StreamMessagesRequest {
        string user_id = 1;
    }
  depends_on: [11.3]

# 5. Create mentor models
- id: 11.5
  name: create-mentor-models
  action: create_file
  file_path: mentor-service/internal/models/mentor.go
  content: |
    package models

    import (
        "time"
        "github.com/google/uuid"
    )

    type Mentor struct {
        ID             uuid.UUID   `json:"id" db:"id"`
        UserID         uuid.UUID   `json:"user_id" db:"user_id"`
        FirstName      string      `json:"first_name" db:"first_name"`
        LastName       string      `json:"last_name" db:"last_name"`
        Email          string      `json:"email" db:"email"`
        Bio            string      `json:"bio" db:"bio"`
        Specializations []string   `json:"specializations" db:"specializations"`
        Languages      []string    `json:"languages" db:"languages"`
        Timezone       string      `json:"timezone" db:"timezone"`
        HourlyRate     float64     `json:"hourly_rate" db:"hourly_rate"`
        Rating         float64     `json:"rating" db:"rating"`
        ReviewCount    int         `json:"review_count" db:"review_count"`
        IsVerified     bool        `json:"is_verified" db:"is_verified"`
        IsAvailable    bool        `json:"is_available" db:"is_available"`
        CreatedAt      time.Time   `json:"created_at" db:"created_at"`
        UpdatedAt      time.Time   `json:"updated_at" db:"updated_at"`
    }

    type AvailabilitySlot struct {
        ID        uuid.UUID `json:"id" db:"id"`
        MentorID  uuid.UUID `json:"mentor_id" db:"mentor_id"`
        StartTime time.Time `json:"start_time" db:"start_time"`
        EndTime   time.Time `json:"end_time" db:"end_time"`
        IsBooked  bool      `json:"is_booked" db:"is_booked"`
        CreatedAt time.Time `json:"created_at" db:"created_at"`
        UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
    }

    type Booking struct {
        ID        uuid.UUID `json:"id" db:"id"`
        MentorID  uuid.UUID `json:"mentor_id" db:"mentor_id"`
        MenteeID  uuid.UUID `json:"mentee_id" db:"mentee_id"`
        StartTime time.Time `json:"start_time" db:"start_time"`
        EndTime   time.Time `json:"end_time" db:"end_time"`
        Status    string    `json:"status" db:"status"` // pending, confirmed, completed, cancelled
        Notes     string    `json:"notes" db:"notes"`
        Price     float64   `json:"price" db:"price"`
        CreatedAt time.Time `json:"created_at" db:"created_at"`
        UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
    }

    type Rating struct {
        ID        uuid.UUID `json:"id" db:"id"`
        MentorID  uuid.UUID `json:"mentor_id" db:"mentor_id"`
        MenteeID  uuid.UUID `json:"mentee_id" db:"mentee_id"`
        Score     int       `json:"score" db:"score"` // 1-5
        Comment   string    `json:"comment" db:"comment"`
        CreatedAt time.Time `json:"created_at" db:"created_at"`
    }

    type Message struct {
        ID         uuid.UUID `json:"id" db:"id"`
        SenderID   uuid.UUID `json:"sender_id" db:"sender_id"`
        ReceiverID uuid.UUID `json:"receiver_id" db:"receiver_id"`
        Content    string    `json:"content" db:"content"`
        SentAt     time.Time `json:"sent_at" db:"sent_at"`
        IsRead     bool      `json:"is_read" db:"is_read"`
    }

    // Search filters
    type MentorSearchFilter struct {
        Specializations []string
        Languages       []string
        MinRating       float64
        MaxHourlyRate   float64
        Timezone        string
        Page            int
        PageSize        int
    }

    // Availability query
    type AvailabilityQuery struct {
        MentorID uuid.UUID
        FromDate time.Time
        ToDate   time.Time
    }
  depends_on: [11.4]

# 6. Create matching models
- id: 11.6
  name: create-matching-models
  action: create_file
  file_path: mentor-service/internal/models/matching.go
  content: |
    package models

    import (
        "github.com/google/uuid"
    )

    type MatchCriteria struct {
        MenteeID        uuid.UUID
        Specializations []string
        Languages       []string
        Timezone        string
        MaxResults      int
    }

    type MatchedMentor struct {
        Mentor      Mentor
        MatchScore  float64
        MatchReasons []string
    }

    type MatchScoreWeights struct {
        Domain   float64 // 0.4
        Timezone float64 // 0.3
        Language float64 // 0.2
        Rating   float64 // 0.1
    }

    type BipartiteGraph struct {
        Mentees []uuid.UUID
        Mentors []uuid.UUID
        Edges   []WeightedEdge
    }

    type WeightedEdge struct {
        MenteeID uuid.UUID
        MentorID uuid.UUID
        Weight   float64 // Higher is better
    }

    type MatchingResult struct {
        Matches []MatchPair
        Score   float64
    }

    type MatchPair struct {
        MenteeID uuid.UUID
        MentorID uuid.UUID
        Score    float64
    }
  depends_on: [11.5]

# 7. Create mentor handler
- id: 11.7
  name: create-mentor-handler
  action: create_file
  file_path: mentor-service/internal/handlers/mentor.go
  content: |
    package handlers

    import (
        "context"
        "net/http"
        "time"

        "github.com/gin-gonic/gin"
        "github.com/google/uuid"
        "go.uber.org/zap"
        "google.golang.org/grpc/codes"
        "google.golang.org/grpc/status"

        "github.com/glohib/mentor-service/internal/models"
        "github.com/glohib/mentor-service/internal/repository"
        "github.com/glohib/mentor-service/pkg/pb"
    )

    type MentorHandler struct {
        repo *repository.MentorRepository
        logger *zap.SugaredLogger
        pb.UnimplementedMentorServiceServer
    }

    func NewMentorHandler(repo *repository.MentorRepository, logger *zap.SugaredLogger) *MentorHandler {
        return &MentorHandler{
            repo:   repo,
            logger: logger,
        }
    }

    // HTTP Handlers
    func (h *MentorHandler) ListMentors(c *gin.Context) {
        var filter models.MentorSearchFilter
        
        if err := c.ShouldBindQuery(&filter); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        mentors, total, err := h.repo.ListMentors(c.Request.Context(), filter)
        if err != nil {
            h.logger.Errorw("Failed to list mentors", "error", err)
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to list mentors"})
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "mentors":     mentors,
            "total_count": total,
            "page":        filter.Page,
            "page_size":   filter.PageSize,
        })
    }

    func (h *MentorHandler) GetMentor(c *gin.Context) {
        id, err := uuid.Parse(c.Param("id"))
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid mentor ID"})
            return
        }

        mentor, err := h.repo.GetMentor(c.Request.Context(), id)
        if err != nil {
            h.logger.Errorw("Failed to get mentor", "id", id, "error", err)
            c.JSON(http.StatusNotFound, gin.H{"error": "Mentor not found"})
            return
        }

        c.JSON(http.StatusOK, mentor)
    }

    func (h *MentorHandler) CreateMentor(c *gin.Context) {
        var req struct {
            UserID          string   `json:"user_id" binding:"required"`
            FirstName       string   `json:"first_name" binding:"required"`
            LastName        string   `json:"last_name" binding:"required"`
            Email           string   `json:"email" binding:"required,email"`
            Bio             string   `json:"bio" binding:"required"`
            Specializations []string `json:"specializations" binding:"required"`
            Languages       []string `json:"languages" binding:"required"`
            Timezone        string   `json:"timezone" binding:"required"`
            HourlyRate      float64  `json:"hourly_rate" binding:"required,min=0"`
        }

        if err := c.ShouldBindJSON(&req); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        mentor := &models.Mentor{
            ID:              uuid.New(),
            UserID:          uuid.MustParse(req.UserID),
            FirstName:       req.FirstName,
            LastName:        req.LastName,
            Email:           req.Email,
            Bio:             req.Bio,
            Specializations: req.Specializations,
            Languages:       req.Languages,
            Timezone:        req.Timezone,
            HourlyRate:      req.HourlyRate,
            Rating:          0,
            ReviewCount:     0,
            IsVerified:      true, // Already verified through application process
            IsAvailable:     true,
            CreatedAt:       time.Now(),
            UpdatedAt:       time.Now(),
        }

        if err := h.repo.CreateMentor(c.Request.Context(), mentor); err != nil {
            h.logger.Errorw("Failed to create mentor", "error", err)
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create mentor"})
            return
        }

        c.JSON(http.StatusCreated, mentor)
    }

    func (h *MentorHandler) UpdateMentor(c *gin.Context) {
        id, err := uuid.Parse(c.Param("id"))
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid mentor ID"})
            return
        }

        var updates map[string]interface{}
        if err := c.ShouldBindJSON(&updates); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        if err := h.repo.UpdateMentor(c.Request.Context(), id, updates); err != nil {
            h.logger.Errorw("Failed to update mentor", "id", id, "error", err)
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update mentor"})
            return
        }

        mentor, err := h.repo.GetMentor(c.Request.Context(), id)
        if err != nil {
            c.JSON(http.StatusNotFound, gin.H{"error": "Mentor not found"})
            return
        }

        c.JSON(http.StatusOK, mentor)
    }

    func (h *MentorHandler) GetAvailability(c *gin.Context) {
        mentorID, err := uuid.Parse(c.Param("id"))
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid mentor ID"})
            return
        }

        fromDate := time.Now()
        toDate := fromDate.AddDate(0, 1, 0) // Next month

        if fromStr := c.Query("from"); fromStr != "" {
            if parsed, err := time.Parse(time.RFC3339, fromStr); err == nil {
                fromDate = parsed
            }
        }

        if toStr := c.Query("to"); toStr != "" {
            if parsed, err := time.Parse(time.RFC3339, toStr); err == nil {
                toDate = parsed
            }
        }

        slots, err := h.repo.GetAvailability(c.Request.Context(), mentorID, fromDate, toDate)
        if err != nil {
            h.logger.Errorw("Failed to get availability", "mentor_id", mentorID, "error", err)
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get availability"})
            return
        }

        c.JSON(http.StatusOK, gin.H{"slots": slots})
    }

    func (h *MentorHandler) SetAvailability(c *gin.Context) {
        mentorID, err := uuid.Parse(c.Param("id"))
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid mentor ID"})
            return
        }

        var slots []models.AvailabilitySlot
        if err := c.ShouldBindJSON(&slots); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        if err := h.repo.SetAvailability(c.Request.Context(), mentorID, slots); err != nil {
            h.logger.Errorw("Failed to set availability", "mentor_id", mentorID, "error", err)
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to set availability"})
            return
        }

        c.JSON(http.StatusOK, gin.H{"message": "Availability updated"})
    }

    func (h *MentorHandler) GetSessions(c *gin.Context) {
        mentorID, err := uuid.Parse(c.Param("id"))
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid mentor ID"})
            return
        }

        status := c.Query("status")
        fromDate := time.Now()
        toDate := fromDate.AddDate(0, 3, 0) // Next 3 months

        sessions, err := h.repo.GetMentorSessions(c.Request.Context(), mentorID, status, fromDate, toDate)
        if err != nil {
            h.logger.Errorw("Failed to get sessions", "mentor_id", mentorID, "error", err)
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get sessions"})
            return
        }

        c.JSON(http.StatusOK, gin.H{"sessions": sessions})
    }

    func (h *MentorHandler) SubmitRating(c *gin.Context) {
        mentorID, err := uuid.Parse(c.Param("id"))
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid mentor ID"})
            return
        }

        var req struct {
            MenteeID string `json:"mentee_id" binding:"required"`
            Score    int    `json:"score" binding:"required,min=1,max=5"`
            Comment  string `json:"comment"`
        }

        if err := c.ShouldBindJSON(&req); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        rating := &models.Rating{
            ID:       uuid.New(),
            MentorID: mentorID,
            MenteeID: uuid.MustParse(req.MenteeID),
            Score:    req.Score,
            Comment:  req.Comment,
            CreatedAt: time.Now(),
        }

        if err := h.repo.SubmitRating(c.Request.Context(), rating); err != nil {
            h.logger.Errorw("Failed to submit rating", "error", err)
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to submit rating"})
            return
        }

        c.JSON(http.StatusCreated, rating)
    }

    // gRPC implementations
    func (h *MentorHandler) ListMentors(ctx context.Context, req *pb.ListMentorsRequest) (*pb.ListMentorsResponse, error) {
        filter := models.MentorSearchFilter{
            Specializations: req.Specializations,
            Languages:       req.Languages,
            MinRating:       req.MinRating,
            MaxHourlyRate:   req.MaxHourlyRate,
            Timezone:        req.Timezone,
            Page:            int(req.Page),
            PageSize:        int(req.PageSize),
        }

        mentors, total, err := h.repo.ListMentors(ctx, filter)
        if err != nil {
            return nil, status.Error(codes.Internal, "Failed to list mentors")
        }

        pbMentors := make([]*pb.Mentor, len(mentors))
        for i, m := range mentors {
            pbMentors[i] = h.convertToPbMentor(&m)
        }

        return &pb.ListMentorsResponse{
            Mentors:   pbMentors,
            TotalCount: int32(total),
            Page:      req.Page,
            PageSize:  req.PageSize,
        }, nil
    }

    func (h *MentorHandler) GetMentor(ctx context.Context, req *pb.GetMentorRequest) (*pb.Mentor, error) {
        id, err := uuid.Parse(req.Id)
        if err != nil {
            return nil, status.Error(codes.InvalidArgument, "Invalid mentor ID")
        }

        mentor, err := h.repo.GetMentor(ctx, id)
        if err != nil {
            return nil, status.Error(codes.NotFound, "Mentor not found")
        }

        return h.convertToPbMentor(mentor), nil
    }

    func (h *MentorHandler) CreateMentor(ctx context.Context, req *pb.CreateMentorRequest) (*pb.Mentor, error) {
        mentor := &models.Mentor{
            ID:              uuid.New(),
            UserID:          uuid.MustParse(req.UserId),
            FirstName:       req.FirstName,
            LastName:        req.LastName,
            Email:           req.Email,
            Bio:             req.Bio,
            Specializations: req.Specializations,
            Languages:       req.Languages,
            Timezone:        req.Timezone,
            HourlyRate:      req.HourlyRate,
            Rating:          0,
            ReviewCount:     0,
            IsVerified:      true,
            IsAvailable:     true,
            CreatedAt:       time.Now(),
            UpdatedAt:       time.Now(),
        }

        if err := h.repo.CreateMentor(ctx, mentor); err != nil {
            return nil, status.Error(codes.Internal, "Failed to create mentor")
        }

        return h.convertToPbMentor(mentor), nil
    }

    func (h *MentorHandler) UpdateMentor(ctx context.Context, req *pb.UpdateMentorRequest) (*pb.Mentor, error) {
        id, err := uuid.Parse(req.Id)
        if err != nil {
            return nil, status.Error(codes.InvalidArgument, "Invalid mentor ID")
        }

        updates := make(map[string]interface{})
        if req.Bio != nil {
            updates["bio"] = *req.Bio
        }
        if req.Specializations != nil {
            updates["specializations"] = req.Specializations
        }
        if req.Languages != nil {
            updates["languages"] = req.Languages
        }
        if req.HourlyRate != nil {
            updates["hourly_rate"] = *req.HourlyRate
        }

        if err := h.repo.UpdateMentor(ctx, id, updates); err != nil {
            return nil, status.Error(codes.Internal, "Failed to update mentor")
        }

        mentor, err := h.repo.GetMentor(ctx, id)
        if err != nil {
            return nil, status.Error(codes.NotFound, "Mentor not found")
        }

        return h.convertToPbMentor(mentor), nil
    }

    func (h *MentorHandler) convertToPbMentor(m *models.Mentor) *pb.Mentor {
        return &pb.Mentor{
            Id:              m.ID.String(),
            UserId:          m.UserID.String(),
            FirstName:       m.FirstName,
            LastName:        m.LastName,
            Email:           m.Email,
            Bio:             m.Bio,
            Specializations: m.Specializations,
            Languages:       m.Languages,
            Timezone:        m.Timezone,
            HourlyRate:      m.HourlyRate,
            Rating:          m.Rating,
            ReviewCount:     int32(m.ReviewCount),
            IsVerified:      m.IsVerified,
            IsAvailable:     m.IsAvailable,
            CreatedAt:       &pb.Timestamp{Seconds: m.CreatedAt.Unix()},
            UpdatedAt:       &pb.Timestamp{Seconds: m.UpdatedAt.Unix()},
        }
    }
  depends_on: [11.6]

# 8. Create matching handler
- id: 11.8
  name: create-matching-handler
  action: create_file
  file_path: mentor-service/internal/handlers/matching.go
  content: |
    package handlers

    import (
        "context"
        "net/http"

        "github.com/gin-gonic/gin"
        "github.com/google/uuid"
        "go.uber.org/zap"
        "google.golang.org/grpc/codes"
        "google.golang.org/grpc/status"

        "github.com/glohib/mentor-service/internal/models"
        "github.com/glohib/mentor-service/internal/services"
        "github.com/glohib/mentor-service/pkg/pb"
    )

    type MatchingHandler struct {
        service *services.MatchingService
        logger  *zap.SugaredLogger
        pb.UnimplementedMatchingServiceServer
    }

    func NewMatchingHandler(service *services.MatchingService, logger *zap.SugaredLogger) *MatchingHandler {
        return &MatchingHandler{
            service: service,
            logger:  logger,
        }


---

**Token Usage:** {'prompt_tokens': 699, 'completion_tokens': 8192, 'total_tokens': 8891}
