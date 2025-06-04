package model

import (
	"time"

	"gorm.io/gorm"
)

// 服务项目下可以有多个商户，每个商户下可以有多个服务者
type Merchant struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	UserID      uint      `gorm:"not null" json:"user_id"` // 商户管理员
	Title       string    `gorm:"size:64;not null" json:"title"`
	Description string    `gorm:"size:255" json:"description"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt   time.Time `gorm:"default:NULL" json:"deleted_at"`
}

// 创建服务项目
func CreateService(db *gorm.DB, svc *Merchant) error {
	return db.Create(svc).Error
}

// 获取服务者的所有服务
func GetServicesByUser(userID uint) ([]Merchant, error) {
	var services []Merchant
	db := GetDB()
	err := db.Model(&Merchant{}).Where("user_id = ?", userID).Find(&services).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return []Merchant{}, nil
		} else {
			return nil, err
		}
	} else {
		return services, nil
	}
}

// 更新服务信息
func UpdateService(db *gorm.DB, id uint, updates map[string]interface{}) error {
	return db.Model(&Merchant{}).Where("id = ?", id).Updates(updates).Error
}

// 删除服务
func DeleteService(db *gorm.DB, id uint) error {
	return db.Delete(&Merchant{}, id).Error
}
