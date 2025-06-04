package router

import (
	controllers "worldCity/controller/order"
	"worldCity/middleware"
	services "worldCity/service"

	"github.com/gin-gonic/gin"
)

func RegisterOrderRoutes(router *gin.RouterGroup, orderService services.OrderService) {

	orderController := controllers.NewOrderController(orderService)

	orderRoutes := router.Group("/orders")
	// 添加认证中间件
	orderRoutes.Use(middleware.JWTAuth())
	{
		orderRoutes.POST("", orderController.CreateOrder)                   // POST /api/v1/orders
		orderRoutes.GET("", orderController.GetOrders)                      // GET /api/v1/orders
		orderRoutes.GET("/:order_no", orderController.GetOrder)             // GET /api/v1/orders/{order_no}
		orderRoutes.PATCH("/:order_no/cancel", orderController.CancelOrder) // PATCH /api/v1/orders/{order_no}/cancel

		// 订单评价
		orderRoutes.POST("/:order_no/review", orderController.OrderReview)
	}
}
