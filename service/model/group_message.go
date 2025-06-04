package model

import "time"

type GroupMessage struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	GroupID   string    `gorm:"index" json:"group_id"`
	SenderID  string    `json:"sender_id"`
	Content   string    `json:"content"`
	Type      string    `json:"type"` // text, image, audio, video
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt time.Time `gorm:"default:NULL" json:"deleted_at"`
}
