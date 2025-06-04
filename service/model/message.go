package model

import "time"

type Message struct {
	ID          uint      `gorm:"primary,unique" json:"id"`
	SessionID   string    `json:"session_id"`
	SenderID    uint      `json:"sender_id"`
	ReceiverID  uint      `json:"receiver_id,omitempty"`
	GroupID     uint      `json:"group_id,omitempty"`
	ContentType string    `json:"content_type"`
	Content     string    `json:"content"`
	Timestamp   uint      `json:"timestamp"`
	IsRead      bool      `json:"is_read"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt   time.Time `gorm:"default:NULL" json:"deleted_at"`
}

func FetchMessages(sessionID string, beforeID int64, limit int) ([]Message, error) {
	db := GetDB()
	var messages []Message

	query := db.Where("session_id = ?", sessionID)

	if beforeID > 0 {
		query = query.Where("id < ?", beforeID)
	}

	err := query.Order("id desc").Limit(limit).Find(&messages).Error
	return messages, err
}
