package message

import (
	"net/http"
	"worldCity/service"

	"github.com/gin-gonic/gin"
)

type MarkReadRequest struct {
	MessageID string `json:"message_id"`
	UserID    string `json:"user_id"`
	SessionID string `json:"session_id"`
}

// POST /api/message/read
func MarkMessageAsRead(c *gin.Context) {
	var req MarkReadRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid parameters"})
		return
	}
	err := service.MarkMessageAsRead(req.MessageID, req.UserID, req.SessionID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to mark as read"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Success"})
}
