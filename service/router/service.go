package router

import (
	controller "worldCity/controller/service"
	"worldCity/middleware"

	"github.com/gin-gonic/gin"
)

func InitServicesRouters(rg *gin.RouterGroup) {
	project := rg.Group("/categories")

	project.Use(middleware.JWTAuth())
	{
		// 获取服务项目列表
		project.GET("list", controller.GetCategorys)

		// 获取用户提供的服务项目
		// project.GET("/users/:user_id", controller.GetUserServices)
		// 获取服务项目下可选的服务者
		project.GET("/:category_id/providers", controller.GetProvidersByCategory)
	}

	provider := rg.Group("/provider")
	provider.Use(middleware.JWTAuth())
	{
		provider.GET("/:id", controller.GetProviderById)
	}
}
