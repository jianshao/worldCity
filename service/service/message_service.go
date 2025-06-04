package service

import (
	"worldCity/model"
	"worldCity/utils"
)

type SendMessageRequest struct {
	ToID    uint
	Type    string
	Content string
	IsGroup bool
	GroupID uint
}

func SendMessage(fromID uint, req SendMessageRequest) error {
	// 保存数据库
	msg := model.Message{
		ID:         fromID,
		ReceiverID: req.ToID,
		// Type:    req.Type,
		Content: req.Content,
		// IsGroup: req.IsGroup,
		GroupID: req.GroupID,
		IsRead:  false,
	}
	if err := model.GetDB().Create(&msg).Error; err != nil {
		return err
	}

	// 保存Redis未读数
	if !req.IsGroup {
		key := utils.GetUnreadKey(req.ToID)
		model.GetRds().Incr(model.Ctx, key)
	}

	// 调用云信发送
	go utils.SendYunxinMsg(fromID, req.ToID, req.Type, req.Content)

	return nil
}
