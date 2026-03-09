# GLOHIB.AI - STEP 9: ASSESSMENT SERVICE (GO)
**Generated:** 2026-02-28 05:13:27

---

```yaml
step_metadata:
  id: STEP-9-ASSESSMENT-SERVICE
  name: "Assessment Service Implementation"
  phase: "Microservice Development"
  priority: 1
  estimate: "8h"

context: |
  Implement the Assessment Service in Go for Glohib.ai.
  The service manages the 7-stage assessment workflow, state machine,
  timer service, LLM integration, and psychomotor / situational analysis.

tasks:

# 1. Project skeleton ---------------------------------------------------------
- id: 9.1
  action: shell_command
  command: |
    mkdir -p assessment-service/{cmd,internal/{handlers,models,services,repository,middleware,utils},pkg/{proto,config},migrations,scripts}
    cd assessment-service && go mod init github.com/glohib/assessment-service

# 2. go.mod -------------------------------------------------------------------
- id: 9.2
  action: create_file
  path: assessment-service/go.mod
  content: |
    module github.com/glohib/assessment-service

    go 1.22

    require (
        github.com/gin-gonic/gin v1.9.1
        google.golang.org/grpc v1.61.0
        google.golang.org/protobuf v1.32.0
        github.com/jackc/pgx/v5 v5.5.1
        github.com/redis/go-redis/v9 v9.3.1
        github.com/robfig/cron/v3 v3.0.1
        github.com/golang-jwt/jwt/v5 v5.2.0
        github.com/lib/pq v1.10.9
        github.com/spf13/viper v1.18.2
        go.uber.org/zap v1.26.0
        github.com/looplab/fsm v1.0.1
        github.com/google/uuid v1.5.0
    )

# 3. protobuf -----------------------------------------------------------------
- id: 9.3
  action: create_file
  path: assessment-service/pkg/proto/assessment.proto
  content: |
    syntax = "proto3";

    package assessment.v1;

    option go_package = "github.com/glohib/assessment-service/pkg/proto;assessmentv1";

    service AssessmentService {
      rpc StartAssessment(StartAssessmentRequest) returns (StartAssessmentResponse);
      rpc GetStatus(GetStatusRequest) returns (GetStatusResponse);
      rpc SubmitStage(SubmitStageRequest) returns (SubmitStageResponse);
      rpc GetStageResult(GetStageResultRequest) returns (GetStageResultResponse);
      rpc StartPsychomotor(StartPsychomotorRequest) returns (StartPsychomotorResponse);
      rpc SubmitPsychomotor(SubmitPsychomotorRequest) returns (SubmitPsychomotorResponse);
      rpc StartSituational(StartSituationalRequest) returns (StartSituationalResponse);
      rpc SubmitSituational(SubmitSituationalRequest) returns (SubmitSituationalResponse);
      rpc GetFinalResult(GetFinalResultRequest) returns (GetFinalResultResponse);
    }

    message StartAssessmentRequest {
      string candidate_id = 1;
      string job_id = 2;
    }
    message StartAssessmentResponse {
      string assessment_id = 1;
      string stage = 2;
      int64 expires_at = 3;
    }

    message GetStatusRequest { string assessment_id = 1; }
    message GetStatusResponse {
      string stage = 1;
      string status = 2;
      int64 expires_at = 3;
    }

    message SubmitStageRequest {
      string assessment_id = 1;
      string stage = 2;
      repeated Answer answers = 3;
    }
    message Answer { string question_id = 1; string text = 2; }
    message SubmitStageResponse {
      string result = 1;
      double score = 2;
      bool passed = 3;
    }

    message GetStageResultRequest {
      string assessment_id = 1;
      string stage = 2;
    }
    message GetStageResultResponse {
      double score = 1;
      bool passed = 2;
      string feedback = 3;
    }

    message StartPsychomotorRequest { string assessment_id = 1; }
    message StartPsychomotorResponse {
      string session_id = 1;
      repeated Task tasks = 2;
      int64 expires_at = 3;
    }
    message Task { string id = 1; string description = 2; string type = 3; }

    message SubmitPsychomotorRequest {
      string assessment_id = 1;
      string session_id = 2;
      repeated TaskAnswer answers = 3;
    }
    message TaskAnswer { string task_id = 1; string data = 2; }
    message SubmitPsychomotorResponse {
      double score = 1;
      bool passed = 2;
    }

    message StartSituationalRequest { string assessment_id = 1; }
    message StartSituationalResponse {
      string scenario_id = 1;
      string scenario_text = 2;
      repeated Option options = 3;
      int64 expires_at = 4;
    }
    message Option { string id = 1; string text = 2; }

    message SubmitSituationalRequest {
      string assessment_id = 1;
      string scenario_id = 2;
      repeated string selected_option_ids = 3;
    }
    message SubmitSituationalResponse {
      double score = 1;
      bool passed = 2;
      string explanation = 3;
    }

    message GetFinalResultRequest { string assessment_id = 1; }
    message GetFinalResultResponse {
      string status = 1;
      double overall_score = 2;
      map<string,double> stage_scores = 3;
      string decision = 4;
    }

# 4. config -------------------------------------------------------------------
- id: 9.4
  action: create_file
  path: assessment-service/pkg/config/config.go
  content: |
    package config

    import "github.com/spf13/viper"

    type Config struct {
        DB          DBConfig
        Redis       RedisConfig
        Server      ServerConfig
        JWT         JWTConfig
        LLM         LLMConfig
        NLP         NLPConfig
        Timer       TimerConfig
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
    type ServerConfig struct {
        Port         int
        GRPCPort     int
        ReadTimeout  int
        WriteTimeout int
    }
    type JWTConfig struct {
        Secret string
        TTL    int
    }
    type LLMConfig struct {
        Endpoint string
        APIKey   string
        Timeout  int
    }
    type NLPConfig struct {
        Endpoint string
        APIKey   string
        Timeout  int
    }
    type TimerConfig struct {
        StageTimeoutMinutes int
        WarnMinutes         int
    }

    func Load() (*Config, error) {
        viper.SetConfigName("config")
        viper.SetConfigType("yaml")
        viper.AddConfigPath(".")
        viper.AddConfigPath("/etc/glohib/")
        viper.AutomaticEnv()

        if err := viper.ReadInConfig(); err != nil {
            return nil, err
        }
        var c Config
        if err := viper.Unmarshal(&c); err != nil {
            return nil, err
        }
        return &c, nil
    }

# 5. models -------------------------------------------------------------------
- id: 9.5
  action: create_file
  path: assessment-service/internal/models/assessment.go
  content: |
    package models

    import (
        "time"
        "github.com/google/uuid"
    )

    type Assessment struct {
        ID          uuid.UUID  `db:"id" json:"id"`
        CandidateID uuid.UUID  `db:"candidate_id" json:"candidate_id"`
        JobID       uuid.UUID  `db:"job_id" json:"job_id"`
        State       string     `db:"state" json:"state"`
        OverallScore float64   `db:"overall_score" json:"overall_score"`
        CreatedAt   time.Time  `db:"created_at" json:"created_at"`
        UpdatedAt   time.Time  `db:"updated_at" json:"updated_at"`
        CompletedAt *time.Time `db:"completed_at" json:"completed_at,omitempty"`
    }

    const (
        StateDraft      = "draft"
        StateScreening  = "screening"
        StateTechnical  = "technical"
        StateCultural   = "cultural"
        StateFinal      = "final"
        StatePassed     = "passed"
        StateFailed     = "failed"
    )

# 6. stage model --------------------------------------------------------------
- id: 9.6
  action: create_file
  path: assessment-service/internal/models/stage.go
  content: |
    package models

    import (
        "time"
        "github.com/google/uuid"
    )

    type Stage struct {
        ID           uuid.UUID  `db:"id" json:"id"`
        AssessmentID uuid.UUID  `db:"assessment_id" json:"assessment_id"`
        Name         string     `db:"name" json:"name"`
        Status       string     `db:"status" json:"status"`
        Score        float64    `db:"score" json:"score"`
        Pass         bool       `db:"pass" json:"pass"`
        Feedback     string     `db:"feedback" json:"feedback"`
        Answers      []byte     `db:"answers" json:"-"`
        StartedAt    *time.Time `db:"started_at" json:"started_at,omitempty"`
        SubmittedAt  *time.Time `db:"submitted_at" json:"submitted_at,omitempty"`
        ExpiresAt    *time.Time `db:"expires_at" json:"expires_at,omitempty"`
        CreatedAt    time.Time  `db:"created_at" json:"created_at"`
    }

    const (
        StatusPending   = "pending"
        StatusActive    = "active"
        StatusSubmitted = "submitted"
        StatusGraded    = "graded"
        StatusExpired   = "expired"
    )

    const (
        StageScreening  = "screening"
        StageTechnical  = "technical"
        StageCultural   = "cultural"
        StageFinal      = "final"
        StagePsychomotor = "psychomotor"
        StageSituational = "situational"
    )

# 7. state machine ------------------------------------------------------------
- id: 9.7
  action: create_file
  path: assessment-service/internal/services/statemachine.go
  content: |
    package services

    import (
        "fmt"
        "github.com/glohib/assessment-service/internal/models"
        "github.com/looplab/fsm"
        "go.uber.org/zap"
    )

    type StateMachine struct {
        fsm *fsm.FSM
        log *zap.Logger
    }

    func NewStateMachine(initial string, log *zap.Logger) *StateMachine {
        sm := &StateMachine{log: log}
        sm.fsm = fsm.NewFSM(
            initial,
            fsm.Events{
                {Name: "start", Src: []string{models.StateDraft}, Dst: models.StateScreening},
                {Name: "pass_screening", Src: []string{models.StateScreening}, Dst: models.StateTechnical},
                {Name: "fail_screening", Src: []string{models.StateScreening}, Dst: models.StateFailed},
                {Name: "pass_technical", Src: []string{models.StateTechnical}, Dst: models.StateCultural},
                {Name: "fail_technical", Src: []string{models.StateTechnical}, Dst: models.StateFailed},
                {Name: "pass_cultural", Src: []string{models.StateCultural}, Dst: models.StateFinal},
                {Name: "fail_cultural", Src: []string{models.StateCultural}, Dst: models.StateFailed},
                {Name: "pass_final", Src: []string{models.StateFinal}, Dst: models.StatePassed},
                {Name: "fail_final", Src: []string{models.StateFinal}, Dst: models.StateFailed},
            },
            fsm.Callbacks{
                "before_event": func(e *fsm.Event) { sm.log.Info("state transition", zap.String("event", e.Event)) },
            },
        )
        return sm
    }

    func (sm *StateMachine) Current() string { return sm.fsm.Current() }
    func (sm *StateMachine) Can(evt string) bool { return sm.fsm.Can(evt) }
    func (sm *StateMachine) Event(evt string, args ...interface{}) error {
        return sm.fsm.Event(evt, args...)
    }

# 8. timer service ------------------------------------------------------------
- id: 9.8
  action: create_file
  path: assessment-service/internal/services/timer.go
  content: |
    package services

    import (
        "context"
        "encoding/json"
        "time"
        "github.com/redis/go-redis/v9"
        "go.uber.org/zap"
    )

    type TimerService struct {
        rdb *redis.Client
        log *zap.Logger
    }

    type Timer struct {
        AssessmentID string    `json:"assessment_id"`
        Stage        string    `json:"stage"`
        ExpiresAt    time.Time `json:"expires_at"`
    }

    func NewTimerService(rdb *redis.Client, log *zap.Logger) *TimerService {
        return &TimerService{rdb: rdb, log: log}
    }

    func (t *TimerService) Start(ctx context.Context, assessmentID, stage string, ttl time.Duration) error {
        key := "timer:" + assessmentID + ":" + stage
        timer := Timer{
            AssessmentID: assessmentID,
            Stage:        stage,
            ExpiresAt:    time.Now().Add(ttl),
        }
        data, _ := json.Marshal(timer)
        return t.rdb.Set(ctx, key, data, ttl).Err()
    }

    func (t *TimerService) Remaining(ctx context.Context, assessmentID, stage string) (time.Duration, error) {
        key := "timer:" + assessmentID + ":" + stage
        val, err := t.rdb.Get(ctx, key).Result()
        if err != nil {
            return 0, err
        }
        var timer Timer
        if err := json.Unmarshal([]byte(val), &timer); err != nil {
            return 0, err
        }
        return time.Until(timer.ExpiresAt), nil
    }

    func (t *TimerService) Cancel(ctx context.Context, assessmentID, stage string) error {
        key := "timer:" + assessmentID + ":" + stage
        return t.rdb.Del(ctx, key).Err()
    }

# 9. repository ---------------------------------------------------------------
- id: 9.9
  action: create_file
  path: assessment-service/internal/repository/assessment.go
  content: |
    package repository

    import (
        "context"
        "database/sql"
        "github.com/google/uuid"
        "github.com/glohib/assessment-service/internal/models"
        "github.com/jackc/pgx/v5/pgxpool"
    )

    type AssessmentRepo struct {
        db *pgxpool.Pool
    }

    func NewAssessmentRepo(db *pgxpool.Pool) *AssessmentRepo {
        return &AssessmentRepo{db: db}
    }

    func (r *AssessmentRepo) Create(ctx context.Context, a *models.Assessment) error {
        q := `INSERT INTO assessments (id,candidate_id,job_id,state) VALUES ($1,$2,$3,$4)`
        _, err := r.db.Exec(ctx, q, a.ID, a.CandidateID, a.JobID, a.State)
        return err
    }

    func (r *AssessmentRepo) Get(ctx context.Context, id uuid.UUID) (*models.Assessment, error) {
        var a models.Assessment
        q := `SELECT * FROM assessments WHERE id=$1`
        if err := r.db.QueryRow(ctx, q, id).Scan(
            &a.ID, &a.CandidateID, &a.JobID, &a.State, &a.OverallScore,
            &a.CreatedAt, &a.UpdatedAt, &a.CompletedAt,
        ); err != nil {
            return nil, err
        }
        return &a, nil
    }

    func (r *AssessmentRepo) UpdateState(ctx context.Context, id uuid.UUID, state string) error {
        q := `UPDATE assessments SET state=$1,updated_at=now() WHERE id=$2`
        _, err := r.db.Exec(ctx, q, state, id)
        return err
    }

# 10. stage repo --------------------------------------------------------------
- id: 9.10
  action: create_file
  path: assessment-service/internal/repository/stage.go
  content: |
    package repository

    import (
        "context"
        "encoding/json"
        "github.com/google/uuid"
        "github.com/glohib/assessment-service/internal/models"
        "github.com/jackc/pgx/v5/pgxpool"
    )

    type StageRepo struct {
        db *pgxpool.Pool
    }

    func NewStageRepo(db *pgxpool.Pool) *StageRepo {
        return &StageRepo{db: db}
    }

    func (r *StageRepo) Create(ctx context.Context, s *models.Stage) error {
        q := `INSERT INTO stages (id,assessment_id,name,status) VALUES ($1,$2,$3,$4)`
        _, err := r.db.Exec(ctx, q, s.ID, s.AssessmentID, s.Name, s.Status)
        return err
    }

    func (r *StageRepo) GetByName(ctx context.Context, assessmentID uuid.UUID, name string) (*models.Stage, error) {
        var s models.Stage
        q := `SELECT * FROM stages WHERE assessment_id=$1 AND name=$2`
        var ans []byte
        if err := r.db.QueryRow(ctx, q, assessmentID, name).Scan(
            &s.ID, &s.AssessmentID, &s.Name, &s.Status, &s.Score, &s.Pass,
            &s.Feedback, &ans, &s.StartedAt, &s.SubmittedAt, &s.ExpiresAt, &s.CreatedAt,
        ); err != nil {
            return nil, err
        }
        if len(ans) > 0 {
            s.Answers = ans
        }
        return &s, nil
    }

    func (r *StageRepo) Update(ctx context.Context, s *models.Stage) error {
        ans, _ := json.Marshal(s.Answers)
        q := `UPDATE stages SET status=$1,score=$2,pass=$3,feedback=$4,answers=$5,submitted_at=$6 WHERE id=$7`
        _, err := r.db.Exec(ctx, q, s.Status, s.Score, s.Pass, s.Feedback, ans, s.SubmittedAt, s.ID)
        return err
    }

# 11. handlers ----------------------------------------------------------------
- id: 9.11
  action: create_file
  path: assessment-service/internal/handlers/assessment.go
  content: |
    package handlers

    import (
        "net/http"
        "time"
        "github.com/gin-gonic/gin"
        "github.com/google/uuid"
        "github.com/glohib/assessment-service/internal/models"
        "github.com/glohib/assessment-service/internal/repository"
        "github.com/glohib/assessment-service/internal/services"
        "go.uber.org/zap"
    )

    type AssessmentHandler struct {
        repo        *repository.AssessmentRepo
        stageRepo   *repository.StageRepo
        stateSvc    *services.StateMachineService
        timerSvc    *services.TimerService
        log         *zap.Logger
        stageTTL    time.Duration
    }

    func NewAssessmentHandler(repo *repository.AssessmentRepo, sr *repository.StageRepo, ss *services.StateMachineService, ts *services.TimerService, log *zap.Logger, stageTTL int) *AssessmentHandler {
        return &AssessmentHandler{
            repo: repo, stageRepo: sr, stateSvc: ss, timerSvc: ts, log: log,
            stageTTL: time.Duration(stageTTL) * time.Minute,
        }
    }

    func (h *AssessmentHandler) Start(c *gin.Context) {
        var req struct {
            CandidateID string `json:"candidate_id" binding:"required"`
            JobID       string `json:"job_id" binding:"required"`
        }
        if err := c.ShouldBindJSON(&req); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }
        aid := uuid.New()
        a := &models.Assessment{
            ID:          aid,
            CandidateID: uuid.MustParse(req.CandidateID),
            JobID:       uuid.MustParse(req.JobID),
            State:       models.StateDraft,
        }
        if err := h.repo.Create(c, a); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "db"})
            return
        }
        if err := h.stateSvc.Start(c, aid); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "state"})
            return
        }
        c.JSON(http.StatusCreated, gin.H{
            "assessment_id": aid,
            "stage":         models.StateScreening,
            "expires_at":    time.Now().Add(h.stageTTL).Unix(),
        })
    }

    func (h *AssessmentHandler) GetStatus(c *gin.Context) {
        aid, _ := uuid.Parse(c.Param("id"))
        a, err := h.repo.Get(c, aid)
        if err != nil {
            c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
            return
        }
        rem, _ := h.timerSvc.Remaining(c, aid.String(), a.State)
        c.JSON(http.StatusOK, gin.H{
            "stage":      a.State,
            "status":     "active",
            "expires_at": time.Now().Add(rem).Unix(),
        })
    }

# 12. stage handler -----------------------------------------------------------
- id: 9.12
  action: create_file
  path: assessment-service/internal/handlers/stage.go
  content: |
    package handlers

    import (
        "net/http"
        "time"
        "github.com/gin-gonic/gin"
        "github.com/google/uuid"
        "github.com/glohib/assessment-service/internal/models"
        "github.com/glohib/assessment-service/internal/repository"
        "github.com/glohib/assessment-service/internal/services"
        "go.uber.org/zap"
    )

    type StageHandler struct {
        stageRepo *repository.StageRepo
        stateSvc  *services.StateMachineService
        timerSvc  *services.TimerService
        log       *zap.Logger
    }

    func NewStageHandler(sr *repository.StageRepo, ss *services.StateMachineService, ts *services.TimerService, log *zap.Logger) *StageHandler {
        return &StageHandler{stageRepo: sr, stateSvc: ss, timerSvc: ts, log: log}
    }

    func (h *StageHandler) Submit(c *gin.Context) {
        aid, _ := uuid.Parse(c.Param("id"))
        stage := c.Param("stage")
        var req struct {
            Answers []struct {
                QuestionID string `json:"question_id"`
                Text       string `json:"text"`
            } `json:"answers"`
        }
        if err := c.ShouldBindJSON(&req); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }
        s, err := h.stageRepo.GetByName(c, aid, stage)
        if err != nil {
            c.JSON(http.StatusNotFound, gin.H{"error": "stage not found"})
            return
        }
        s.Status = models.StatusSubmitted
        now := time.Now()
        s.SubmittedAt = &now
        if err := h.stageRepo.Update(c, s); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "db"})
            return
        }
        if err := h.timerSvc.Cancel(c, aid.String(), stage); err != nil {
            h.log.Warn("timer cancel", zap.Error(err))
        }
        score := 0.75 // TODO: integrate NLP service
        pass := score >= 0.7
        evt := "pass_" + stage
        if !pass {
            evt = "fail_" + stage
        }
        if err := h.stateSvc.Transition(c, aid, evt); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "state"})
            return
        }
        c.JSON(http.StatusOK, gin.H{
            "result": "graded",
            "score":  score,
            "passed": pass,
        })
    }

# 13. state machine service ---------------------------------------------------
- id: 9.13
  action: create_file
  path: assessment-service/internal/services/statemachine.go
  content: |
    package services

    import (
        "context"
        "fmt"
        "github.com/google/uuid"
        "github.com/glohib/assessment-service/internal/models"
        "github.com/glohib/assessment-service/internal/repository"
        "go.uber.org/zap"
        "github.com/looplab/fsm"
    )

    type StateMachineService struct {
        repo *repository.AssessmentRepo
        log  *zap.Logger
    }

    func NewStateMachineService(repo *repository.AssessmentRepo, log *zap.Logger) *StateMachineService {
        return &StateMachineService{repo: repo, log: log}
    }

    func (s *StateMachineService) Start(ctx context.Context, id uuid.UUID) error {
        return s.repo.UpdateState(ctx, id, models.StateScreening)
    }

    func (s *StateMachineService) Transition(ctx context.Context, id uuid.UUID, event string) error {
        a, err := s.repo.Get(ctx, id)
        if err != nil {
            return err
        }
        sm := fsm.NewFSM(
            a.State,
            fsm.Events{
                {Name: "pass_screening", Src: []string{models.StateScreening}, Dst: models.StateTechnical},
                {Name: "fail_screening", Src: []string{models.StateScreening}, Dst: models.StateFailed},
                {Name: "pass_technical", Src: []string{models.StateTechnical}, Dst: models.StateCultural},
                {Name: "fail_technical", Src: []string{models.StateTechnical}, Dst: models.StateFailed},
                {Name: "pass_cultural", Src: []string{models.StateCultural}, Dst: models.StateFinal},
                {Name: "fail_cultural", Src: []string{models.StateCultural}, Dst: models.StateFailed},
                {Name: "pass_final", Src: []string{models.StateFinal}, Dst: models.StatePassed},
                {Name: "fail_final", Src: []string{models.StateFinal}, Dst: models.StateFailed},
            },
            fsm.Callbacks{},
        )
        if !sm.Can(event) {
            return fmt.Errorf("invalid transition")
        }
        if err := sm.Event(event); err != nil {
            return err
        }
        return s.repo.UpdateState(ctx, id, sm.Current())
    }

# 14. main.go -----------------------------------------------------------------
- id: 9.14
  action: create_file
  path: assessment-service/cmd/main.go
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
        "github.com/gin-gonic/gin"
        "github.com/jackc/pgx/v5/pgxpool"
        "github.com/redis/go-redis/v9"
        "github.com/glohib/assessment-service/internal/handlers"
        "github.com/glohib/assessment-service/internal/repository"
        "github.com/glohib/assessment-service/internal/services"
        "github.com/glohib/assessment-service/pkg/config"
        "go.uber.org/zap"
    )

    func main() {
        logger, _ := zap.NewProduction()
        defer logger.Sync()

        cfg, err := config.Load()
        if err != nil {
            logger.Fatal("config", zap.Error(err))
        }

        db, err := pgxpool.New(context.Background(), postgresDSN(cfg.DB))
        if err != nil {
            logger.Fatal("db", zap.Error(err))
        }
        defer db.Close()

        rdb := redis.NewClient(&redis.Options{
            Addr: cfg.Redis.Addr,
        })
        defer rdb.Close()

        repo := repository.NewAssessmentRepo(db)
        stageRepo := repository.NewStageRepo(db)
        stateSvc := services.NewStateMachineService(repo, logger)
        timerSvc := services.NewTimerService(rdb, logger)

        ah := handlers.NewAssessmentHandler(repo, stageRepo, stateSvc, timerSvc, logger, cfg.Timer.StageTimeoutMinutes)
        sh := handlers.NewStageHandler(stageRepo, stateSvc, timerSvc, logger)

        g := gin.New()
        g.Use(gin.Recovery(), gin.Logger())

        api := g.Group("/api/v1/assessment")
        {
            api.POST("/start", ah.Start)
            api.GET("/:id/status", ah.GetStatus)
            api.POST("/:id/stage/:stage/submit", sh.Submit)
            api.GET("/:id/stage/:stage/result", sh.GetResult)
            api.POST("/:id/stage/psychomotor/start", sh.StartPsychomotor)
            api.POST("/:id/stage/psychomotor/submit", sh.SubmitPsychomotor)
            api.POST("/:id/stage/situational/start", sh.StartSituational)
            api.POST("/:id/stage/situational/submit", sh.SubmitSituational)
            api.GET("/:id/final-result", ah.FinalResult)
        }

        srv := &http.Server{Addr: ":" + strconv.Itoa(cfg.Server.Port), Handler: g}

        go func() {
            if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
                logger.Fatal("http", zap.Error(err))
            }
        }()

        quit := make(chan os.Signal, 1)
        signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
        <-quit

        ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
        defer cancel()
        if err := srv.Shutdown(ctx); err != nil {
            logger.Error("shutdown", zap.Error(err))
        }
    }

    func postgresDSN(c config.DBConfig) string {
        return fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
            c.Host, c.Port, c.User, c.Password, c.DBName, c.SSLMode)
    }

# 15. migrations --------------------------------------------------------------
- id: 9.15
  action: create_file
  path: assessment-service/migrations/001_init.sql
  content: |
    CREATE TABLE assessments (
        id UUID PRIMARY KEY,
        candidate_id UUID NOT NULL,
        job_id UUID NOT NULL,
        state TEXT NOT NULL,
        overall_score REAL DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now(),
        completed_at TIMESTAMPTZ
    );

    CREATE TABLE stages (
        id UUID PRIMARY KEY,
        assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        status TEXT NOT NULL,
        score REAL DEFAULT 0,
        pass BOOLEAN DEFAULT false,
        feedback TEXT,
        answers JSONB,
        started_at TIMESTAMPTZ,
        submitted_at TIMESTAMPTZ,
        expires_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE INDEX idx_stages_assessment ON stages(assessment_id);

# 16. config yaml -------------------------------------------------------------
- id: 9.16
  action: create_file
  path: assessment-service/config.yaml
  content: |
    db:
      host: postgres
      port: 5432
      user: glohib
      password: glohib
      dbname: assessment
      sslmode: disable
    redis:
      addr: redis:6379
      password: ""
      db: 0
    server:
      port: 8080
      grpcport: 9000
      readtimeout: 10
      writetimeout: 10
    jwt:
      secret: supersecret
      ttl: 3600
    llm:
      endpoint: http://llm-service:8080
      apikey: key
      timeout: 30
    nlp:
      endpoint: http://nlp-service:8080
      apikey: key
      timeout: 30
    timer:
      stagetimeoutminutes: 60
      warnminutes: 5

# 17. Dockerfile --------------------------------------------------------------
- id: 9.17
  action: create_file
  path: assessment-service/Dockerfile
  content: |
    FROM golang:1.22-alpine AS builder
    RUN apk add --no-cache git
    WORKDIR /app
    COPY go.mod go.sum ./
    RUN go mod download
    COPY . .
    RUN CGO_ENABLED=0 GOOS=linux go build -o assessment-service ./cmd

    FROM alpine:3.19
    RUN apk --no-cache add ca-certificates
    WORKDIR /root/
    COPY --from=builder /app/assessment-service .
    COPY --from=builder /app/config.yaml .
    CMD ["./assessment-service"]

# 18. docker-compose ----------------------------------------------------------
- id: 9.18
  action: create_file
  path: assessment-service/docker-compose.yml
  content: |
    version: "3.9"
    services:
      assessment-service:
        build: .
        ports:
          - "8080:8080"
        depends_on:
          - postgres
          - redis
        environment:
          - CONFIG_PATH=/root/config.yaml
      postgres:
        image: postgres:16-alpine
        environment:
          POSTGRES_USER: glohib
          POSTGRES_PASSWORD: glohib
          POSTGRES_DB: assessment
        volumes:
          - pgdata:/var/lib/postgresql/data
          - ./migrations:/docker-entrypoint-initdb.d
      redis:
        image: redis:7-alpine
        volumes:
          - redisdata:/data
    volumes:
      pgdata:
      redisdata:

# 19. generate proto ----------------------------------------------------------
- id: 9.19
  action: shell_command
  command: |
    cd assessment-service
    protoc --go_out=. --go_opt=paths=source_relative \
           --go-grpc_out=. --go-grpc_opt=paths=source_relative \
           pkg/proto/assessment.proto

# 20. go mod tidy -------------------------------------------------------------
- id: 9.20
  action: shell_command
  command: |
    cd assessment-service && go mod tidy

deliverables:
  - assessment-service/go.mod
  - assessment-service/pkg/proto/assessment.proto
  - assessment-service/pkg/config/config.go
  - assessment-service/internal/models/assessment.go
  - assessment-service/internal/models/stage.go
  - assessment-service/internal/services/statemachine.go
  - assessment-service/internal/services/timer.go
  - assessment-service/internal/repository/assessment.go
  - assessment-service/internal/repository/stage.go
  - assessment-service/internal/handlers/assessment.go
  - assessment-service/internal/handlers/stage.go
  - assessment-service/cmd/main.go
  - assessment-service/migrations/001_init.sql
  - assessment-service/config.yaml
  - assessment-service/Dockerfile
  - assessment-service/docker-compose.yml

verification_checklist:
  - go build ./cmd succeeds
  - docker-compose up brings service, postgres, redis
  - POST /api/v1/assessment/start returns assessment_id
  - GET /api/v1/assessment/{id}/status returns current stage
  - State transitions from screening→technical→cultural→final work
  - Timer starts and expires correctly
  - All 9 REST endpoints respond 200
  - gRPC server listens on port 9000
  - PostgreSQL tables created
  - Redis timers stored with TTL

execution_commands:
  - cd assessment-service && docker-compose up --build
  - curl -X POST http://localhost:8080/api/v1/assessment/start -d '{"candidate_id":"550e8400-e29b-41d4-a716-446655440000","job_id":"660e8400-e29b-41d4-a716-446655440001"}'
  - curl http://localhost:8080/api/v1/assessment/{id}/status

next_step: STEP-10-NOTIFICATION-SERVICE
```

---

**Token Usage:** {'prompt_tokens': 754, 'completion_tokens': 8001, 'total_tokens': 8755, 'cached_tokens': 754, 'prompt_tokens_details': {'cached_tokens': 754}}
