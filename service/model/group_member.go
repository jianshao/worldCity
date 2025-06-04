package model

import "time"

type GroupMember struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	GroupID   string    `gorm:"index" json:"group_id"`
	UserID    string    `gorm:"index" json:"user_id"`
	Role      string    `gorm:"default:'member'" json:"role"` // member, admin, owner
	JoinedAt  time.Time `gorm:"autoCreateTime" json:"joined_at"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt time.Time `gorm:"default:NULL" json:"deleted_at"`
}
