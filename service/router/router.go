package router

import (
	"worldCity/model"
	"worldCity/service"

	"github.com/gin-gonic/gin"
)

func InitRoutes(r *gin.Engine) {
	api := r.Group("/api")

	InitAuthRoutes(api)
	InitFileRoutes(api)
	InitUserRoutes(api)
	RegisterMomentRoutes(api)
	InitServicesRouters(api)

	// 3. 依赖注入：初始化 Repository, Service
	orderRepo := model.NewOrderRepository(nil)
	orderService := service.NewOrderService(orderRepo)
	RegisterOrderRoutes(api, orderService)

}
