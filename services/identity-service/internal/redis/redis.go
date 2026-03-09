package redis

import (
	"context"
	"github.com/glohib/identity-service/internal/config"
	"github.com/redis/go-redis/v9"
)

type Client struct {
	*redis.Client
}

func New(cfg *config.RedisConfig) *Client {
	rdb := redis.NewClient(&redis.Options{
		Addr:     cfg.Addr,
		Password: cfg.Password,
		DB:       cfg.DB,
	})
	return &Client{rdb}
}
