package message

import (
	"net/http"
	"strconv"
	"worldCity/middleware"
	"worldCity/model"
	"worldCity/service"

	"github.com/gin-gonic/gin"
)

func SendPrivateMessage(c *gin.Context) {
	var req service.SendMessageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fromID := middleware.GetUserIdFromToken(c)

	err := service.SendMessage(fromID, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "sent"})
}

func GetHistoryMessages(c *gin.Context) {
	// 参数获取
	sessionID := c.Query("session_id")
	beforeIDStr := c.Query("before_id") // optional
	limitStr := c.DefaultQuery("limit", "20")

	limit, _ := strconv.Atoi(limitStr)
	if limit <= 0 {
		limit = 20
	}

	var beforeID int64
	if beforeIDStr != "" {
		beforeID, _ = strconv.ParseInt(beforeIDStr, 10, 64)
	}

	// 查询
	messages, err := model.FetchMessages(sessionID, beforeID, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "fetch messages failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"messages": messages})
}
