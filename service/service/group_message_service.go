package service

import (
	"time"
	"worldCity/model"
)

func SendGroupMessage(groupID, senderID, content, msgType string) error {
	msg := model.GroupMessage{
		GroupID:   groupID,
		SenderID:  senderID,
		Content:   content,
		Type:      msgType,
		CreatedAt: time.Now(),
	}
	return model.GetDB().Create(&msg).Error
}

func GetGroupMessages(groupID string, limit int) ([]model.GroupMessage, error) {
	var messages []model.GroupMessage
	err := model.GetDB().Where("group_id = ?", groupID).Order("created_at desc").Limit(limit).Find(&messages).Error
	return messages, err
}
