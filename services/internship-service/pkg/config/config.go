package config

import (
	"fmt"
	"time"
	"github.com/spf13/viper"
)

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	Redis    RedisConfig
	Services ServicesConfig
}

type ServerConfig struct {
	Host         string
	Port         int
	GRPCPort     int
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
}

type DatabaseConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	Database string
	SSLMode  string
	MaxConns int32
	MinConns int32
}

type RedisConfig struct {
	Host     string
	Port     int
	Password string
	DB       int
}

type ServicesConfig struct {
	EmbeddingServiceURL string
	AuthServiceURL      string
}

func Load() (*Config, error) {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	viper.SetEnvPrefix("INTERNSHIP")
	viper.AutomaticEnv()
	setDefaults()

	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			return nil, fmt.Errorf("error reading config file: %w", err)
		}
	}

	var cfg Config
	if err := viper.Unmarshal(&cfg); err != nil {
		return nil, fmt.Errorf("error unmarshaling config: %w", err)
	}
	return &cfg, nil
}

func setDefaults() {
	viper.SetDefault("server.host", "0.0.0.0")
	viper.SetDefault("server.port", 8083)
	viper.SetDefault("server.grpc_port", 50053)
	viper.SetDefault("server.read_timeout", "15s")
	viper.SetDefault("server.write_timeout", "15s")

	viper.SetDefault("database.host", "postgres")
	viper.SetDefault("database.port", 5432)
	viper.SetDefault("database.user", "glohib")
	viper.SetDefault("database.password", "changeme")
	viper.SetDefault("database.database", "glohib_db")
	viper.SetDefault("database.ssl_mode", "disable")

	viper.SetDefault("redis.host", "redis")
	viper.SetDefault("redis.port", 6379)

	viper.SetDefault("services.embedding_service_url", "http://ai-service:8000")
	viper.SetDefault("services.auth_service_url", "http://identity-service:8080")
}
