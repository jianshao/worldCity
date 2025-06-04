package controller

import (
	"net/http"
	"worldCity/service"

	"github.com/gin-gonic/gin"
)

type CreateGroupRequest struct {
	GroupID   string `json:"group_id"`
	Name      string `json:"name"`
	CreatorID string `json:"creator_id"`
}

func CreateGroup(c *gin.Context) {
	var req CreateGroupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误"})
		return
	}
	if err := service.CreateGroup(req.GroupID, req.Name, req.CreatorID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "创建失败"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "创建成功"})
}
