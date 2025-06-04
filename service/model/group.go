package model

import "time"

type Group struct {
	ID        uint      `gorm:"primary,unique" json:"id"`
	GroupID   string    `gorm:"uniqueIndex;not null" json:"group_id"`
	Name      string    `json:"name"`
	CreatorID string    `json:"creater_id"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt time.Time `gorm:"default:NULL" json:"deleted_at"`
}
