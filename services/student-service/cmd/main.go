package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/glohib-ai/student-service/internal/config"
	"github.com/glohib-ai/student-service/internal/db"
	"github.com/glohib-ai/student-service/internal/handlers"
	"github.com/glohib-ai/student-service/internal/logger"
	"github.com/glohib-ai/student-service/internal/redis"
	"github.com/glohib-ai/student-service/internal/repository"
	"github.com/glohib-ai/student-service/internal/router"
	"github.com/glohib-ai/student-service/internal/services"
	"go.uber.org/zap"
)

func main() {
	if err := logger.Init(); err != nil {
		log.Fatalf("init logger: %v", err)
	}

	cfg, err := config.Load()
	if err != nil {
		logger.Fatal("load config", zap.Error(err))
	}

	database, err := db.New(&cfg.Database)
	if err != nil {
		logger.Fatal("connect db", zap.Error(err))
	}
	defer database.Close()

	rdb := redis.New(&cfg.Redis)
	defer rdb.Close()

	studentRepo := repository.NewStudentRepository(database)
	studentService := services.NewStudentService(studentRepo)
	studentHandler := handlers.NewStudentHandler(studentService)

	r := router.New(studentHandler)

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", cfg.Server.Port),
		Handler:      r,
		ReadTimeout:  cfg.Server.ReadTimeout,
		WriteTimeout: cfg.Server.WriteTimeout,
		IdleTimeout:  cfg.Server.IdleTimeout,
	}

	go func() {
		logger.Info("student-service started", zap.Int("port", cfg.Server.Port))
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatal("http server", zap.Error(err))
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		logger.Error("shutdown", zap.Error(err))
	}

	logger.Info("student-service stopped")
}
