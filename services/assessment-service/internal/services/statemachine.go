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
