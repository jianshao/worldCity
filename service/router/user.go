package router

import (
	controller "worldCity/controller/user"
	"worldCity/middleware"

	"github.com/gin-gonic/gin"
)

func InitUserRoutes(api *gin.RouterGroup) {
	user := api.Group("/user")

	user.Use(middleware.JWTAuth()) // 下面接口需要登录
	{
		user.GET("/check", controller.CheckLogin)
		user.GET("/list", controller.GetUserList)
		user.GET("/:id", controller.GetUserProfile)
		user.POST("/:id", controller.UpdateProfile)

		// 个人标签
		user.GET("/:id/tags", controller.GetTags)
		user.POST("/:id/tags", controller.CreateTag)
		user.DELETE("/:id/tags/:tag_id", controller.DeleteTag)

		// 个人朋友圈
		user.GET("/:id/moments", controller.GetUserMoments)

		// 用户的收货地址操作
		user.GET("/:id/addresses", controller.GetUserAddresses)
		user.POST("/:id/address", controller.CreateAddress)
		// user.PUT("/:id/address/:address_id")
		user.DELETE("/:id/address/:address_id", controller.DeleteAddress)

		// 提供的项目
		user.GET("/:id/services", controller.GetUserServices)

		// 用户充值/体现
		user.POST("/:id/recharge", controller.UserRecharge)
	}

}
