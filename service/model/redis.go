package model

import (
	"context"
	"log"

	"github.com/redis/go-redis/v9"
)

var rds *redis.Client
var Ctx = context.Background()

func InitRedis() {
	// conf := config.GetConf()
	rds = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379", //conf.Redis.Addr,
		Password: "",               //conf.Redis.Password,
		DB:       0,                //conf.Redis.DB,
	})

	_, err := rds.Ping(Ctx).Result()
	if err != nil {
		log.Fatal("Redis connection failed:", err)
	}
}

func GetRds() *redis.Client {
	return rds
}
