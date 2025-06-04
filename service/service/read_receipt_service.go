package service

import (
	"time"
	"worldCity/model"
)

// 标记消息为已读
func MarkMessageAsRead(messageID, userID, sessionID string) error {
	db := model.GetDB()

	receipt := model.ReadReceipt{
		MessageID: messageID,
		UserID:    userID,
		SessionID: sessionID,
		ReadAt:    time.Now(),
	}

	return db.Create(&receipt).Error
}

// 获取某会话中用户已读的消息ID列表
func GetReadMessages(sessionID, userID string) ([]string, error) {
	db := model.GetDB()
	var receipts []model.ReadReceipt
	err := db.Where("session_id = ? AND user_id = ?", sessionID, userID).Find(&receipts).Error

	var ids []string
	for _, r := range receipts {
		ids = append(ids, r.MessageID)
	}
	return ids, err
}
