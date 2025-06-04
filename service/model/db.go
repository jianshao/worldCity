package model

import (
	"errors"
	"fmt"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var db *gorm.DB

type RetryDo func() error

func Retry(do RetryDo, times int) error {
	err := errors.New("")
	for i := 0; i < times; i++ {
		err = do()
		if err == nil {
			return nil
		}
	}
	return errors.New(fmt.Sprintf("retry %d times, still error: ", times, err))
}

func InitDB() {
	var err error
	// conf := config.GetConf()
	dsn := "worldCity:worldCity@tcp(localhost:3306)/world_city?charset=utf8mb4&parseTime=True&loc=Local"
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Println("failed")
		log.Fatal("MySQL connection failed:", err)
	}
	Migrate(db)
}

func GetDB() *gorm.DB {
	return db
}
