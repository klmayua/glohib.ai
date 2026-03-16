package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
	"github.com/glohib/identity-service/internal/config"
	"github.com/glohib/identity-service/internal/db"
	"github.com/glohib/identity-service/internal/handlers"
	"github.com/glohib/identity-service/internal/jwt"
	loggerPkg "github.com/glohib/identity-service/internal/logger"
	"github.com/glohib/identity-service/internal/redis"
	"github.com/glohib/identity-service/internal/router"
	"go.uber.org/zap"
)

func main() {
	if err := loggerPkg.Init(); err != nil {
		log.Fatalf("init logger: %v", err)
	}

	cfg, err := config.Load()
	if err != nil {
		loggerPkg.Fatal("load config", zap.Error(err))
	}

	database, err := db.New(&cfg.Database)
	if err != nil {
		loggerPkg.Fatal("connect db", zap.Error(err))
	}
	defer database.Close()

	rdb := redis.New(&cfg.Redis)
	defer rdb.Close()

	jwtHelper := jwt.NewHelper(&cfg.JWT)

	authHandler := handlers.NewAuthHandler(database, rdb, jwtHelper, cfg)
	oauthHandler := handlers.NewOAuthHandler(database, rdb, jwtHelper, cfg)
	apiKeyHandler := handlers.NewAPIKeyHandler(database)

	r := router.New(authHandler, oauthHandler, apiKeyHandler, jwtHelper, rdb)

	// gRPC server disabled — proto Go code not yet generated
	// Re-enable after running: protoc --go_out=. --go-grpc_out=. pkg/proto/identity.proto

	srv := &http.Server{Addr: ":" + cfg.Server.Port, Handler: r}

	go func() {
		loggerPkg.Info("http server started", zap.String("port", cfg.Server.Port))
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			loggerPkg.Fatal("http server", zap.Error(err))
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		loggerPkg.Error("shutdown", zap.Error(err))
	}
}
