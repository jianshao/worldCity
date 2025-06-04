package router

import (
	group "worldCity/controller/group"
	message "worldCity/controller/message"
	"worldCity/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterChatRoutes(rg *gin.RouterGroup) {
	chat := rg.Group("/chat", middleware.JWTAuth())

	// 私聊
	chat.POST("/private/send", message.SendPrivateMessage)
	// chat.GET("/private/history", controller.GetPrivateChatHistory)

	// 群聊
	chat.POST("/group/send", group.SendGroupMessage)
	// chat.GET("/group/history", controller.GetGroupChatHistory)

	// 已读回执
	// chat.POST("/read-receipt", controller.MarkMessagesAsRead)
}
