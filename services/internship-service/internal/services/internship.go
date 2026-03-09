package services

import (
	"context"
	"errors"

	"github.com/glohib.ai/internship/internal/models"
	"github.com/glohib.ai/internship/internal/repository"
)

var (
	ErrInternshipNotFound = errors.New("internship not found")
	ErrApplicationNotFound = errors.New("application not found")
)

type InternshipService interface {
	CreateInternship(ctx context.Context, internship *models.Internship) (*models.Internship, error)
	GetInternship(ctx context.Context, id string) (*models.Internship, error)
	UpdateInternship(ctx context.Context, internship *models.Internship) (*models.Internship, error)
	DeleteInternship(ctx context.Context, id string) error
	ListInternships(ctx context.Context, limit, offset int) ([]*models.Internship, error)
	SearchInternships(ctx context.Context, filter *models.SearchFilter) ([]*models.Internship, error)
	VectorSearch(ctx context.Context, vector []float32, limit int) ([]*models.Internship, error)
	CreateApplication(ctx context.Context, application *models.Application) (*models.Application, error)
	GetApplication(ctx context.Context, id string) (*models.Application, error)
	UpdateApplication(ctx context.Context, application *models.Application) (*models.Application, error)
	ListInternshipApplications(ctx context.Context, internshipID string) ([]*models.Application, error)
	ListStudentApplications(ctx context.Context, studentID string) ([]*models.Application, error)
}

type internshipService struct {
	repo repository.InternshipRepository
}

func NewInternshipService(repo repository.InternshipRepository) InternshipService {
	return &internshipService{repo: repo}
}

func (s *internshipService) CreateInternship(ctx context.Context, internship *models.Internship) (*models.Internship, error) {
	return s.repo.Create(ctx, internship)
}

func (s *internshipService) GetInternship(ctx context.Context, id string) (*models.Internship, error) {
	internship, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, ErrInternshipNotFound
	}
	return internship, nil
}

func (s *internshipService) UpdateInternship(ctx context.Context, internship *models.Internship) (*models.Internship, error) {
	if _, err := s.repo.GetByID(ctx, internship.ID); err != nil {
		return nil, ErrInternshipNotFound
	}
	return s.repo.Update(ctx, internship)
}

func (s *internshipService) DeleteInternship(ctx context.Context, id string) error {
	if _, err := s.repo.GetByID(ctx, id); err != nil {
		return ErrInternshipNotFound
	}
	return s.repo.Delete(ctx, id)
}

func (s *internshipService) ListInternships(ctx context.Context, limit, offset int) ([]*models.Internship, error) {
	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}
	return s.repo.List(ctx, limit, offset)
}

func (s *internshipService) SearchInternships(ctx context.Context, filter *models.SearchFilter) ([]*models.Internship, error) {
	if filter.Limit <= 0 {
		filter.Limit = 20
	}
	if filter.Limit > 100 {
		filter.Limit = 100
	}
	return s.repo.Search(ctx, filter)
}

func (s *internshipService) VectorSearch(ctx context.Context, vector []float32, limit int) ([]*models.Internship, error) {
	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}
	return s.repo.VectorSearch(ctx, vector, limit)
}

func (s *internshipService) CreateApplication(ctx context.Context, application *models.Application) (*models.Application, error) {
	return s.repo.CreateApplication(ctx, application)
}

func (s *internshipService) GetApplication(ctx context.Context, id string) (*models.Application, error) {
	app, err := s.repo.GetApplication(ctx, id)
	if err != nil {
		return nil, ErrApplicationNotFound
	}
	return app, nil
}

func (s *internshipService) UpdateApplication(ctx context.Context, application *models.Application) (*models.Application, error) {
	if _, err := s.repo.GetApplication(ctx, application.ID); err != nil {
		return nil, ErrApplicationNotFound
	}
	return s.repo.UpdateApplication(ctx, application)
}

func (s *internshipService) ListInternshipApplications(ctx context.Context, internshipID string) ([]*models.Application, error) {
	return s.repo.ListApplications(ctx, internshipID)
}

func (s *internshipService) ListStudentApplications(ctx context.Context, studentID string) ([]*models.Application, error) {
	return s.repo.ListStudentApplications(ctx, studentID)
}
