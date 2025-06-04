package model

import (
	"log"

	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) error {
	err := db.AutoMigrate(
		&User{},
		&Tags{},
		&Category{},
		&Merchant{},
		&Product{},
		&ServiceSchedule{},
		&Order{},
		&Address{},
		&Moment{}, &MomentLike{}, &MomentComment{},
	)
	if err != nil {
		log.Printf("❌ AutoMigrate failed: %v", err)
		return err
	}

	log.Println("✅ Database migrated successfully")
	return nil
}
