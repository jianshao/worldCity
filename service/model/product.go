package model

import (
	"time"

	"gorm.io/gorm"
)

type Product struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	UserId     uint      `json:"user_id"`     //服务者ID
	CategoryId uint      `json:"category_id"` //服务项目ID
	Title      string    `json:"title"`
	Desc       string    `json:"desc"`
	Images     []string  `gorm:"type:json;serializer:json" json:"images"`
	Price      float64   `gorm:"not null;default:0" json:"price"` // 当前价格
	IsActive   bool      `gorm:"default:true" json:"is_active"`   //当前是否可以提供服务
	User       User      `json:"user"`
	Category   Category  `json:"category"`
	CreatedAt  time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt  time.Time `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt  time.Time `gorm:"default:NULL" json:"deleted_at"`
}

// 获取该项目下的所有服务者
func GetProvidersByCategory(CategoryId uint) ([]Product, error) {
	db := GetDB()
	var providers []Product
	err := db.Model(&Product{}).Preload("User").Where("category_id=?", CategoryId).Find(&providers).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return []Product{}, nil
		} else {
			return nil, err
		}
	} else {
		return providers, nil
	}
}

func GetProviderServices(UserId uint) ([]Product, error) {
	db := GetDB()
	var providers []Product
	err := db.Model(&Product{}).Preload("User").Where("user_id=?", UserId).Find(&providers).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return []Product{}, nil
		} else {
			return nil, err
		}
	} else {
		return providers, nil
	}
}

func GetProviderById(ProviderId uint) (*Product, error) {
	db := GetDB()
	var provider Product
	err := db.Model(&Product{}).Preload("User").Where("id=?", ProviderId).First(&provider).Error
	if err != nil {
		return nil, err
	}
	return &provider, nil
}
