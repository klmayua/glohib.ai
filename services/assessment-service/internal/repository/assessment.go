package repository

import (
	"context"
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
	q := `SELECT id,candidate_id,job_id,state,overall_score,created_at,updated_at,completed_at FROM assessments WHERE id=$1`
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
