package controller

import (
	"net/http"
	"worldCity/service"

	"github.com/gin-gonic/gin"
)

type SendGroupMsgRequest struct {
	GroupID  string `json:"group_id"`
	SenderID string `json:"sender_id"`
	Content  string `json:"content"`
	Type     string `json:"type"` // text, image, audio
}

func SendGroupMessage(c *gin.Context) {
	var req SendGroupMsgRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误"})
		return
	}
	err := service.SendGroupMessage(req.GroupID, req.SenderID, req.Content, req.Type)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "发送失败"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "发送成功"})
}
