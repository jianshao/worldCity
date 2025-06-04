package model

import (
	"time"

	"gorm.io/gorm"
)

type ServiceSchedule struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	ServiceID uint      `gorm:"not null" json:"service_id"`
	StartTime time.Time `gorm:"not null" json:"start_time"`
	EndTime   time.Time `gorm:"not null" json:"end_time"`
	IsBooked  bool      `gorm:"default:false" json:"is_booked"` // 是否已被预约
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt time.Time `gorm:"default:NULL" json:"deleted_at"`
}

func CreateServiceSchedule(db *gorm.DB, obj *ServiceSchedule) error {
	return db.Create(obj).Error
}

func GetAllServiceSchedules(db *gorm.DB) ([]ServiceSchedule, error) {
	var list []ServiceSchedule
	err := db.Find(&list).Error
	return list, err
}

func GetServiceScheduleByID(db *gorm.DB, id uint) (*ServiceSchedule, error) {
	var obj ServiceSchedule
	err := db.First(&obj, id).Error
	return &obj, err
}

func UpdateServiceSchedule(db *gorm.DB, id uint, updates map[string]interface{}) error {
	return db.Model(&ServiceSchedule{}).Where("id = ?", id).Updates(updates).Error
}

func DeleteServiceSchedule(db *gorm.DB, id uint) error {
	return db.Delete(&ServiceSchedule{}, id).Error
}
