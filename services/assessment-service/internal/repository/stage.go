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
	q := `SELECT id,assessment_id,name,status,score,pass,feedback,answers,started_at,submitted_at,expires_at,created_at FROM stages WHERE assessment_id=$1 AND name=$2`
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
