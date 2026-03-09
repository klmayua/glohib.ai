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
