package config

import (
	"fmt"
	"os"
	"time"

	"github.com/spf13/viper"
)

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	Redis    RedisConfig
	Logging  LoggingConfig
	Services ServicesConfig
}

type ServerConfig struct {
	Host         string
	Port         int
	GRPCPort     int
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
	IdleTimeout  time.Duration
}

type DatabaseConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	Database string
	SSLMode  string
	MaxConns int
	MinConns int
}

type RedisConfig struct {
	Host       string
	Port       int
	DB         int
	PoolSize   int
	Password   string
}

type LoggingConfig struct {
	Level  string
	Format string
}

type ServicesConfig struct {
	EmbeddingServiceURL string
	AuthServiceURL      string
}

func Load() (*Config, error) {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	viper.AddConfigPath("./services/student-service")

	if err := viper.ReadInConfig(); err != nil {
		return nil, fmt.Errorf("reading config: %w", err)
	}

	cfg := &Config{}
	if err := viper.Unmarshal(cfg); err != nil {
		return nil, fmt.Errorf("unmarshaling config: %w", err)
	}

	cfg.Database.Host = getEnv("POSTGRES_HOST", cfg.Database.Host)
	cfg.Database.User = getEnv("POSTGRES_USER", cfg.Database.User)
	cfg.Database.Password = getEnv("POSTGRES_PASSWORD", cfg.Database.Password)
	cfg.Database.Database = getEnv("POSTGRES_DB", cfg.Database.Database)

	cfg.Redis.Host = getEnv("REDIS_HOST", cfg.Redis.Host)
	cfg.Redis.Password = getEnv("REDIS_PASSWORD", cfg.Redis.Password)

	// Ensure database pool sizes are valid
	if cfg.Database.MaxConns < 1 {
		cfg.Database.MaxConns = 25
	}
	if cfg.Database.MinConns < 1 {
		cfg.Database.MinConns = 5
	}
	if cfg.Database.MinConns > cfg.Database.MaxConns {
		cfg.Database.MinConns = cfg.Database.MaxConns
	}
	if cfg.Redis.PoolSize <= 0 {
		cfg.Redis.PoolSize = 10
	}

	return cfg, nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
