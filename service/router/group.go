package router

import (
	controller "worldCity/controller/group"

	"github.com/gin-gonic/gin"
)

func InitGroupRoutes(api *gin.RouterGroup) {

	group := api.Group("/group")
	{
		group.POST("/create", controller.CreateGroup)
		group.POST("/send", controller.SendGroupMessage)

		// api.POST("/group/create", controller.CreateGroup)
		// api.POST("/group/join", controller.JoinGroup)
		// api.POST("/video/start", controller.StartVideoCall)
		// api.POST("/video/accept", controller.AcceptVideoCall)
		// api.POST("/video/cancel", controller.CancelVideoCall)
	}
}
