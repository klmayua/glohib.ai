package services

import (
	"context"
	"errors"

	"github.com/glohib-ai/student-service/internal/models"
	"github.com/glohib-ai/student-service/internal/repository"
	"github.com/google/uuid"
)

var (
	ErrStudentNotFound = errors.New("student not found")
	ErrStudentExists   = errors.New("student already exists")
)

type StudentService interface {
	Create(ctx context.Context, student *models.StudentCreate) (*models.Student, error)
	GetByID(ctx context.Context, id uuid.UUID) (*models.Student, error)
	GetByEmail(ctx context.Context, email string) (*models.Student, error)
	Update(ctx context.Context, id uuid.UUID, student *models.StudentUpdate) (*models.Student, error)
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, limit, offset int) ([]*models.Student, error)
	AddSkill(ctx context.Context, studentID uuid.UUID, skill *models.SkillCreate) (*models.Skill, error)
	AddEducation(ctx context.Context, studentID uuid.UUID, education *models.EducationCreate) (*models.Education, error)
	AddExperience(ctx context.Context, studentID uuid.UUID, experience *models.ExperienceCreate) (*models.Experience, error)
}

type studentService struct {
	repo repository.StudentRepository
}

func NewStudentService(repo repository.StudentRepository) StudentService {
	return &studentService{repo: repo}
}

func (s *studentService) Create(ctx context.Context, student *models.StudentCreate) (*models.Student, error) {
	existing, err := s.repo.GetByEmail(ctx, student.Email)
	if err == nil && existing != nil {
		return nil, ErrStudentExists
	}

	return s.repo.Create(ctx, student)
}

func (s *studentService) GetByID(ctx context.Context, id uuid.UUID) (*models.Student, error) {
	student, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, ErrStudentNotFound
	}
	return student, nil
}

func (s *studentService) GetByEmail(ctx context.Context, email string) (*models.Student, error) {
	student, err := s.repo.GetByEmail(ctx, email)
	if err != nil {
		return nil, ErrStudentNotFound
	}
	return student, nil
}

func (s *studentService) Update(ctx context.Context, id uuid.UUID, student *models.StudentUpdate) (*models.Student, error) {
	if _, err := s.repo.GetByID(ctx, id); err != nil {
		return nil, ErrStudentNotFound
	}
	return s.repo.Update(ctx, id, student)
}

func (s *studentService) Delete(ctx context.Context, id uuid.UUID) error {
	if _, err := s.repo.GetByID(ctx, id); err != nil {
		return ErrStudentNotFound
	}
	return s.repo.Delete(ctx, id)
}

func (s *studentService) List(ctx context.Context, limit, offset int) ([]*models.Student, error) {
	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}
	return s.repo.List(ctx, limit, offset)
}

func (s *studentService) AddSkill(ctx context.Context, studentID uuid.UUID, skill *models.SkillCreate) (*models.Skill, error) {
	if _, err := s.repo.GetByID(ctx, studentID); err != nil {
		return nil, ErrStudentNotFound
	}
	skill.StudentID = studentID
	return s.repo.AddSkill(ctx, skill)
}

func (s *studentService) AddEducation(ctx context.Context, studentID uuid.UUID, education *models.EducationCreate) (*models.Education, error) {
	if _, err := s.repo.GetByID(ctx, studentID); err != nil {
		return nil, ErrStudentNotFound
	}
	education.StudentID = studentID
	return s.repo.AddEducation(ctx, education)
}

func (s *studentService) AddExperience(ctx context.Context, studentID uuid.UUID, experience *models.ExperienceCreate) (*models.Experience, error) {
	if _, err := s.repo.GetByID(ctx, studentID); err != nil {
		return nil, ErrStudentNotFound
	}
	experience.StudentID = studentID
	return s.repo.AddExperience(ctx, experience)
}
