package config

import "github.com/spf13/viper"

type Config struct {
	DB       DBConfig
	Redis    RedisConfig
	Server   ServerConfig
	JWT      JWTConfig
	LLM      LLMConfig
	NLP      NLPConfig
	Timer    TimerConfig
}

type DBConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	DBName   string
	SSLMode  string
}

type RedisConfig struct {
	Addr     string
	Password string
	DB       int
}

type ServerConfig struct {
	Port         int
	GRPCPort     int
	ReadTimeout  int
	WriteTimeout int
}

type JWTConfig struct {
	Secret string
	TTL    int
}

type LLMConfig struct {
	Endpoint string
	APIKey   string
	Timeout  int
}

type NLPConfig struct {
	Endpoint string
	APIKey   string
	Timeout  int
}

type TimerConfig struct {
	StageTimeoutMinutes int
	WarnMinutes         int
}

func Load() (*Config, error) {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	viper.AddConfigPath("/etc/glohib/")
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		return nil, err
	}
	var c Config
	if err := viper.Unmarshal(&c); err != nil {
		return nil, err
	}
	return &c, nil
}
