package redis

import (
	"fmt"

	"github.com/glohib.ai/internship/internal/config"
	"github.com/redis/go-redis/v9"
)

type Client struct {
	*redis.Client
}

func New(cfg *config.RedisConfig) *Client {
	rdb := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%d", cfg.Host, cfg.Port),
		Password: cfg.Password,
		DB:       cfg.DB,
		PoolSize: cfg.PoolSize,
	})

	return &Client{Client: rdb}
}

func (c *Client) Close() error {
	return c.Client.Close()
}
