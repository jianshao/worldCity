package model

import (
	"time"
)

type ReadReceipt struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	MessageID string    `gorm:"index;not null" json:"message_id"` // 消息 ID
	UserID    string    `gorm:"index;not null" json:"user_id"`    // 已读用户 ID
	SessionID string    `gorm:"index;not null" json:"session_id"` // 会话 ID
	ReadAt    time.Time `gorm:"autoCreateTime" json:"read_at"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt time.Time `gorm:"default:NULL" json:"deleted_at"`
}
