package repository

import (
	"context"

	"github.com/glohib.ai/internship/internal/db"
	"github.com/glohib.ai/internship/internal/models"
	"github.com/google/uuid"
)

type InternshipRepository interface {
	Create(ctx context.Context, internship *models.Internship) (*models.Internship, error)
	GetByID(ctx context.Context, id string) (*models.Internship, error)
	Update(ctx context.Context, internship *models.Internship) (*models.Internship, error)
	Delete(ctx context.Context, id string) error
	List(ctx context.Context, limit, offset int) ([]*models.Internship, error)
	Search(ctx context.Context, filter *models.SearchFilter) ([]*models.Internship, error)
	VectorSearch(ctx context.Context, vector []float32, limit int) ([]*models.Internship, error)
	CreateApplication(ctx context.Context, application *models.Application) (*models.Application, error)
	GetApplication(ctx context.Context, id string) (*models.Application, error)
	UpdateApplication(ctx context.Context, application *models.Application) (*models.Application, error)
	ListApplications(ctx context.Context, internshipID string) ([]*models.Application, error)
	ListStudentApplications(ctx context.Context, studentID string) ([]*models.Application, error)
}

type internshipRepository struct {
	db *db.DB
}

func NewInternshipRepository(db *db.DB) InternshipRepository {
	return &internshipRepository{db: db}
}

func (r *internshipRepository) Create(ctx context.Context, internship *models.Internship) (*models.Internship, error) {
	query := `
		INSERT INTO internships (employer_id, title, description, location, remote, paid, duration, skills, tags, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
		RETURNING id, created_at, updated_at`

	err := r.db.QueryRow(ctx, query,
		internship.EmployerID, internship.Title, internship.Description,
		internship.Location, internship.Remote, internship.Paid, internship.Duration,
		internship.Skills, internship.Tags,
	).Scan(&internship.ID, &internship.CreatedAt, &internship.UpdatedAt)

	if err != nil {
		return nil, err
	}

	return internship, nil
}

func (r *internshipRepository) GetByID(ctx context.Context, id string) (*models.Internship, error) {
	query := `
		SELECT id, employer_id, title, description, location, remote, paid, duration, skills, tags, vector, created_at, updated_at
		FROM internships WHERE id = $1 AND active = true`

	internship := &models.Internship{}
	err := r.db.QueryRow(ctx, query, id).Scan(
		&internship.ID, &internship.EmployerID, &internship.Title, &internship.Description,
		&internship.Location, &internship.Remote, &internship.Paid, &internship.Duration,
		&internship.Skills, &internship.Tags, &internship.Vector, &internship.CreatedAt, &internship.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	return internship, nil
}

func (r *internshipRepository) Update(ctx context.Context, internship *models.Internship) (*models.Internship, error) {
	query := `
		UPDATE internships SET
			title = $1, description = $2, location = $3, remote = $4, paid = $5,
			duration = $6, skills = $7, tags = $8, updated_at = NOW()
		WHERE id = $9 AND active = true
		RETURNING id, created_at, updated_at`

	err := r.db.QueryRow(ctx, query,
		internship.Title, internship.Description, internship.Location,
		internship.Remote, internship.Paid, internship.Duration,
		internship.Skills, internship.Tags, internship.ID,
	).Scan(&internship.ID, &internship.CreatedAt, &internship.UpdatedAt)

	if err != nil {
		return nil, err
	}

	return internship, nil
}

func (r *internshipRepository) Delete(ctx context.Context, id string) error {
	query := `UPDATE internships SET active = false WHERE id = $1`
	_, err := r.db.Exec(ctx, query, id)
	return err
}

func (r *internshipRepository) List(ctx context.Context, limit, offset int) ([]*models.Internship, error) {
	query := `
		SELECT id, employer_id, title, description, location, remote, paid, duration, skills, tags, vector, created_at, updated_at
		FROM internships WHERE active = true
		ORDER BY created_at DESC LIMIT $1 OFFSET $2`

	rows, err := r.db.Query(ctx, query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var internships []*models.Internship
	for rows.Next() {
		i := &models.Internship{}
		err := rows.Scan(
			&i.ID, &i.EmployerID, &i.Title, &i.Description, &i.Location,
			&i.Remote, &i.Paid, &i.Duration, &i.Skills, &i.Tags,
			&i.Vector, &i.CreatedAt, &i.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		internships = append(internships, i)
	}

	return internships, nil
}

func (r *internshipRepository) Search(ctx context.Context, filter *models.SearchFilter) ([]*models.Internship, error) {
	query := `
		SELECT id, employer_id, title, description, location, remote, paid, duration, skills, tags, vector, created_at, updated_at
		FROM internships WHERE active = true`

	args := []interface{}{}
	argIndex := 1

	if filter.Query != "" {
		query += ` AND (title ILIKE $` + string(rune(argIndex)) + ` OR description ILIKE $` + string(rune(argIndex)) + `)`
		args = append(args, "%"+filter.Query+"%")
		argIndex++
	}

	if filter.Location != "" {
		query += ` AND location ILIKE $` + string(rune(argIndex))
		args = append(args, "%"+filter.Location+"%")
		argIndex++
	}

	if filter.Remote != nil {
		query += ` AND remote = $` + string(rune(argIndex))
		args = append(args, *filter.Remote)
		argIndex++
	}

	if filter.Paid != nil {
		query += ` AND paid = $` + string(rune(argIndex))
		args = append(args, *filter.Paid)
		argIndex++
	}

	query += ` ORDER BY created_at DESC LIMIT $` + string(rune(argIndex))
	args = append(args, filter.Limit)

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var internships []*models.Internship
	for rows.Next() {
		i := &models.Internship{}
		err := rows.Scan(
			&i.ID, &i.EmployerID, &i.Title, &i.Description, &i.Location,
			&i.Remote, &i.Paid, &i.Duration, &i.Skills, &i.Tags,
			&i.Vector, &i.CreatedAt, &i.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		internships = append(internships, i)
	}

	return internships, nil
}

func (r *internshipRepository) VectorSearch(ctx context.Context, vector []float32, limit int) ([]*models.Internship, error) {
	query := `
		SELECT id, employer_id, title, description, location, remote, paid, duration, skills, tags, vector, created_at, updated_at
		FROM internships
		WHERE active = true
		ORDER BY vector <-> $1
		LIMIT $2`

	rows, err := r.db.Query(ctx, query, vector, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var internships []*models.Internship
	for rows.Next() {
		i := &models.Internship{}
		err := rows.Scan(
			&i.ID, &i.EmployerID, &i.Title, &i.Description, &i.Location,
			&i.Remote, &i.Paid, &i.Duration, &i.Skills, &i.Tags,
			&i.Vector, &i.CreatedAt, &i.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		internships = append(internships, i)
	}

	return internships, nil
}

func (r *internshipRepository) CreateApplication(ctx context.Context, application *models.Application) (*models.Application, error) {
	query := `
		INSERT INTO applications (internship_id, student_id, status, applied_at)
		VALUES ($1, $2, $3, NOW())
		RETURNING id, applied_at`

	err := r.db.QueryRow(ctx, query,
		application.InternshipID, application.StudentID, application.Status,
	).Scan(&application.ID, &application.AppliedAt)

	if err != nil {
		return nil, err
	}

	return application, nil
}

func (r *internshipRepository) GetApplication(ctx context.Context, id string) (*models.Application, error) {
	query := `
		SELECT id, internship_id, student_id, status, applied_at
		FROM applications WHERE id = $1`

	application := &models.Application{}
	err := r.db.QueryRow(ctx, query, id).Scan(
		&application.ID, &application.InternshipID, &application.StudentID,
		&application.Status, &application.AppliedAt,
	)
	if err != nil {
		return nil, err
	}

	return application, nil
}

func (r *internshipRepository) UpdateApplication(ctx context.Context, application *models.Application) (*models.Application, error) {
	query := `
		UPDATE applications SET status = $1 WHERE id = $2
		RETURNING id, applied_at`

	err := r.db.QueryRow(ctx, query, application.Status, application.ID).Scan(
		&application.ID, &application.AppliedAt,
	)
	if err != nil {
		return nil, err
	}

	return application, nil
}

func (r *internshipRepository) ListApplications(ctx context.Context, internshipID string) ([]*models.Application, error) {
	query := `
		SELECT id, internship_id, student_id, status, applied_at
		FROM applications WHERE internship_id = $1
		ORDER BY applied_at DESC`

	rows, err := r.db.Query(ctx, query, internshipID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var applications []*models.Application
	for rows.Next() {
		a := &models.Application{}
		err := rows.Scan(&a.ID, &a.InternshipID, &a.StudentID, &a.Status, &a.AppliedAt)
		if err != nil {
			return nil, err
		}
		applications = append(applications, a)
	}

	return applications, nil
}

func (r *internshipRepository) ListStudentApplications(ctx context.Context, studentID string) ([]*models.Application, error) {
	query := `
		SELECT id, internship_id, student_id, status, applied_at
		FROM applications WHERE student_id = $1
		ORDER BY applied_at DESC`

	rows, err := r.db.Query(ctx, query, studentID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var applications []*models.Application
	for rows.Next() {
		a := &models.Application{}
		err := rows.Scan(&a.ID, &a.InternshipID, &a.StudentID, &a.Status, &a.AppliedAt)
		if err != nil {
			return nil, err
		}
		applications = append(applications, a)
	}

	return applications, nil
}
