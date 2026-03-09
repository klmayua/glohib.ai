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
	Host        string
	Port        int
	User        string
	Password    string
	Database    string
	SSLMode     string
	MaxConns    int32
	MinConns    int32
	MaxLifetime time.Duration
	MaxIdleTime time.Duration
}

type RedisConfig struct {
	Host         string
	Port         int
	Password     string
	DB           int
	PoolSize     int
	MinIdleConns int
	MaxRetries   int
	DialTimeout  time.Duration
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
}

type LoggingConfig struct {
	Level  string
	Format string
	Output string
}

type ServicesConfig struct {
	EmbeddingServiceURL      string
	AuthServiceURL           string
	NotificationServiceURL   string
}

func Load() (*Config, error) {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	viper.AddConfigPath("./config")
	viper.SetEnvPrefix("STUDENT")
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
	viper.SetDefault("server.port", 8082)
	viper.SetDefault("server.grpc_port", 50052)
	viper.SetDefault("server.read_timeout", "15s")
	viper.SetDefault("server.write_timeout", "15s")
	viper.SetDefault("server.idle_timeout", "60s")

	viper.SetDefault("database.host", "postgres")
	viper.SetDefault("database.port", 5432)
	viper.SetDefault("database.user", "glohib")
	viper.SetDefault("database.password", "changeme")
	viper.SetDefault("database.database", "glohib_db")
	viper.SetDefault("database.ssl_mode", "disable")
	viper.SetDefault("database.max_conns", 25)
	viper.SetDefault("database.min_conns", 5)

	viper.SetDefault("redis.host", "redis")
	viper.SetDefault("redis.port", 6379)
	viper.SetDefault("redis.db", 0)
	viper.SetDefault("redis.pool_size", 10)

	viper.SetDefault("logging.level", "info")
	viper.SetDefault("logging.format", "json")

	viper.SetDefault("services.embedding_service_url", "http://ai-service:8000")
	viper.SetDefault("services.auth_service_url", "http://identity-service:8080")
}

func (c *Config) Validate() error {
	if c.Server.Port <= 0 || c.Server.Port > 65535 {
		return fmt.Errorf("invalid server port: %d", c.Server.Port)
	}
	if c.Database.Database == "" {
		return fmt.Errorf("database name is required")
	}
	return nil
}
