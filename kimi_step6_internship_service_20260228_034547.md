# GLOHIB.AI - STEP 6: INTERNSHIP SERVICE (GO)
**Generated:** 2026-02-28 03:45:47

---

```yaml
id: step-06-internship-service
name: "Step 6 – Internship Service (Go)"
phase: build
priority: 6
estimate: 4h
context: |
  Build the Internship micro-service for Glohib.ai.
  Provides: posting CRUD, 512-dim embeddings, employer linkage,
  search/filtering, application management, analytics.
  Tech: Go 1.22, Gin, gRPC, pgx+pgvector, Redis, sentence-transformers.

tasks:
  # ---------- module skeleton ----------
  - id: 06-01
    action: shell_command
    description: "create internship service folder"
    command: mkdir -p /workspace/glohib.ai/services/internship/{cmd,internal/{handlers,models,repositories,services,middleware},pkg/{proto,utils},scripts,tests}

  - id: 06-02
    action: create_file
    file: /workspace/glohib.ai/services/internship/go.mod
    content: |
      module github.com/glohib.ai/internship

      go 1.22

      require (
      	github.com/gin-gonic/gin v1.9.1
      	github.com/jackc/pgx/v5 v5.5.1
      	github.com/redis/go-redis/v9 v9.3.1
      	google.golang.org/grpc v1.60.1
      	google.golang.org/protobuf v1.32.0
      	github.com/golang/protobuf v1.5.3
      	github.com/joho/godotenv v1.5.1
      	github.com/google/uuid v1.5.0
      	github.com/lib/pq v1.10.9
      )

  # ---------- proto ----------
  - id: 06-03
    action: create_file
    file: /workspace/glohib.ai/services/internship/pkg/proto/internship.proto
    content: |
      syntax = "proto3";
      package internship;
      option go_package = "github.com/glohib.ai/internship/pkg/proto";

      service InternshipService {
        rpc CreateInternship(CreateInternshipRequest) returns (Internship);
        rpc GetInternship(GetInternshipRequest) returns (Internship);
        rpc UpdateInternship(UpdateInternshipRequest) returns (Internship);
        rpc DeleteInternship(DeleteInternshipRequest) returns (DeleteInternshipResponse);
        rpc ListInternships(ListInternshipsRequest) returns (ListInternshipsResponse);
        rpc SearchInternships(SearchInternshipsRequest) returns (SearchInternshipsResponse);
        rpc RecommendInternships(RecommendInternshipsRequest) returns (SearchInternshipsResponse);
        rpc CreateApplication(CreateApplicationRequest) returns (Application);
        rpc ListApplications(ListApplicationsRequest) returns (ListApplicationsResponse);
        rpc GenerateVector(GenerateVectorRequest) returns (GenerateVectorResponse);
      }

      message Internship {
        string id = 1;
        string employer_id = 2;
        string title = 3;
        string description = 4;
        string location = 5;
        bool remote = 6;
        bool paid = 7;
        string duration = 8;
        repeated string skills = 9;
        repeated string tags = 10;
        int64 created_at = 11;
        int64 updated_at = 12;
        repeated float vector = 13;
      }

      message Application {
        string id = 1;
        string internship_id = 2;
        string student_id = 3;
        string status = 4;
        int64 applied_at = 5;
      }

      message CreateInternshipRequest {
        string employer_id = 1;
        string title = 2;
        string description = 3;
        string location = 4;
        bool remote = 5;
        bool paid = 6;
        string duration = 7;
        repeated string skills = 8;
        repeated string tags = 9;
      }

      message GetInternshipRequest   { string id = 1; }
      message UpdateInternshipRequest {
        string id = 1;
        string employer_id = 2;
        string title = 3;
        string description = 4;
        string location = 5;
        bool remote = 6;
        bool paid = 7;
        string duration = 8;
        repeated string skills = 9;
        repeated string tags = 10;
      }
      message DeleteInternshipRequest { string id = 1; string employer_id = 2; }
      message DeleteInternshipResponse {}

      message ListInternshipsRequest {
        int32 limit  = 1;
        int32 offset = 2;
      }
      message ListInternshipsResponse { repeated Internship items = 1; }

      message SearchInternshipsRequest {
        string query = 1;
        repeated string skills = 2;
        repeated string tags = 3;
        bool remote = 4;
        bool paid = 5;
        string location = 6;
        int32 limit = 7;
      }
      message SearchInternshipsResponse { repeated Internship items = 1; }

      message RecommendInternshipsRequest {
        string student_id = 1;
        int32 limit = 2;
      }

      message CreateApplicationRequest {
        string internship_id = 1;
        string student_id = 2;
      }
      message ListApplicationsRequest  { string internship_id = 1; }
      message ListApplicationsResponse { repeated Application items = 1; }

      message GenerateVectorRequest { string internship_id = 1; }
      message GenerateVectorResponse {}

  # ---------- models ----------
  - id: 06-04
    action: create_file
    file: /workspace/glohib.ai/services/internship/internal/models/internship.go
    content: |
      package models

      import (
      	"time"
      	"github.com/google/uuid"
      )

      type Internship struct {
      	ID          string    `json:"id" db:"id"`
      	EmployerID  string    `json:"employer_id" db:"employer_id"`
      	Title       string    `json:"title" db:"title"`
      	Description string    `json:"description" db:"description"`
      	Location    string    `json:"location" db:"location"`
      	Remote      bool      `json:"remote" db:"remote"`
      	Paid        bool      `json:"paid" db:"paid"`
      	Duration    string    `json:"duration" db:"duration"`
      	Skills      []string  `json:"skills" db:"skills"`
      	Tags        []string  `json:"tags" db:"tags"`
      	Vector      []float32 `json:"vector,omitempty" db:"vector"`
      	CreatedAt   time.Time `json:"created_at" db:"created_at"`
      	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
      }

      func NewInternship(employerID, title, description, location, duration string, remote, paid bool, skills, tags []string) *Internship {
      	return &Internship{
      		ID:          uuid.NewString(),
      		EmployerID:  employerID,
      		Title:       title,
      		Description: description,
      		Location:    location,
      		Remote:      remote,
      		Paid:        paid,
      		Duration:    duration,
      		Skills:      skills,
      		Tags:        tags,
      		CreatedAt:   time.Now(),
      		UpdatedAt:   time.Now(),
      	}
      }

      type Application struct {
      	ID           string    `json:"id" db:"id"`
      	InternshipID string    `json:"internship_id" db:"internship_id"`
      	StudentID    string    `json:"student_id" db:"student_id"`
      	Status       string    `json:"status" db:"status"` // pending, accepted, rejected
      	AppliedAt    time.Time `json:"applied_at" db:"applied_at"`
      }

      func NewApplication(internshipID, studentID string) *Application {
      	return &Application{
      		ID:           uuid.NewString(),
      		InternshipID: internshipID,
      		StudentID:    studentID,
      		Status:       "pending",
      		AppliedAt:    time.Now(),
      	}
      }

  - id: 06-05
    action: create_file
    file: /workspace/glohib.ai/services/internship/internal/models/search.go
    content: |
      package models

      type SearchFilter struct {
      	Query    string   `json:"query"`
      	Skills   []string `json:"skills"`
      	Tags     []string `json:"tags"`
      	Location string   `json:"location"`
      	Remote   *bool    `json:"remote,omitempty"`
      	Paid     *bool    `json:"paid,omitempty"`
      	Limit    int32    `json:"limit"`
      }

      type VectorSearchRequest struct {
      	Vector []float32 `json:"vector"`
      	Limit  int32     `json:"limit"`
      }

  # ---------- repositories ----------
  - id: 06-06
    action: create_file
    file: /workspace/glohib.ai/services/internship/internal/repositories/internship.go
    content: |
      package repositories

      import (
      	"context"
      	"database/sql"
      	"fmt"
      	"github.com/glohib.ai/internship/internal/models"
      	"github.com/jackc/pgx/v5/pgxpool"
      	"github.com/lib/pq"
      )

      type InternshipRepo struct {
      	db *pgxpool.Pool
      }

      func NewInternshipRepo(db *pgxpool.Pool) *InternshipRepo { return &InternshipRepo{db: db} }

      func (r *InternshipRepo) Create(ctx context.Context, in *models.Internship) error {
      	_, err := r.db.Exec(ctx, `
      		INSERT INTO internships(id,employer_id,title,description,location,remote,paid,duration,skills,tags,vector,created_at,updated_at)
      		VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      	`, in.ID, in.EmployerID, in.Title, in.Description, in.Location, in.Remote, in.Paid, in.Duration,
      		pq.Array(in.Skills), pq.Array(in.Tags), pq.Array(in.Vector), in.CreatedAt, in.UpdatedAt)
      	return err
      }

      func (r *InternshipRepo) Get(ctx context.Context, id string) (*models.Internship, error) {
      	var in models.Internship
      	err := r.db.QueryRow(ctx, `
      		SELECT id,employer_id,title,description,location,remote,paid,duration,skills,tags,vector,created_at,updated_at
      		FROM internships WHERE id=$1
      	`, id).Scan(&in.ID, &in.EmployerID, &in.Title, &in.Description, &in.Location, &in.Remote, &in.Paid,
      		&in.Duration, pq.Array(&in.Skills), pq.Array(&in.Tags), pq.Array(&in.Vector), &in.CreatedAt, &in.UpdatedAt)
      	if err == sql.ErrNoRows {
      		return nil, nil
      	}
      	return &in, err
      }

      func (r *InternshipRepo) Update(ctx context.Context, in *models.Internship) error {
      	_, err := r.db.Exec(ctx, `
      		UPDATE internships
      		SET title=$1,description=$2,location=$3,remote=$4,paid=$5,duration=$6,skills=$7,tags=$8,vector=$9,updated_at=$10
      		WHERE id=$11 AND employer_id=$12
      	`, in.Title, in.Description, in.Location, in.Remote, in.Paid, in.Duration,
      		pq.Array(in.Skills), pq.Array(in.Tags), pq.Array(in.Vector), in.UpdatedAt, in.ID, in.EmployerID)
      	return err
      }

      func (r *InternshipRepo) Delete(ctx context.Context, id, employerID string) error {
      	_, err := r.db.Exec(ctx, `DELETE FROM internships WHERE id=$1 AND employer_id=$2`, id, employerID)
      	return err
      }

      func (r *InternshipRepo) List(ctx context.Context, limit, offset int32) ([]*models.Internship, error) {
      	rows, err := r.db.Query(ctx, `
      		SELECT id,employer_id,title,description,location,remote,paid,duration,skills,tags,vector,created_at,updated_at
      		FROM internships ORDER BY created_at DESC LIMIT $1 OFFSET $2
      	`, limit, offset)
      	if err != nil {
      		return nil, err
      	}
      	defer rows.Close()
      	var out []*models.Internship
      	for rows.Next() {
      		var in models.Internship
      		if err := rows.Scan(&in.ID, &in.EmployerID, &in.Title, &in.Description, &in.Location, &in.Remote, &in.Paid,
      			&in.Duration, pq.Array(&in.Skills), pq.Array(&in.Tags), pq.Array(&in.Vector), &in.CreatedAt, &in.UpdatedAt); err != nil {
      			return nil, err
      		}
      		out = append(out, &in)
      	}
      	return out, rows.Err()
      }

      func (r *InternshipRepo) Search(ctx context.Context, f models.SearchFilter) ([]*models.Internship, error) {
      	q := `
      		SELECT id,employer_id,title,description,location,remote,paid,duration,skills,tags,vector,created_at,updated_at
      		FROM internships
      		WHERE 1=1
      	`
      	args := []interface{}{}
      	argn := 1
      	if f.Query != "" {
      		q += fmt.Sprintf(" AND (title ILIKE '%%'||$%d||'%%' OR description ILIKE '%%'||$%d||'%%')", argn, argn)
      		args = append(args, f.Query)
      		argn++
      	}
      	if len(f.Skills) > 0 {
      		q += fmt.Sprintf(" AND skills && $%d", argn)
      		args = append(args, pq.Array(f.Skills))
      		argn++
      	}
      	if len(f.Tags) > 0 {
      		q += fmt.Sprintf(" AND tags && $%d", argn)
      		args = append(args, pq.Array(f.Tags))
      		argn++
      	}
      	if f.Remote != nil {
      		q += fmt.Sprintf(" AND remote=$%d", argn)
      		args = append(args, *f.Remote)
      		argn++
      	}
      	if f.Paid != nil {
      		q += fmt.Sprintf(" AND paid=$%d", argn)
      		args = append(args, *f.Paid)
      		argn++
      	}
      	if f.Location != "" {
      		q += fmt.Sprintf(" AND location ILIKE '%%'||$%d||'%%'", argn)
      		args = append(args, f.Location)
      		argn++
      	}
      	q += " ORDER BY created_at DESC"
      	if f.Limit > 0 {
      		q += fmt.Sprintf(" LIMIT $%d", argn)
      		args = append(args, f.Limit)
      	}
      	rows, err := r.db.Query(ctx, q, args...)
      	if err != nil {
      		return nil, err
      	}
      	defer rows.Close()
      	var out []*models.Internship
      	for rows.Next() {
      		var in models.Internship
      		if err := rows.Scan(&in.ID, &in.EmployerID, &in.Title, &in.Description, &in.Location, &in.Remote, &in.Paid,
      			&in.Duration, pq.Array(&in.Skills), pq.Array(&in.Tags), pq.Array(&in.Vector), &in.CreatedAt, &in.UpdatedAt); err != nil {
      			return nil, err
      		}
      		out = append(out, &in)
      	}
      	return out, rows.Err()
      }

      func (r *InternshipRepo) VectorSearch(ctx context.Context, vec []float32, limit int32) ([]*models.Internship, error) {
      	rows, err := r.db.Query(ctx, `
      		SELECT id,employer_id,title,description,location,remote,paid,duration,skills,tags,vector,created_at,updated_at
      		FROM internships ORDER BY vector <=> $1 LIMIT $2
      	`, pq.Array(vec), limit)
      	if err != nil {
      		return nil, err
      	}
      	defer rows.Close()
      	var out []*models.Internship
      	for rows.Next() {
      		var in models.Internship
      		if err := rows.Scan(&in.ID, &in.EmployerID, &in.Title, &in.Description, &in.Location, &in.Remote, &in.Paid,
      			&in.Duration, pq.Array(&in.Skills), pq.Array(&in.Tags), pq.Array(&in.Vector), &in.CreatedAt, &in.UpdatedAt); err != nil {
      			return nil, err
      		}
      		out = append(out, &in)
      	}
      	return out, rows.Err()
      }

      func (r *InternshipRepo) SetVector(ctx context.Context, id string, vec []float32) error {
      	_, err := r.db.Exec(ctx, `UPDATE internships SET vector=$1 WHERE id=$2`, pq.Array(vec), id)
      	return err
      }

  - id: 06-07
    action: create_file
    file: /workspace/glohib.ai/services/internship/internal/repositories/application.go
    content: |
      package repositories

      import (
      	"context"
      	"database/sql"
      	"github.com/glohib.ai/internship/internal/models"
      	"github.com/jackc/pgx/v5/pgxpool"
      )

      type ApplicationRepo struct{ db *pgxpool.Pool }

      func NewApplicationRepo(db *pgxpool.Pool) *ApplicationRepo { return &ApplicationRepo{db: db} }

      func (r *ApplicationRepo) Create(ctx context.Context, app *models.Application) error {
      	_, err := r.db.Exec(ctx, `
      		INSERT INTO applications(id,internship_id,student_id,status,applied_at) VALUES($1,$2,$3,$4,$5)
      	`, app.ID, app.InternshipID, app.StudentID, app.Status, app.AppliedAt)
      	return err
      }

      func (r *ApplicationRepo) GetByInternship(ctx context.Context, internshipID string) ([]*models.Application, error) {
      	rows, err := r.db.Query(ctx, `
      		SELECT id,internship_id,student_id,status,applied_at FROM applications WHERE internship_id=$1
      	`, internshipID)
      	if err != nil {
      		return nil, err
      	}
      	defer rows.Close()
      	var out []*models.Application
      	for rows.Next() {
      		var a models.Application
      		if err := rows.Scan(&a.ID, &a.InternshipID, &a.StudentID, &a.Status, &a.AppliedAt); err != nil {
      			return nil, err
      		}
      		out = append(out, &a)
      	}
      	return out, rows.Err()
      }

      func (r *ApplicationRepo) GetByStudentAndInternship(ctx context.Context, studentID, internshipID string) (*models.Application, error) {
      	var a models.Application
      	err := r.db.QueryRow(ctx, `
      		SELECT id,internship_id,student_id,status,applied_at FROM applications WHERE student_id=$1 AND internship_id=$2
      	`, studentID, internshipID).Scan(&a.ID, &a.InternshipID, &a.StudentID, &a.Status, &a.AppliedAt)
      	if err == sql.ErrNoRows {
      		return nil, nil
      	}
      	return &a, err
      }

  # ---------- services ----------
  - id: 06-08
    action: create_file
    file: /workspace/glohib.ai/services/internship/internal/services/embedding.go
    content: |
      package services

      import (
      	"bytes"
      	"context"
      	"encoding/json"
      	"fmt"
      	"net/http"
      	"time"
      )

      type EmbeddingService struct {
      	url    string
      	client *http.Client
      }

      func NewEmbeddingService(url string) *EmbeddingService {
      	return &EmbeddingService{
      		url:    url,
      		client: &http.Client{Timeout: 10 * time.Second},
      	}
      }

      func (s *EmbeddingService) Generate(ctx context.Context, text string) ([]float32, error) {
      	body, _ := json.Marshal(map[string]string{"text": text})
      	req, _ := http.NewRequestWithContext(ctx, "POST", s.url+"/encode", bytes.NewReader(body))
      	req.Header.Set("Content-Type", "application/json")
      	resp, err := s.client.Do(req)
      	if err != nil {
      		return nil, err
      	}
      	defer resp.Body.Close()
      	if resp.StatusCode != http.StatusOK {
      		return nil, fmt.Errorf("embedding service returned %d", resp.StatusCode)
      	}
      	var vec []float32
      	if err := json.NewDecoder(resp.Body).Decode(&vec); err != nil {
      		return nil, err
      	}
      	return vec, nil
      }

  - id: 06-09
    action: create_file
    file: /workspace/glohib.ai/services/internship/internal/services/cache.go
    content: |
      package services

      import (
      	"context"
      	"encoding/json"
      	"time"
      	"github.com/redis/go-redis/v9"
      )

      type CacheService struct{ rdb *redis.Client }

      func NewCacheService(rdb *redis.Client) *CacheService { return &CacheService{rdb: rdb} }

      func (c *CacheService) Get(ctx context.Context, key string, dest interface{}) bool {
      	val, err := c.rdb.Get(ctx, key).Result()
      	if err != nil {
      		return false
      	}
      	json.Unmarshal([]byte(val), dest)
      	return true
      }

      func (c *CacheService) Set(ctx context.Context, key string, val interface{}, ttl time.Duration) error {
      	b, _ := json.Marshal(val)
      	return c.rdb.Set(ctx, key, b, ttl).Err()
      }

      func (c *CacheService) Del(ctx context.Context, keys ...string) error {
      	return c.rdb.Del(ctx, keys...).Err()
      }

  # ---------- handlers ----------
  - id: 06-10
    action: create_file
    file: /workspace/glohib.ai/services/internship/internal/handlers/internship.go
    content: |
      package handlers

      import (
      	"net/http"
      	"github.com/gin-gonic/gin"
      	"github.com/glohib.ai/internship/internal/models"
      	"github.com/glohib.ai/internship/internal/repositories"
      	"github.com/glohib.ai/internship/internal/services"
      )

      type InternshipHandler struct {
      	repo    *repositories.InternshipRepo
      	cache   *services.CacheService
      	embedSvc *services.EmbeddingService
      }

      func NewInternshipHandler(repo *repositories.InternshipRepo, cache *services.CacheService, embedSvc *services.EmbeddingService) *InternshipHandler {
      	return &InternshipHandler{repo: repo, cache: cache, embedSvc: embedSvc}
      }

      func (h *InternshipHandler) Create(c *gin.Context) {
      	employerID := c.GetString("userID") // set by auth middleware
      	var req models.Internship
      	if err := c.ShouldBindJSON(&req); err != nil {
      		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      		return
      	}
      	in := models.NewInternship(employerID, req.Title, req.Description, req.Location, req.Duration, req.Remote, req.Paid, req.Skills, req.Tags)
      	if err := h.repo.Create(c.Request.Context(), in); err != nil {
      		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
      		return
      	}
      	c.JSON(http.StatusCreated, in)
      }

      func (h *InternshipHandler) Get(c *gin.Context) {
      	id := c.Param("id")
      	var in models.Internship
      	if h.cache.Get(c.Request.Context(), "internship:"+id, &in) {
      		c.JSON(http.StatusOK, in)
      		return
      	}
      	inDB, err := h.repo.Get(c.Request.Context(), id)
      	if err != nil || inDB == nil {
      		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
      		return
      	}
      	_ = h.cache.Set(c.Request.Context(), "internship:"+id, inDB, 0)
      	c.JSON(http.StatusOK, inDB)
      }

      func (h *InternshipHandler) Update(c *gin.Context) {
      	employerID := c.GetString("userID")
      	id := c.Param("id")
      	var req models.Internship
      	if err := c.ShouldBindJSON(&req); err != nil {
      		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      		return
      	}
      	in, err := h.repo.Get(c.Request.Context(), id)
      	if err != nil || in == nil {
      		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
      		return
      	}
      	if in.EmployerID != employerID {
      		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
      		return
      	}
      	in.Title = req.Title
      	in.Description = req.Description
      	in.Location = req.Location
      	in.Remote = req.Remote
      	in.Paid = req.Paid
      	in.Duration = req.Duration
      	in.Skills = req.Skills
      	in.Tags = req.Tags
      	in.UpdatedAt = time.Now()
      	if err := h.repo.Update(c.Request.Context(), in); err != nil {
      		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
      		return
      	}
      	_ = h.cache.Del(c.Request.Context(), "internship:"+id)
      	c.JSON(http.StatusOK, in)
      }

      func (h *InternshipHandler) Delete(c *gin.Context) {
      	employerID := c.GetString("userID")
      	id := c.Param("id")
      	if err := h.repo.Delete(c.Request.Context(), id, employerID); err != nil {
      		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
      		return
      	}
      	_ = h.cache.Del(c.Request.Context(), "internship:"+id)
      	c.JSON(http.StatusNoContent, nil)
      }

      func (h *InternshipHandler) List(c *gin.Context) {
      	limit := int32(20)
      	offset := int32(0)
      	if l, ok := c.GetQuery("limit"); ok {
      		fmt.Sscanf(l, "%d", &limit)
      	}
      	if o, ok := c.GetQuery("offset"); ok {
      		fmt.Sscanf(o, "%d", &offset)
      	}
      	items, err := h.repo.List(c.Request.Context(), limit, offset)
      	if err != nil {
      		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
      		return
      	}
      	c.JSON(http.StatusOK, gin.H{"items": items})
      }

      func (h *InternshipHandler) GenerateVector(c *gin.Context) {
      	id := c.Param("id")
      	in, err := h.repo.Get(c.Request.Context(), id)
      	if err != nil || in == nil {
      		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
      		return
      	}
      	vec, err := h.embedSvc.Generate(c.Request.Context(), in.Title+" "+in.Description)
      	if err != nil {
      		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
      		return
      	}
      	if err := h.repo.SetVector(c.Request.Context(), id, vec); err != nil {
      		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
      		return
      	}
      	c.JSON(http.StatusOK, gin.H{"status": "generated"})
      }

  - id: 06-11
    action: create_file
    file: /workspace/glohib.ai/services/internship/internal/handlers/search.go
    content: |
      package handlers

      import (
      	"net/http"
      	"github.com/gin-gonic/gin"
      	"github.com/glohib.ai/internship/internal/models"
      )

      type SearchHandler struct {
      	repo *repositories.InternshipRepo
      }

      func NewSearchHandler(repo *repositories.InternshipRepo) *SearchHandler { return &SearchHandler{repo: repo} }

      func (h *SearchHandler) Search(c *gin.Context) {
      	var f models.SearchFilter
      	if err := c.ShouldBindJSON(&f); err != nil {
      		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      		return
      	}
      	if f.Limit == 0 {
      		f.Limit = 20
      	}
      	items, err := h.repo.Search(c.Request.Context(), f)
      	if err != nil {
      		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
      		return
      	}
      	c.JSON(http.StatusOK, gin.H{"items": items})
      }

      func (h *SearchHandler) Recommend(c *gin.Context) {
      	studentID := c.Param("studentId")
      	// TODO: fetch student profile vector from profile service
      	// dummy zero vector for now
      	vec := make([]float32, 512)
      	items, err := h.repo.VectorSearch(c.Request.Context(), vec, 10)
      	if err != nil {
      		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
      		return
      	}
      	c.JSON(http.StatusOK, gin.H{"items": items})
      }

  - id: 06-12
    action: create_file
    file: /workspace/glohib.ai/services/internship/internal/handlers/applications.go
    content: |
      package handlers

      import (
      	"net/http"
      	"github.com/gin-gonic/gin"
      	"github.com/glohib.ai/internship/internal/models"
      	"github.com/glohib.ai/internship/internal/repositories"
      )

      type ApplicationHandler struct {
      	repo *repositories.ApplicationRepo
      }

      func NewApplicationHandler(repo *repositories.ApplicationRepo) *ApplicationHandler { return &ApplicationHandler{repo: repo} }

      func (h *ApplicationHandler) Create(c *gin.Context) {
      	studentID := c.GetString("userID")
      	internshipID := c.Param("id")
      	existing, _ := h.repo.GetByStudentAndInternship(c.Request.Context(), studentID, internshipID)
      	if existing != nil {
      		c.JSON(http.StatusConflict, gin.H{"error": "already applied"})
      		return
      	}
      	app := models.NewApplication(internshipID, studentID)
      	if err := h.repo.Create(c.Request.Context(), app); err != nil {
      		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
      		return
      	}
      	c.JSON(http.StatusCreated, app)
      }

      func (h *ApplicationHandler) List(c *gin.Context) {
      	internshipID := c.Param("id")
      	items, err := h.repo.GetByInternship(c.Request.Context(), internshipID)
      	if err != nil {
      		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
      		return
      	}
      	c.JSON(http.StatusOK, gin.H{"items": items})
      }

  # ---------- gRPC adapter ----------
  - id: 06-13
    action: create_file
    file: /workspace/glohib.ai/services/internship/internal/services/grpc_adapter.go
    content: |
      package services

      import (
      	"context"
      	"google.golang.org/grpc/codes"
      	"google.golang.org/grpc/status"
      	pb "github.com/glohib.ai/internship/pkg/proto"
      	"github.com/glohib.ai/internship/internal/models"
      	"github.com/glohib.ai/internship/internal/repositories"
      )

      type GRPCServer struct {
      	pb.UnimplementedInternshipServiceServer
      	internRepo *repositories.InternshipRepo
      	appRepo    *repositories.ApplicationRepo
      	embedSvc   *EmbeddingService
      }

      func NewGRPCServer(ir *repositories.InternshipRepo, ar *repositories.ApplicationRepo, es *EmbeddingService) *GRPCServer {
      	return &GRPCServer{internRepo: ir, appRepo: ar, embedSvc: es}
      }

      func toProto(in *models.Internship) *pb.Internship {
      	return &pb.Internship{
      		Id:          in.ID,
      		EmployerId:  in.EmployerID,
      		Title:       in.Title,
      		Description: in.Description,
      		Location:    in.Location,
      		Remote:      in.Remote,
      		Paid:        in.Paid,
      		Duration:    in.Duration,
      		Skills:      in.Skills,
      		Tags:        in.Tags,
      		Vector:      in.Vector,
      		CreatedAt:   in.CreatedAt.Unix(),
      		UpdatedAt:   in.UpdatedAt.Unix(),
      	}
      }

      func (s *GRPCServer) CreateInternship(ctx context.Context, req *pb.CreateInternshipRequest) (*pb.Internship, error) {
      	in := models.NewInternship(req.EmployerId, req.Title, req.Description, req.Location, req.Duration, req.Remote, req.Paid, req.Skills, req.Tags)
      	if err := s.internRepo.Create(ctx, in); err != nil {
      		return nil, status.Error(codes.Internal, err.Error())
      	}
      	return toProto(in), nil
      }

      func (s *GRPCServer) GetInternship(ctx context.Context, req *pb.GetInternshipRequest) (*pb.Internship, error) {
      	in, err := s.internRepo.Get(ctx, req.Id)
      	if err != nil {
      		return nil, status.Error(codes.Internal, err.Error())
      	}
      	if in == nil {
      		return nil, status.Error(codes.NotFound, "not found")
      	}
      	return toProto(in), nil
      }

      func (s *GRPCServer) UpdateInternship(ctx context.Context, req *pb.UpdateInternshipRequest) (*pb.Internship, error) {
      	in, err := s.internRepo.Get(ctx, req.Id)
      	if err != nil {
      		return nil, status.Error(codes.Internal, err.Error())
      	}
      	if in == nil {
      		return nil, status.Error(codes.NotFound, "not found")
      	}
      	if in.EmployerID != req.EmployerId {
      		return nil, status.Error(codes.PermissionDenied, "forbidden")
      	}
      	in.Title = req.Title
      	in.Description = req.Description
      	in.Location = req.Location
      	in.Remote = req.Remote
      	in.Paid = req.Paid
      	in.Duration = req.Duration
      	in.Skills = req.Skills
      	in.Tags = req.Tags
      	if err := s.internRepo.Update(ctx, in); err != nil {
      		return nil, status.Error(codes.Internal, err.Error())
      	}
      	return toProto(in), nil
      }

      func (s *GRPCServer) DeleteInternship(ctx context.Context, req *pb.DeleteInternshipRequest) (*pb.DeleteInternshipResponse, error) {
      	if err := s.internRepo.Delete(ctx, req.Id, req.EmployerId); err != nil {
      		return nil, status.Error(codes.Internal, err.Error())
      	}
      	return &pb.DeleteInternshipResponse{}, nil
      }

      func (s *GRPCServer) ListInternships(ctx context.Context, req *pb.ListInternshipsRequest) (*pb.ListInternshipsResponse, error) {
      	items, err := s.internRepo.List(ctx, req.Limit, req.Offset)
      	if err != nil {
      		return nil, status.Error(codes.Internal, err.Error())
      	}
      	out := make([]*pb.Internship, len(items))
      	for i, v := range items {
      		out[i] = toProto(v)
      	}
      	return &pb.ListInternshipsResponse{Items: out}, nil
      }

      func (s *GRPCServer) SearchInternships(ctx context.Context, req *pb.SearchInternshipsRequest) (*pb.SearchInternshipsResponse, error) {
      	f := models.SearchFilter{
      		Query:    req.Query,
      		Skills:   req.Skills,
      		Tags:     req.Tags

---

**Token Usage:** {'prompt_tokens': 642, 'completion_tokens': 8192, 'total_tokens': 8834}
