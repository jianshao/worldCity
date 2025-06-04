package controllers

import (
	"errors"
	"net/http"
	"strconv"
	"worldCity/middleware"
	models "worldCity/model"

	services "worldCity/service"
	response "worldCity/utils/response"

	"github.com/gin-gonic/gin"
)

// OrderController 处理订单相关的 HTTP 请求
type OrderController struct {
	orderService services.OrderService
}

// NewOrderController 创建一个新的 OrderController 实例
func NewOrderController(orderService services.OrderService) *OrderController {
	return &OrderController{orderService: orderService}
}

// CreateOrder @Summary 创建新订单
// @Description 根据请求创建新的订单
// @Tags Orders
// @Accept json
// @Produce json
// @Param order body models.CreateOrderRequest true "创建订单请求体"
// @Success 201 {object} response.Response{data=models.OrderResponse} "订单创建成功"
// @Failure 400 {object} response.Response "请求参数错误"
// @Failure 500 {object} response.Response "服务器内部错误"
// @Router /orders [post]
func (ctrl *OrderController) CreateOrder(c *gin.Context) {
	var req models.CreateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err)
		return
	}

	// --- 获取用户 ID (需要认证中间件支持) ---
	userID := middleware.GetUserIdFromToken(c) // 实现这个辅助函数
	if userID == 0 {
		response.Error(c, http.StatusUnauthorized, errors.New("user not authenticated"))
		return
	}
	req.UserID = userID

	orderResp, err := ctrl.orderService.CreateOrder(req)
	if err != nil {
		// 根据 service 返回的错误类型判断状态码
		if err.Error() == "product not found or error fetching product" {
			response.Error(c, http.StatusNotFound, err)
		} else if err.Error() == "failed to create order" {
			response.Error(c, http.StatusInternalServerError, err)
		} else {
			response.Error(c, http.StatusBadRequest, err) // 可能是其他业务校验错误
		}
		return
	}

	response.Success(c, http.StatusCreated, orderResp)
}

// GetOrder @Summary 获取订单详情
// @Description 根据订单号获取订单详情
// @Tags Orders
// @Produce json
// @Param order_no path string true "订单编号"
// @Success 200 {object} response.Response{data=models.OrderResponse} "获取成功"
// @Failure 401 {object} response.Response "未授权"
// @Failure 403 {object} response.Response "无权限访问"
// @Failure 404 {object} response.Response "订单未找到"
// @Failure 500 {object} response.Response "服务器内部错误"
// @Router /orders/{order_no} [get]
func (ctrl *OrderController) GetOrder(c *gin.Context) {
	orderNo := c.Param("order_no")
	if orderNo == "" {
		response.Error(c, http.StatusBadRequest, errors.New("order number is required"))
		return
	}

	// --- 获取用户 ID (需要认证中间件支持) ---
	userID := middleware.GetUserIdFromToken(c)
	if userID == 0 {
		response.Error(c, http.StatusUnauthorized, errors.New("user not authenticated"))
		return
	}
	// --- End Auth ---

	orderResp, err := ctrl.orderService.GetOrderByOrderNo(orderNo, userID)
	if err != nil {
		errMsg := err.Error()
		if errMsg == "order not found" {
			response.Error(c, http.StatusNotFound, err)
		} else if errMsg == "permission denied" {
			response.Error(c, http.StatusForbidden, err)
		} else {
			response.Error(c, http.StatusInternalServerError, err)
		}
		return
	}

	response.Success(c, http.StatusOK, orderResp)
}

// GetOrders @Summary 获取用户订单列表
// @Description 获取当前用户的订单列表，支持分页和状态过滤
// @Tags Orders
// @Produce json
// @Param status query int false "订单状态 (1:待接单, 2:已接单, 3:已完成, 4:已取消)"
// @Param page query int false "页码" default(1)
// @Param pageSize query int false "每页数量" default(10)
// @Success 200 {object} response.Response{data=models.OrderListResponse} "获取成功"
// @Failure 401 {object} response.Response "未授权"
// @Failure 500 {object} response.Response "服务器内部错误"
// @Router /orders [get]
func (ctrl *OrderController) GetOrders(c *gin.Context) {
	var req models.GetOrdersRequest

	// 手动绑定查询参数并设置默认值
	req.Page, _ = strconv.Atoi(c.DefaultQuery("page", "1"))
	req.PageSize, _ = strconv.Atoi(c.DefaultQuery("pageSize", "10"))

	if statusStr := c.Query("status"); statusStr != "" {
		statusUint64, err := strconv.ParseUint(statusStr, 10, 8)
		if err == nil {
			status := uint(statusUint64)
			req.Status = &status // 设置指针
		} else {
			response.Error(c, http.StatusBadRequest, errors.New("invalid status parameter"))
			return
		}
	}

	// --- 获取用户 ID (需要认证中间件支持) ---
	userID := middleware.GetUserIdFromToken(c)
	if userID == 0 {
		response.Error(c, http.StatusUnauthorized, errors.New("user not authenticated"))
		return
	}
	req.UserID = userID
	// --- End Auth ---

	// 校验分页参数
	if req.Page < 1 {
		req.Page = 1
	}
	if req.PageSize < 1 {
		req.PageSize = 10
	} else if req.PageSize > 100 { // 防止一次请求过多数据
		req.PageSize = 100
	}

	ordersResp, err := ctrl.orderService.GetUserOrders(req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, err)
		return
	}

	response.Success(c, http.StatusOK, ordersResp)
}

// CancelOrder @Summary 取消订单
// @Description 取消一个处于待接单状态的订单
// @Tags Orders
// @Accept json
// @Produce json
// @Param order_no path string true "订单编号"
// @Param reason body models.CancelOrderRequest true "取消原因"
// @Success 200 {object} response.Response{data=string} "取消成功"
// @Failure 400 {object} response.Response "请求参数错误 或 订单状态无法取消"
// @Failure 401 {object} response.Response "未授权"
// @Failure 403 {object} response.Response "无权限操作"
// @Failure 404 {object} response.Response "订单未找到"
// @Failure 500 {object} response.Response "服务器内部错误"
// @Router /orders/{order_no}/cancel [patch]
func (ctrl *OrderController) CancelOrder(c *gin.Context) {
	orderNo := c.Param("order_no")
	if orderNo == "" {
		response.Error(c, http.StatusBadRequest, errors.New("order number is required"))
		return
	}

	var req models.CancelOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err)
		return
	}

	// --- 获取用户 ID (需要认证中间件支持) ---
	userID := middleware.GetUserIdFromToken(c)
	if userID == 0 {
		response.Error(c, http.StatusUnauthorized, errors.New("user not authenticated"))
		return
	}
	// --- End Auth ---

	err := ctrl.orderService.CancelOrder(orderNo, userID, req)
	if err != nil {
		errMsg := err.Error()
		if errMsg == "order not found" {
			response.Error(c, http.StatusNotFound, err)
		} else if errMsg == "permission denied" {
			response.Error(c, http.StatusForbidden, err)
		} else if errMsg == "order cannot be cancelled in current status" {
			response.Error(c, http.StatusBadRequest, err) // 状态不允许，算作客户端请求错误
		} else {
			response.Error(c, http.StatusInternalServerError, err)
		}
		return
	}

	response.Success(c, http.StatusOK, "Order cancelled successfully")
}

func (ctrl *OrderController) OrderReview(c *gin.Context) {
	var req models.OrderReviewRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, err)
		return
	}

	// --- 获取用户 ID (需要认证中间件支持) ---
	userID := middleware.GetUserIdFromToken(c)
	if userID == 0 {
		response.Error(c, http.StatusUnauthorized, errors.New("user not authenticated"))
		return
	}
	// --- End Auth ---

	err := ctrl.orderService.OrderReview(req.OrderNo, userID, req.Score, req.Tags)
	if err != nil {
		errMsg := err.Error()
		if errMsg == "order not found" {
			response.Error(c, http.StatusNotFound, err)
		} else if errMsg == "permission denied" {
			response.Error(c, http.StatusForbidden, err)
		} else if errMsg == "order cannot be review in current status" {
			response.Error(c, http.StatusBadRequest, err) // 状态不允许，算作客户端请求错误
		} else {
			response.Error(c, http.StatusInternalServerError, err)
		}
		return
	}

	response.Success(c, http.StatusOK, "Order review successfully")
}
