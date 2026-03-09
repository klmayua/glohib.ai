package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
	"github.com/glohib/assessment-service/internal/handlers"
	"github.com/glohib/assessment-service/internal/repository"
	"github.com/glohib/assessment-service/internal/services"
	"github.com/glohib/assessment-service/pkg/config"
	"go.uber.org/zap"
)

func main() {
	logger, _ := zap.NewProduction()
	defer logger.Sync()

	cfg, err := config.Load()
	if err != nil {
		logger.Fatal("config", zap.Error(err))
	}

	db, err := pgxpool.New(context.Background(), postgresDSN(cfg.DB))
	if err != nil {
		logger.Fatal("db", zap.Error(err))
	}
	defer db.Close()

	rdb := redis.NewClient(&redis.Options{
		Addr: cfg.Redis.Addr,
	})
	defer rdb.Close()

	repo := repository.NewAssessmentRepo(db)
	stageRepo := repository.NewStageRepo(db)
	stateSvc := services.NewStateMachineService(repo, logger)
	timerSvc := services.NewTimerService(rdb, logger)

	ah := handlers.NewAssessmentHandler(repo, stageRepo, stateSvc, timerSvc, logger, cfg.Timer.StageTimeoutMinutes)
	sh := handlers.NewStageHandler(stageRepo, stateSvc, timerSvc, logger)

	g := gin.New()
	g.Use(gin.Recovery(), gin.Logger())

	api := g.Group("/api/v1/assessment")
	{
		api.POST("/start", ah.Start)
		api.GET("/:id/status", ah.GetStatus)
		api.POST("/:id/stage/:stage/submit", sh.Submit)
		api.GET("/:id/stage/:stage/result", sh.GetResult)
		api.POST("/:id/stage/psychomotor/start", sh.StartPsychomotor)
		api.POST("/:id/stage/psychomotor/submit", sh.SubmitPsychomotor)
		api.POST("/:id/stage/situational/start", sh.StartSituational)
		api.POST("/:id/stage/situational/submit", sh.SubmitSituational)
		api.GET("/:id/final-result", ah.FinalResult)
	}

	srv := &http.Server{Addr: ":" + strconv.Itoa(cfg.Server.Port), Handler: g}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatal("http", zap.Error(err))
		}
	}()

	logger.Info("assessment-service started", zap.Int("port", cfg.Server.Port))

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		logger.Error("shutdown", zap.Error(err))
	}
}

func postgresDSN(c config.DBConfig) string {
	return fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		c.Host, c.Port, c.User, c.Password, c.DBName, c.SSLMode)
}
