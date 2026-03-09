# GLOHIB.AI - STEP 5: STUDENT SERVICE (GO)
**Generated:** 2026-02-28 03:41:23

---

```yaml
# ================================================================================
# GLOHIB.AI - STEP 5: STUDENT SERVICE (Go)
# Atomic YAML Specification
# ================================================================================

step_metadata:
  id: glohib-step-005
  name: "Student Service Implementation"
  phase: "Backend Services"
  priority: "critical"
  estimate: "8-10 hours"
  service: "student-service"
  port: 8082
  grpc_port: 50052

context:
  project: "Glohib.ai"
  description: "Implement the Student microservice responsible for student profile management, vector embeddings, and internship applications"
  prerequisites:
    - PostgreSQL with pgvector extension
    - Redis server running
    - Python embedding service (sentence-transformers)
  architecture:
    type: "microservice"
    pattern: "domain-driven"
    communication: "REST + gRPC"
    database: "PostgreSQL + Redis"
    vector_db: "pgvector"

tasks:
  # -----------------------------------------------------------------------------
  # 1. Project Setup
  # -----------------------------------------------------------------------------
  - id: "task.005.001"
    name: "Initialize Go module"
    type: "shell_command"
    description: "Create student service directory and initialize Go module"
    command: |
      mkdir -p student-service/{cmd,internal/{handlers,models,repositories,services,middleware,utils},pkg/{proto,config},migrations,tests}
      cd student-service
      go mod init github.com/glohib-ai/student-service

  # -----------------------------------------------------------------------------
  # 2. Go Module Dependencies
  # -----------------------------------------------------------------------------
  - id: "task.005.002"
    name: "Create go.mod with dependencies"
    type: "create_file"
    filepath: "student-service/go.mod"
    content: |
      module github.com/glohib-ai/student-service

      go 1.22

      require (
        github.com/gin-gonic/gin v1.9.1
        github.com/jackc/pgx/v5 v5.5.1
        github.com/jackc/pgtype v1.14.0
        github.com/redis/go-redis/v9 v9.3.1
        google.golang.org/grpc v1.60.1
        google.golang.org/protobuf v1.32.0
        github.com/golang/protobuf v1.5.3
        github.com/lib/pq v1.10.9
        github.com/google/uuid v1.5.0
        github.com/spf13/viper v1.18.2
        github.com/sirupsen/logrus v1.9.3
        github.com/swaggo/swag v1.16.2
        github.com/swaggo/gin-swagger v1.6.0
        github.com/swaggo/files v1.0.0
        github.com/go-playground/validator/v10 v10.16.0
        github.com/stretchr/testify v1.8.4
        github.com/olivere/elastic/v7 v7.0.32
      )

      require (
        github.com/KyleBanks/depth v1.2.1 // indirect
        github.com/bytedance/sonic v1.10.2 // indirect
        github.com/cespare/xxhash/v2 v2.2.0 // indirect
        github.com/chenzhuoyu/base64x v0.0.0-20230717121745-296ad89f973d // indirect
        github.com/chenzhuoyu/iasm v0.9.1 // indirect
        github.com/dgryski/go-rendezvous v0.0.0-20200823014737-9f7001d12a5f // indirect
        github.com/fsnotify/fsnotify v1.7.0 // indirect
        github.com/gabriel-vasile/mimetype v1.4.3 // indirect
        github.com/gin-contrib/sse v0.1.0 // indirect
        github.com/go-openapi/jsonpointer v0.20.2 // indirect
        github.com/go-openapi/jsonreference v0.20.4 // indirect
        github.com/go-openapi/spec v0.20.14 // indirect
        github.com/go-openapi/swag v0.22.7 // indirect
        github.com/go-playground/locales v0.14.1 // indirect
        github.com/go-playground/universal-translator v0.18.1 // indirect
        github.com/goccy/go-json v0.10.2 // indirect
        github.com/hashicorp/hcl v1.0.0 // indirect
        github.com/jackc/pgpassfile v1.0.0 // indirect
        github.com/jackc/pgservicefile v0.0.0-20231201235250-de7065d80cb9 // indirect
        github.com/jackc/puddle/v2 v2.2.1 // indirect
        github.com/josharian/intern v1.0.0 // indirect
        github.com/json-iterator/go v1.1.12 // indirect
        github.com/klauspost/cpuid/v2 v2.2.6 // indirect
        github.com/leodido/go-urn v1.2.4 // indirect
        github.com/magiconair/properties v1.8.7 // indirect
        github.com/mailru/easyjson v0.7.7 // indirect
        github.com/mattn/go-isatty v0.0.20 // indirect
        github.com/mitchellh/mapstructure v1.5.0 // indirect
        github.com/modern-go/concurrent v0.0.0-20180306012644-bacd9c7ef1dd // indirect
        github.com/modern-go/reflect2 v1.0.2 // indirect
        github.com/pelletier/go-toml/v2 v2.1.1 // indirect
        github.com/sagikazarmark/locafero v0.4.0 // indirect
        github.com/sagikazarmark/slog-shim v0.1.0 // indirect
        github.com/sourcegraph/conc v0.3.0 // indirect
        github.com/spf13/afero v1.11.0 // indirect
        github.com/spf13/cast v1.6.0 // indirect
        github.com/spf13/pflag v1.0.5 // indirect
        github.com/subosito/gotenv v1.6.0 // indirect
        github.com/twitchyliquid64/golang-asm v0.15.1 // indirect
        github.com/ugorji/go/codec v1.2.12 // indirect
        go.uber.org/multierr v1.11.0 // indirect
        golang.org/x/arch v0.6.0 // indirect
        golang.org/x/crypto v0.17.0 // indirect
        golang.org/x/exp v0.0.0-20231226003508-02704c960a9b // indirect
        golang.org/x/net v0.19.0 // indirect
        golang.org/x/sync v0.5.0 // indirect
        golang.org/x/sys v0.15.0 // indirect
        golang.org/x/text v0.14.0 // indirect
        golang.org/x/tools v0.16.1 // indirect
        google.golang.org/genproto/googleapis/rpc v0.0.0-20231212172506-995d672761c0 // indirect
        gopkg.in/ini.v1 v1.67.0 // indirect
        gopkg.in/yaml.v3 v3.0.1 // indirect
        rsc.io/pdf v0.1.1 // indirect
      )

  # -----------------------------------------------------------------------------
  # 3. Configuration
  # -----------------------------------------------------------------------------
  - id: "task.005.003"
    name: "Create configuration structure"
    type: "create_file"
    filepath: "student-service/pkg/config/config.go"
    content: |
      package config

      import (
        "fmt"
        "log"
        "os"
        "strconv"
        "time"

        "github.com/spf13/viper"
      )

      type Config struct {
        Server   ServerConfig
        Database DatabaseConfig
        Redis    RedisConfig
        Logging  LoggingConfig
        Services ServicesConfig
      }

      type ServerConfig struct {
        Host         string
        Port         int
        GRPCPort     int
        ReadTimeout  time.Duration
        WriteTimeout time.Duration
        IdleTimeout  time.Duration
      }

      type DatabaseConfig struct {
        Host         string
        Port         int
        User         string
        Password     string
        Database     string
        SSLMode      string
        MaxConns     int32
        MinConns     int32
        MaxLifetime  time.Duration
        MaxIdleTime  time.Duration
      }

      type RedisConfig struct {
        Host         string
        Port         int
        Password     string
        DB           int
        PoolSize     int
        MinIdleConns int
        MaxRetries   int
        DialTimeout  time.Duration
        ReadTimeout  time.Duration
        WriteTimeout time.Duration
      }

      type LoggingConfig struct {
        Level  string
        Format string
        Output string
      }

      type ServicesConfig struct {
        EmbeddingServiceURL string
        AuthServiceURL      string
        NotificationServiceURL string
      }

      func Load() (*Config, error) {
        viper.SetConfigName("config")
        viper.SetConfigType("yaml")
        viper.AddConfigPath(".")
        viper.AddConfigPath("./config")
        viper.AddConfigPath("/etc/student-service")

        viper.SetEnvPrefix("STUDENT")
        viper.AutomaticEnv()

        // Set defaults
        setDefaults()

        if err := viper.ReadInConfig(); err != nil {
          if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
            return nil, fmt.Errorf("error reading config file: %w", err)
          }
        }

        var cfg Config
        if err := viper.Unmarshal(&cfg); err != nil {
          return nil, fmt.Errorf("error unmarshaling config: %w", err)
        }

        return &cfg, nil
      }

      func setDefaults() {
        viper.SetDefault("server.host", "0.0.0.0")
        viper.SetDefault("server.port", 8082)
        viper.SetDefault("server.grpc_port", 50052)
        viper.SetDefault("server.read_timeout", "15s")
        viper.SetDefault("server.write_timeout", "15s")
        viper.SetDefault("server.idle_timeout", "60s")

        viper.SetDefault("database.host", "localhost")
        viper.SetDefault("database.port", 5432)
        viper.SetDefault("database.user", "postgres")
        viper.SetDefault("database.password", "postgres")
        viper.SetDefault("database.database", "glohib_student")
        viper.SetDefault("database.ssl_mode", "disable")
        viper.SetDefault("database.max_conns", 25)
        viper.SetDefault("database.min_conns", 5)
        viper.SetDefault("database.max_lifetime", "5m")
        viper.SetDefault("database.max_idle_time", "1m")

        viper.SetDefault("redis.host", "localhost")
        viper.SetDefault("redis.port", 6379)
        viper.SetDefault("redis.db", 0)
        viper.SetDefault("redis.pool_size", 10)
        viper.SetDefault("redis.min_idle_conns", 5)
        viper.SetDefault("redis.max_retries", 3)
        viper.SetDefault("redis.dial_timeout", "5s")
        viper.SetDefault("redis.read_timeout", "3s")
        viper.SetDefault("redis.write_timeout", "3s")

        viper.SetDefault("logging.level", "info")
        viper.SetDefault("logging.format", "json")
        viper.SetDefault("logging.output", "stdout")

        viper.SetDefault("services.embedding_service_url", "http://localhost:8085")
        viper.SetDefault("services.auth_service_url", "http://localhost:8081")
        viper.SetDefault("services.notification_service_url", "http://localhost:8086")
      }

      func (c *Config) Validate() error {
        if c.Server.Port <= 0 || c.Server.Port > 65535 {
          return fmt.Errorf("invalid server port: %d", c.Server.Port)
        }
        if c.Database.Database == "" {
          return fmt.Errorf("database name is required")
        }
        return nil
      }

  # -----------------------------------------------------------------------------
  # 4. Database Models
  # -----------------------------------------------------------------------------
  - id: "task.005.004"
    name: "Create student model"
    type: "create_file"
    filepath: "student-service/internal/models/student.go"
    content: |
      package models

      import (
        "time"
        "github.com/google/uuid"
      )

      // Student represents a student in the system
      type Student struct {
        ID                uuid.UUID  `json:"id" db:"id"`
        UserID            uuid.UUID  `json:"user_id" db:"user_id"`
        FirstName         string     `json:"first_name" db:"first_name"`
        LastName          string     `json:"last_name" db:"last_name"`
        Email             string     `json:"email" db:"email"`
        Phone             *string    `json:"phone,omitempty" db:"phone"`
        DateOfBirth       *time.Time `json:"date_of_birth,omitempty" db:"date_of_birth"`
        Gender            *string    `json:"gender,omitempty" db:"gender"`
        Nationality       *string    `json:"nationality,omitempty" db:"nationality"`
        Address           *string    `json:"address,omitempty" db:"address"`
        City              *string    `json:"city,omitempty" db:"city"`
        State             *string    `json:"state,omitempty" db:"state"`
        Country           *string    `json:"country,omitempty" db:"country"`
        PostalCode        *string    `json:"postal_code,omitempty" db:"postal_code"`
        ProfilePictureURL *string    `json:"profile_picture_url,omitempty" db:"profile_picture_url"`
        Bio               *string    `json:"bio,omitempty" db:"bio"`
        LinkedInURL       *string    `json:"linkedin_url,omitempty" db:"linkedin_url"`
        GitHubURL         *string    `json:"github_url,omitempty" db:"github_url"`
        WebsiteURL        *string    `json:"website_url,omitempty" db:"website_url"`
        IsActive          bool       `json:"is_active" db:"is_active"`
        ProfileComplete   float64    `json:"profile_complete" db:"profile_complete"`
        CreatedAt         time.Time  `json:"created_at" db:"created_at"`
        UpdatedAt         time.Time  `json:"updated_at" db:"updated_at"`
        DeletedAt         *time.Time `json:"deleted_at,omitempty" db:"deleted_at"`
      }

      // StudentCreate represents data required to create a student
      type StudentCreate struct {
        UserID            uuid.UUID  `json:"user_id" validate:"required"`
        FirstName         string     `json:"first_name" validate:"required,min=1,max=100"`
        LastName          string     `json:"last_name" validate:"required,min=1,max=100"`
        Email             string     `json:"email" validate:"required,email"`
        Phone             *string    `json:"phone,omitempty" validate:"omitempty,e164"`
        DateOfBirth       *time.Time `json:"date_of_birth,omitempty"`
        Gender            *string    `json:"gender,omitempty" validate:"omitempty,oneof=male female other"`
        Nationality       *string    `json:"nationality,omitempty"`
        Address           *string    `json:"address,omitempty"`
        City              *string    `json:"city,omitempty"`
        State             *string    `json:"state,omitempty"`
        Country           *string    `json:"country,omitempty"`
        PostalCode        *string    `json:"postal_code,omitempty"`
        ProfilePictureURL *string    `json:"profile_picture_url,omitempty" validate:"omitempty,url"`
        Bio               *string    `json:"bio,omitempty" validate:"omitempty,max=2000"`
        LinkedInURL       *string    `json:"linkedin_url,omitempty" validate:"omitempty,url"`
        GitHubURL         *string    `json:"github_url,omitempty" validate:"omitempty,url"`
        WebsiteURL        *string    `json:"website_url,omitempty" validate:"omitempty,url"`
      }

      // StudentUpdate represents data that can be updated for a student
      type StudentUpdate struct {
        FirstName         *string    `json:"first_name,omitempty" validate:"omitempty,min=1,max=100"`
        LastName          *string    `json:"last_name,omitempty" validate:"omitempty,min=1,max=100"`
        Email             *string    `json:"email,omitempty" validate:"omitempty,email"`
        Phone             *string    `json:"phone,omitempty" validate:"omitempty,e164"`
        DateOfBirth       *time.Time `json:"date_of_birth,omitempty"`
        Gender            *string    `json:"gender,omitempty" validate:"omitempty,oneof=male female other"`
        Nationality       *string    `json:"nationality,omitempty"`
        Address           *string    `json:"address,omitempty"`
        City              *string    `json:"city,omitempty"`
        State             *string    `json:"state,omitempty"`
        Country           *string    `json:"country,omitempty"`
        PostalCode        *string    `json:"postal_code,omitempty"`
        ProfilePictureURL *string    `json:"profile_picture_url,omitempty" validate:"omitempty,url"`
        Bio               *string    `json:"bio,omitempty" validate:"omitempty,max=2000"`
        LinkedInURL       *string    `json:"linkedin_url,omitempty" validate:"omitempty,url"`
        GitHubURL         *string    `json:"github_url,omitempty" validate:"omitempty,url"`
        WebsiteURL        *string    `json:"website_url,omitempty" validate:"omitempty,url"`
        IsActive          *bool      `json:"is_active,omitempty"`
      }

      // Skill represents a student's skill
      type Skill struct {
        ID          uuid.UUID  `json:"id" db:"id"`
        StudentID   uuid.UUID  `json:"student_id" db:"student_id"`
        Name        string     `json:"name" db:"name"`
        Proficiency int        `json:"proficiency" db:"proficiency"` // 1-5 scale
        Category    *string    `json:"category,omitempty" db:"category"`
        CreatedAt   time.Time  `json:"created_at" db:"created_at"`
        UpdatedAt   time.Time  `json:"updated_at" db:"updated_at"`
      }

      // SkillCreate represents data required to create a skill
      type SkillCreate struct {
        Name        string  `json:"name" validate:"required,min=1,max=100"`
        Proficiency int     `json:"proficiency" validate:"required,min=1,max=5"`
        Category    *string `json:"category,omitempty" validate:"omitempty,max=50"`
      }

      // Education represents a student's education history
      type Education struct {
        ID           uuid.UUID  `json:"id" db:"id"`
        StudentID    uuid.UUID  `json:"student_id" db:"student_id"`
        Institution  string     `json:"institution" db:"institution"`
        Degree       string     `json:"degree" db:"degree"`
        FieldOfStudy string     `json:"field_of_study" db:"field_of_study"`
        StartDate    time.Time  `json:"start_date" db:"start_date"`
        EndDate      *time.Time `json:"end_date,omitempty" db:"end_date"`
        GPA          *float64   `json:"gpa,omitempty" db:"gpa"`
        Description  *string    `json:"description,omitempty" db:"description"`
        IsCurrent    bool       `json:"is_current" db:"is_current"`
        CreatedAt    time.Time  `json:"created_at" db:"created_at"`
        UpdatedAt    time.Time  `json:"updated_at" db:"updated_at"`
      }

      // EducationCreate represents data required to create education entry
      type EducationCreate struct {
        Institution  string     `json:"institution" validate:"required,min=1,max=200"`
        Degree       string     `json:"degree" validate:"required,min=1,max=100"`
        FieldOfStudy string     `json:"field_of_study" validate:"required,min=1,max=100"`
        StartDate    time.Time  `json:"start_date" validate:"required"`
        EndDate      *time.Time `json:"end_date,omitempty"`
        GPA          *float64   `json:"gpa,omitempty" validate:"omitempty,min=0,max=4"`
        Description  *string    `json:"description,omitempty" validate:"omitempty,max=1000"`
        IsCurrent    bool       `json:"is_current"`
      }

      // Experience represents a student's work experience
      type Experience struct {
        ID          uuid.UUID  `json:"id" db:"id"`
        StudentID   uuid.UUID  `json:"student_id" db:"student_id"`
        Company     string     `json:"company" db:"company"`
        Position    string     `json:"position" db:"position"`
        StartDate   time.Time  `json:"start_date" db:"start_date"`
        EndDate     *time.Time `json:"end_date,omitempty" db:"end_date"`
        Description *string    `json:"description,omitempty" db:"description"`
        IsCurrent   bool       `json:"is_current" db:"is_current"`
        CreatedAt   time.Time  `json:"created_at" db:"created_at"`
        UpdatedAt   time.Time  `json:"updated_at" db:"updated_at"`
      }

      // ExperienceCreate represents data required to create experience entry
      type ExperienceCreate struct {
        Company     string     `json:"company" validate:"required,min=1,max=100"`
        Position    string     `json:"position" validate:"required,min=1,max=100"`
        StartDate   time.Time  `json:"start_date" validate:"required"`
        EndDate     *time.Time `json:"end_date,omitempty"`
        Description *string    `json:"description,omitempty" validate:"omitempty,max=2000"`
        IsCurrent   bool       `json:"is_current"`
      }

  # -----------------------------------------------------------------------------
  # 5. Profile Vector Model
  # -----------------------------------------------------------------------------
  - id: "task.005.005"
    name: "Create profile vector model"
    type: "create_file"
    filepath: "student-service/internal/models/profile.go"
    content: |
      package models

      import (
        "time"
        "github.com/google/uuid"
      )

      // ProfileVector represents a student's profile embedding vector
      type ProfileVector struct {
        ID          uuid.UUID   `json:"id" db:"id"`
        StudentID   uuid.UUID   `json:"student_id" db:"student_id"`
        Vector      []float32   `json:"vector" db:"vector"` // 512-dimensional embedding
        VectorType  string      `json:"vector_type" db:"vector_type"` // 'profile', 'skills', 'experience'
        Metadata    *Metadata   `json:"metadata,omitempty" db:"metadata"`
        CreatedAt   time.Time   `json:"created_at" db:"created_at"`
        UpdatedAt   time.Time   `json:"updated_at" db:"updated_at"`
      }

      // Metadata contains additional information about the vector
      type Metadata struct {
        ModelVersion string            `json:"model_version"`
        TextSource   string            `json:"text_source"`
        TextLength   int               `json:"text_length"`
        Confidence   float64           `json:"confidence"`
        Tags         map[string]string `json:"tags,omitempty"`
      }

      // VectorSearchRequest represents a vector similarity search request
      type VectorSearchRequest struct {
        Vector      []float32 `json:"vector" validate:"required,len=512"`
        Limit       int       `json:"limit" validate:"min=1,max=100"`
        Threshold   float64   `json:"threshold" validate:"min=0,max=1"`
        VectorType  string    `json:"vector_type" validate:"required,oneof=profile skills experience"`
      }

      // VectorSearchResult represents a vector similarity search result
      type VectorSearchResult struct {
        StudentID uuid.UUID `json:"student_id"`
        Similarity float64  `json:"similarity"`
        Student   *Student  `json:"student,omitempty"`
      }

      // ProfileScore represents profile completeness score
      type ProfileScore struct {
        StudentID       uuid.UUID          `json:"student_id"`
        TotalScore      float64            `json:"total_score"`
        MaxScore        float64            `json:"max_score"`
        Percentage      float64            `json:"percentage"`
        Breakdown       ScoreBreakdown     `json:"breakdown"`
        LastCalculated  time.Time          `json:"last_calculated"`
      }

      // ScoreBreakdown contains detailed scoring information
      type ScoreBreakdown struct {
        BasicInfo       float64 `json:"basic_info"`
        ContactInfo     float64 `json:"contact_info"`
        Education       float64 `json:"education"`
        Experience      float64 `json:"experience"`
        Skills          float64 `json:"skills"`
        Bio             float64 `json:"bio"`
        Links           float64 `json:"links"`
        ProfilePicture  float64 `json:"profile_picture"`
      }

  # -----------------------------------------------------------------------------
  # 6. Application Models
  # -----------------------------------------------------------------------------
  - id: "task.005.006"
    name: "Create application models"
    type: "create_file"
    filepath: "student-service/internal/models/application.go"
    content: |
      package models

      import (
        "time"
        "github.com/google/uuid"
      )

      // ApplicationStatus represents the status of an internship application
      type ApplicationStatus string

      const (
        ApplicationStatusDraft      ApplicationStatus = "draft"
        ApplicationStatusSubmitted  ApplicationStatus = "submitted"
        ApplicationStatusReviewing  ApplicationStatus = "reviewing"
        ApplicationStatusInterview  ApplicationStatus = "interview"
        ApplicationStatusOffered    ApplicationStatus = "offered"
        ApplicationStatusAccepted   ApplicationStatus = "accepted"
        ApplicationStatusRejected   ApplicationStatus = "rejected"
        ApplicationStatusWithdrawn  ApplicationStatus = "withdrawn"
      )

      // Application represents a student's internship application
      type Application struct {
        ID                uuid.UUID         `json:"id" db:"id"`
        StudentID         uuid.UUID         `json:"student_id" db:"student_id"`
        InternshipID      uuid.UUID         `json:"internship_id" db:"internship_id"`
        CompanyID         uuid.UUID         `json:"company_id" db:"company_id"`
        Status            ApplicationStatus `json:"status" db:"status"`
        CoverLetter       *string           `json:"cover_letter,omitempty" db:"cover_letter"`
        ResumeURL         string            `json:"resume_url" db:"resume_url"`
        TranscriptURL     *string           `json:"transcript_url,omitempty" db:"transcript_url"`
        PortfolioURL      *string           `json:"portfolio_url,omitempty" db:"portfolio_url"`
        ExpectedSalary    *float64          `json:"expected_salary,omitempty" db:"expected_salary"`
        AvailableFrom     *time.Time        `json:"available_from,omitempty" db:"available_from"`
        AvailableTo       *time.Time        `json:"available_to,omitempty" db:"available_to"`
        Notes             *string           `json:"notes,omitempty" db:"notes"`
        SubmittedAt       *time.Time        `json:"submitted_at,omitempty" db:"submitted_at"`
        ReviewedAt        *time.Time        `json:"reviewed_at,omitempty" db:"reviewed_at"`
        InterviewAt       *time.Time        `json:"interview_at,omitempty" db:"interview_at"`
        DecisionAt        *time.Time        `json:"decision_at,omitempty" db:"decision_at"`
        CreatedAt         time.Time         `json:"created_at" db:"created_at"`
        UpdatedAt         time.Time         `json:"updated_at" db:"updated_at"`
      }

      // ApplicationCreate represents data required to create an application
      type ApplicationCreate struct {
        InternshipID      uuid.UUID  `json:"internship_id" validate:"required"`
        CompanyID         uuid.UUID  `json:"company_id" validate:"required"`
        CoverLetter       *string    `json:"cover_letter,omitempty" validate:"omitempty,max=5000"`
        ResumeURL         string     `json:"resume_url" validate:"required,url"`
        TranscriptURL     *string    `json:"transcript_url,omitempty" validate:"omitempty,url"`
        PortfolioURL      *string    `json:"portfolio_url,omitempty" validate:"omitempty,url"`
        ExpectedSalary    *float64   `json:"expected_salary,omitempty" validate:"omitempty,min=0"`
        AvailableFrom     *time.Time `json:"available_from,omitempty"`
        AvailableTo       *time.Time `json:"available_to,omitempty"`
        Notes             *string    `json:"notes,omitempty" validate:"omitempty,max=1000"`
      }

      // ApplicationUpdate represents data that can be updated for an application
      type ApplicationUpdate struct {
        CoverLetter    *string            `json:"cover_letter,omitempty" validate:"omitempty,max=5000"`
        ResumeURL      *string            `json:"resume_url,omitempty" validate:"omitempty,url"`
        TranscriptURL  *string            `json:"transcript_url,omitempty" validate:"omitempty,url"`
        PortfolioURL   *string            `json:"portfolio_url,omitempty" validate:"omitempty,url"`
        ExpectedSalary *float64           `json:"expected_salary,omitempty" validate:"omitempty,min=0"`
        AvailableFrom  *time.Time         `json:"available_from,omitempty"`
        AvailableTo    *time.Time         `json:"available_to,omitempty"`
        Notes          *string            `json:"notes,omitempty" validate:"omitempty,max=1000"`
        Status         *ApplicationStatus `json:"status,omitempty" validate:"omitempty,oneof=draft submitted reviewing interview offered accepted rejected withdrawn"`
      }

      // ApplicationFilters represents filters for querying applications
      type ApplicationFilters struct {
        StudentID     *uuid.UUID
        InternshipID  *uuid.UUID
        CompanyID     *uuid.UUID
        Status        *ApplicationStatus
        FromDate      *time.Time
        ToDate        *time.Time
        Limit         int
        Offset        int
      }

  # -----------------------------------------------------------------------------
  # 7. gRPC Proto Definition
  # -----------------------------------------------------------------------------
  - id: "task.005.007"
    name: "Create gRPC proto definition"
    type: "create_file"
    filepath: "student-service/pkg/proto/student.proto"
    content: |
      syntax = "proto3";

      package student;

      option go_package = "github.com/glohib-ai/student-service/pkg/proto";

      import "google/protobuf/timestamp.proto";
      import "google/protobuf/empty.proto";

      // StudentService provides student-related operations
      service StudentService {
        // Get student by ID
        rpc GetStudent(GetStudentRequest) returns (StudentResponse);
        
        // Update student profile
        rpc UpdateStudent(UpdateStudentRequest) returns (StudentResponse);
        
        // Delete student
        rpc DeleteStudent(DeleteStudentRequest) returns (google.protobuf.Empty);
        
        // Generate profile vector
        rpc GenerateVector(GenerateVectorRequest) returns (VectorResponse);
        
        // Get profile vector
        rpc GetVector(GetVectorRequest) returns (VectorResponse);
        
        // Search similar students by vector
        rpc SearchSimilar(SearchSimilarRequest) returns (SearchSimilarResponse);
        
        // Get profile completeness score
        rpc GetProfileScore(GetProfileScoreRequest) returns (ProfileScoreResponse);
        
        // Add skill to student profile
        rpc AddSkill(AddSkillRequest) returns (SkillResponse);
        
        // Remove skill from student profile
        rpc RemoveSkill(RemoveSkillRequest) returns (google.protobuf.Empty);
        
        // Add education entry
        rpc AddEducation(AddEducationRequest) returns (EducationResponse);
        
        // Remove education entry
        rpc RemoveEducation(RemoveEducationRequest) returns (google.protobuf.Empty);
        
        // Add experience entry
        rpc AddExperience(AddExperienceRequest) returns (ExperienceResponse);
        
        // Remove experience entry
        rpc RemoveExperience(RemoveExperienceRequest) returns (google.protobuf.Empty);
      }

      // Request messages
      message GetStudentRequest {
        string id = 1;
      }

      message UpdateStudentRequest {
        string id = 1;
        StudentUpdate data = 2;
      }

      message DeleteStudentRequest {
        string id = 1;
      }

      message GenerateVectorRequest {
        string student_id = 1;
        VectorType type = 2;
      }

      message GetVectorRequest {
        string student_id = 1;
        VectorType type = 2;
      }

      message SearchSimilarRequest {
        repeated float vector = 1;
        VectorType type = 2;
        int32 limit = 3;
        double threshold = 4;
      }

      message GetProfileScoreRequest {
        string student_id = 1;
      }

      message AddSkillRequest {
        string student_id = 1;
        SkillCreate skill = 2;
      }

      message RemoveSkillRequest {
        string student_id = 1;
        string skill_id = 2;
      }

      message AddEducationRequest {
        string student_id = 1;
        EducationCreate education = 2;
      }

      message RemoveEducationRequest {
        string student_id = 1;
        string education_id = 2;
      }

      message AddExperienceRequest {
        string student_id = 1;
        ExperienceCreate experience = 2;
      }

      message RemoveExperienceRequest {
        string student_id = 1;
        string experience_id = 2;
      }

      // Response messages
      message StudentResponse {
        Student student = 1;
      }

      message VectorResponse {
        ProfileVector vector = 1;
      }

      message SearchSimilarResponse {
        repeated VectorSearchResult results = 1;
      }

      message ProfileScoreResponse {
        ProfileScore score = 1;
      }

      message SkillResponse {
        Skill skill = 1;
      }

      message EducationResponse {
        Education education = 1;
      }

      message ExperienceResponse {
        Experience experience = 1;
      }

      // Data models
      message Student {
        string id = 1;
        string user_id = 2;
        string first_name = 3;
        string last_name = 4;
        string email = 5;
        string phone = 6;
        google.protobuf.Timestamp date_of_birth = 7;
        string gender = 8;
        string nationality = 9;
        string address = 10;
        string city = 11;
        string state = 12;
        string country = 13;
        string postal_code = 14;
        string profile_picture_url = 15;
        string bio = 16;
        string linkedin_url = 17;
        string github_url = 18;
        string website_url = 19;
        bool is_active = 20;
        double profile_complete = 21;
        google.protobuf.Timestamp created_at = 22;
        google.protobuf.Timestamp updated_at = 23;
        google.protobuf.Timestamp deleted_at = 24;
      }

      message StudentUpdate {
        optional string first_name = 1;
        optional string last_name = 2;
        optional string email = 3;
        optional string phone = 4;
        google.protobuf.Timestamp date_of_birth = 5;
        optional string gender = 6;
        optional string nationality = 7;
        optional string address = 8;
        optional string city = 9;
        optional string state = 10;
        optional string country = 11;
        optional string postal_code = 12;
        optional string profile_picture_url = 13;
        optional string bio = 14;
        optional string linkedin_url = 15;
        optional string github_url = 16;
        optional string website_url = 17;
        optional bool is_active = 18;
      }

      message ProfileVector {
        string id = 1;
        string student_id = 2;
        repeated float vector = 3;
        VectorType vector_type = 4;
        Metadata metadata = 5;
        google.protobuf.Timestamp created_at = 6;
        google.protobuf.Timestamp updated_at = 7;
      }

      message Metadata {
        string model_version = 1;
        string text_source = 2;
        int32 text_length = 3;
        double confidence = 4;
        map<string, string> tags = 5;
      }

      message VectorSearchResult {
        string student_id = 1;
        double similarity = 2;
        Student student = 3;
      }

      message ProfileScore {
        string student_id = 1;
        double total_score = 2;
        double max_score = 3;
        double percentage = 4;
        ScoreBreakdown breakdown = 5;
        google.protobuf.Timestamp last_calculated = 6;
      }

      message ScoreBreakdown {
        double basic_info = 1;
        double contact_info = 2;
        double education = 3;
        double experience = 4;
        double skills = 5;
        double bio = 6;
        double links = 7;
        double profile_picture = 8;
      }

      message Skill {
        string id = 1;
        string student_id = 2;
        string name = 3;
        int32 proficiency = 4;
        string category = 5;
        google.protobuf.Timestamp created_at = 6;
        google.protobuf.Timestamp updated_at = 7;
      }

      message SkillCreate {
        string name = 1;
        int32 proficiency = 2;
        string category = 3;
      }

      message Education {
        string id = 1;
        string student_id = 2;
        string institution = 3;
        string degree = 4;
        string field_of_study = 5;
        google.protobuf.Timestamp

---

**Token Usage:** {'prompt_tokens': 690, 'completion_tokens': 8192, 'total_tokens': 8882}
