package repository

import (
	"context"

	"github.com/glohib-ai/student-service/internal/db"
	"github.com/glohib-ai/student-service/internal/models"
	"github.com/google/uuid"
)

type StudentRepository interface {
	Create(ctx context.Context, student *models.StudentCreate) (*models.Student, error)
	GetByID(ctx context.Context, id uuid.UUID) (*models.Student, error)
	GetByEmail(ctx context.Context, email string) (*models.Student, error)
	Update(ctx context.Context, id uuid.UUID, student *models.StudentUpdate) (*models.Student, error)
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, limit, offset int) ([]*models.Student, error)
	AddSkill(ctx context.Context, skill *models.SkillCreate) (*models.Skill, error)
	AddEducation(ctx context.Context, education *models.EducationCreate) (*models.Education, error)
	AddExperience(ctx context.Context, experience *models.ExperienceCreate) (*models.Experience, error)
}

type studentRepository struct {
	db *db.DB
}

func NewStudentRepository(db *db.DB) StudentRepository {
	return &studentRepository{db: db}
}

func (r *studentRepository) Create(ctx context.Context, student *models.StudentCreate) (*models.Student, error) {
	query := `
		INSERT INTO students (
			user_id, first_name, last_name, email, phone, date_of_birth,
			gender, nationality, address, city, state, country, postal_code,
			profile_picture_url, bio, linkedin_url, github_url, website_url,
			is_active, profile_complete, created_at, updated_at
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
			$14, $15, $16, $17, $18, $19, $20, NOW(), NOW()
		) RETURNING id, created_at, updated_at`

	result := r.db.QueryRow(ctx, query,
		student.UserID, student.FirstName, student.LastName, student.Email,
		student.Phone, student.DateOfBirth, student.Gender, student.Nationality,
		student.Address, student.City, student.State, student.Country, student.PostalCode,
		student.ProfilePictureURL, student.Bio, student.LinkedInURL, student.GitHubURL,
		student.WebsiteURL, true, 0.0,
	)

	s := &models.Student{
		UserID:            student.UserID,
		FirstName:         student.FirstName,
		LastName:          student.LastName,
		Email:             student.Email,
		Phone:             student.Phone,
		DateOfBirth:       student.DateOfBirth,
		Gender:            student.Gender,
		Nationality:       student.Nationality,
		Address:           student.Address,
		City:              student.City,
		State:             student.State,
		Country:           student.Country,
		PostalCode:        student.PostalCode,
		ProfilePictureURL: student.ProfilePictureURL,
		Bio:               student.Bio,
		LinkedInURL:       student.LinkedInURL,
		GitHubURL:         student.GitHubURL,
		WebsiteURL:        student.WebsiteURL,
		IsActive:          true,
		ProfileComplete:   0.0,
	}

	err := result.Scan(&s.ID, &s.CreatedAt, &s.UpdatedAt)
	if err != nil {
		return nil, err
	}

	return s, nil
}

func (r *studentRepository) GetByID(ctx context.Context, id uuid.UUID) (*models.Student, error) {
	query := `
		SELECT id, user_id, first_name, last_name, email, phone, date_of_birth,
		       gender, nationality, address, city, state, country, postal_code,
		       profile_picture_url, bio, linkedin_url, github_url, website_url,
		       is_active, profile_complete, created_at, updated_at, deleted_at
		FROM students WHERE id = $1 AND deleted_at IS NULL`

	s := &models.Student{}
	err := r.db.QueryRow(ctx, query, id).Scan(
		&s.ID, &s.UserID, &s.FirstName, &s.LastName, &s.Email, &s.Phone,
		&s.DateOfBirth, &s.Gender, &s.Nationality, &s.Address, &s.City,
		&s.State, &s.Country, &s.PostalCode, &s.ProfilePictureURL, &s.Bio,
		&s.LinkedInURL, &s.GitHubURL, &s.WebsiteURL, &s.IsActive,
		&s.ProfileComplete, &s.CreatedAt, &s.UpdatedAt, &s.DeletedAt,
	)
	if err != nil {
		return nil, err
	}

	return s, nil
}

func (r *studentRepository) GetByEmail(ctx context.Context, email string) (*models.Student, error) {
	query := `
		SELECT id, user_id, first_name, last_name, email, phone, date_of_birth,
		       gender, nationality, address, city, state, country, postal_code,
		       profile_picture_url, bio, linkedin_url, github_url, website_url,
		       is_active, profile_complete, created_at, updated_at, deleted_at
		FROM students WHERE email = $1 AND deleted_at IS NULL`

	s := &models.Student{}
	err := r.db.QueryRow(ctx, query, email).Scan(
		&s.ID, &s.UserID, &s.FirstName, &s.LastName, &s.Email, &s.Phone,
		&s.DateOfBirth, &s.Gender, &s.Nationality, &s.Address, &s.City,
		&s.State, &s.Country, &s.PostalCode, &s.ProfilePictureURL, &s.Bio,
		&s.LinkedInURL, &s.GitHubURL, &s.WebsiteURL, &s.IsActive,
		&s.ProfileComplete, &s.CreatedAt, &s.UpdatedAt, &s.DeletedAt,
	)
	if err != nil {
		return nil, err
	}

	return s, nil
}

func (r *studentRepository) Update(ctx context.Context, id uuid.UUID, student *models.StudentUpdate) (*models.Student, error) {
	query := `
		UPDATE students SET
			first_name = COALESCE($1, first_name),
			last_name = COALESCE($2, last_name),
			email = COALESCE($3, email),
			phone = COALESCE($4, phone),
			date_of_birth = COALESCE($5, date_of_birth),
			gender = COALESCE($6, gender),
			nationality = COALESCE($7, nationality),
			address = COALESCE($8, address),
			city = COALESCE($9, city),
			state = COALESCE($10, state),
			country = COALESCE($11, country),
			postal_code = COALESCE($12, postal_code),
			profile_picture_url = COALESCE($13, profile_picture_url),
			bio = COALESCE($14, bio),
			linkedin_url = COALESCE($15, linkedin_url),
			github_url = COALESCE($16, github_url),
			website_url = COALESCE($17, website_url),
			is_active = COALESCE($18, is_active),
			updated_at = NOW()
		WHERE id = $19 AND deleted_at IS NULL
		RETURNING id, user_id, first_name, last_name, email, phone, date_of_birth,
		          gender, nationality, address, city, state, country, postal_code,
		          profile_picture_url, bio, linkedin_url, github_url, website_url,
		          is_active, profile_complete, created_at, updated_at, deleted_at`

	s := &models.Student{}
	err := r.db.QueryRow(ctx, query,
		student.FirstName, student.LastName, student.Email, student.Phone,
		student.DateOfBirth, student.Gender, student.Nationality, student.Address,
		student.City, student.State, student.Country, student.PostalCode,
		student.ProfilePictureURL, student.Bio, student.LinkedInURL,
		student.GitHubURL, student.WebsiteURL, student.IsActive, id,
	).Scan(
		&s.ID, &s.UserID, &s.FirstName, &s.LastName, &s.Email, &s.Phone,
		&s.DateOfBirth, &s.Gender, &s.Nationality, &s.Address, &s.City,
		&s.State, &s.Country, &s.PostalCode, &s.ProfilePictureURL, &s.Bio,
		&s.LinkedInURL, &s.GitHubURL, &s.WebsiteURL, &s.IsActive,
		&s.ProfileComplete, &s.CreatedAt, &s.UpdatedAt, &s.DeletedAt,
	)
	if err != nil {
		return nil, err
	}

	return s, nil
}

func (r *studentRepository) Delete(ctx context.Context, id uuid.UUID) error {
	query := `UPDATE students SET deleted_at = NOW() WHERE id = $1`
	_, err := r.db.Exec(ctx, query, id)
	return err
}

func (r *studentRepository) List(ctx context.Context, limit, offset int) ([]*models.Student, error) {
	query := `
		SELECT id, user_id, first_name, last_name, email, phone, date_of_birth,
		       gender, nationality, address, city, state, country, postal_code,
		       profile_picture_url, bio, linkedin_url, github_url, website_url,
		       is_active, profile_complete, created_at, updated_at, deleted_at
		FROM students WHERE deleted_at IS NULL
		ORDER BY created_at DESC LIMIT $1 OFFSET $2`

	rows, err := r.db.Query(ctx, query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var students []*models.Student
	for rows.Next() {
		s := &models.Student{}
		err := rows.Scan(
			&s.ID, &s.UserID, &s.FirstName, &s.LastName, &s.Email, &s.Phone,
			&s.DateOfBirth, &s.Gender, &s.Nationality, &s.Address, &s.City,
			&s.State, &s.Country, &s.PostalCode, &s.ProfilePictureURL, &s.Bio,
			&s.LinkedInURL, &s.GitHubURL, &s.WebsiteURL, &s.IsActive,
			&s.ProfileComplete, &s.CreatedAt, &s.UpdatedAt, &s.DeletedAt,
		)
		if err != nil {
			return nil, err
		}
		students = append(students, s)
	}

	return students, nil
}

func (r *studentRepository) AddSkill(ctx context.Context, skill *models.SkillCreate) (*models.Skill, error) {
	query := `
		INSERT INTO skills (student_id, name, proficiency, category, created_at, updated_at)
		VALUES ($1, $2, $3, $4, NOW(), NOW())
		RETURNING id, created_at, updated_at`

	s := &models.Skill{Name: skill.Name, Proficiency: skill.Proficiency, Category: skill.Category}
	err := r.db.QueryRow(ctx, query, skill.StudentID, skill.Name, skill.Proficiency, skill.Category).Scan(
		&s.ID, &s.CreatedAt, &s.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	return s, nil
}

func (r *studentRepository) AddEducation(ctx context.Context, education *models.EducationCreate) (*models.Education, error) {
	query := `
		INSERT INTO education (
			student_id, institution, degree, field_of_study, start_date,
			end_date, gpa, description, is_current, created_at, updated_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
		RETURNING id, created_at, updated_at`

	e := &models.Education{
		Institution:  education.Institution,
		Degree:       education.Degree,
		FieldOfStudy: education.FieldOfStudy,
		StartDate:    education.StartDate,
		EndDate:      education.EndDate,
		GPA:          education.GPA,
		Description:  education.Description,
		IsCurrent:    education.IsCurrent,
	}
	err := r.db.QueryRow(ctx, query,
		education.StudentID, education.Institution, education.Degree,
		education.FieldOfStudy, education.StartDate, education.EndDate,
		education.GPA, education.Description, education.IsCurrent,
	).Scan(&e.ID, &e.CreatedAt, &e.UpdatedAt)
	if err != nil {
		return nil, err
	}

	return e, nil
}

func (r *studentRepository) AddExperience(ctx context.Context, experience *models.ExperienceCreate) (*models.Experience, error) {
	query := `
		INSERT INTO experience (
			student_id, company, position, start_date, end_date,
			description, is_current, created_at, updated_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
		RETURNING id, created_at, updated_at`

	e := &models.Experience{
		Company:     experience.Company,
		Position:    experience.Position,
		StartDate:   experience.StartDate,
		EndDate:     experience.EndDate,
		Description: experience.Description,
		IsCurrent:   experience.IsCurrent,
	}
	err := r.db.QueryRow(ctx, query,
		experience.StudentID, experience.Company, experience.Position,
		experience.StartDate, experience.EndDate, experience.Description,
		experience.IsCurrent,
	).Scan(&e.ID, &e.CreatedAt, &e.UpdatedAt)
	if err != nil {
		return nil, err
	}

	return e, nil
}
