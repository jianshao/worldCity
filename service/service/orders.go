package service

import (
	"encoding/json"
	"errors"
	"log"
	"time"
	models "worldCity/model" // 替换为你的项目名称
	"worldCity/utils"

	// "your_project_name/pkg/utils"    // 替换为你的项目名称

	// 导入
	"github.com/shopspring/decimal"
	"gorm.io/datatypes"
)

// OrderService 定义订单业务逻辑接口
type OrderService interface {
	CreateOrder(req models.CreateOrderRequest) (*models.OrderResponse, error)
	GetOrderByOrderNo(orderNo string, userID uint) (*models.OrderResponse, error)
	GetUserOrders(req models.GetOrdersRequest) (*models.OrderListResponse, error)
	CancelOrder(orderNo string, userID uint, req models.CancelOrderRequest) error
	OrderReview(orderNo string, UserId, Score uint, Tags []string) error
}

// orderService 实现了 OrderService 接口
type orderService struct {
	orderRepo models.OrderRepository
	// productRepo repositories.ProductRepository // 注入 Product Repository (如果需要)
}

// NewOrderService 创建一个新的 orderService 实例
func NewOrderService(orderRepo models.OrderRepository) OrderService {
	return &orderService{
		orderRepo: orderRepo,
		// productRepo: productRepo,
	}
}

// CreateOrder 处理创建订单逻辑
func (s *orderService) CreateOrder(req models.CreateOrderRequest) (*models.OrderResponse, error) {
	// --- 1. 获取商品信息 (此处为模拟，实际需要从商品服务或数据库获取) ---
	// product, err := s.productRepo.FindByID(req.ProductID)
	provider, err := models.GetProviderById(req.ProviderID)
	if err != nil || provider == nil {
		return nil, errors.New("product not found or error fetching product")
	}
	// mock data
	// mockProductSnapshot := datatypes.JSON([]byte(`{"name": "示例商品", "image": "url/to/img.jpg", "options": {"duration": "7日"}}`))

	jsonStr, _ := json.Marshal(map[string]interface{}{
		"title":  provider.Title,
		"desc":   provider.Desc,
		"price":  provider.Price,
		"images": provider.Images,
	})
	ProductSnapshot := datatypes.JSON(jsonStr)
	// --- End of Mock ---

	// --- 2. 计算总价 ---
	UnitPrice := decimal.NewFromFloat(provider.Price) // 假设单价为 100.00
	quantityDecimal := decimal.NewFromInt(int64(req.Quantity))
	totalAmount := UnitPrice.Mul(quantityDecimal)

	// --- 3. 生成订单号 ---
	orderNo := utils.GenerateOrderNo(req.MerchantID) // 使用工具生成

	// --- 4. 构建订单模型 ---
	order := &models.Order{
		OrderNo:         orderNo,
		UserID:          req.UserID, // 确保UserID已正确设置
		ProviderID:      req.ProviderID,
		MerchantID:      req.MerchantID,
		ProductSnapshot: ProductSnapshot,
		UnitPrice:       UnitPrice,
		Quantity:        req.Quantity,
		TotalAmount:     totalAmount,
		Status:          models.StatusWaiting,     // 初始状态：待接单
		PaymentStatus:   models.PaymentStatusPaid, // 假设创建即已支付，根据实际流程调整
		ServiceTime:     req.ServiceTime,
		DeliveryAddress: req.DeliveryAddress,
		// UserContact:     req.UserContact,
		OrderTime:   time.Now(),                                         // 记录下单时间 (数据库也会设默认值)
		PaymentTime: func() *time.Time { t := time.Now(); return &t }(), // 假设立即支付成功
		// 其他时间字段默认为 NULL
	}

	// --- 5. 存储订单 ---
	err = s.orderRepo.Create(order)
	if err != nil {
		log.Printf("Error creating order: %v\n", err)
		return nil, errors.New("failed to create order")
	}

	// --- 6. 返回响应 DTO ---
	response := MapOrderToResponse(order) // 使用转换函数
	return response, nil
}

// GetOrderByOrderNo 处理获取单个订单逻辑
func (s *orderService) GetOrderByOrderNo(orderNo string, userID uint) (*models.OrderResponse, error) {
	order, err := s.orderRepo.FindByOrderNo(orderNo)
	if err != nil {
		log.Printf("Error finding order by orderNo %s: %v\n", orderNo, err)
		return nil, errors.New("error fetching order details")
	}
	if order == nil {
		return nil, errors.New("order not found") // 返回明确的未找到错误
	}

	// --- 权限校验 ---
	if order.UserID != userID {
		// 或许商户也能看？根据业务逻辑调整
		log.Printf("User %d attempting to access order %s owned by user %d\n", userID, orderNo, order.UserID)
		return nil, errors.New("permission denied") // 返回权限错误
	}

	response := MapOrderToResponse(order)
	return response, nil
}

// GetUserOrders 处理获取用户订单列表逻辑
func (s *orderService) GetUserOrders(req models.GetOrdersRequest) (*models.OrderListResponse, error) {
	orders, total, err := s.orderRepo.FindByUserID(req.UserID, req.Status, req.Page, req.PageSize)
	if err != nil {
		log.Printf("Error finding orders for user %d: %v\n", req.UserID, err)
		return nil, errors.New("error fetching orders")
	}

	orderResponses := make([]*models.OrderResponse, len(orders))
	for i, order := range orders {
		orderResponses[i] = MapOrderToResponse(&order)
	}

	response := &models.OrderListResponse{
		Orders:   orderResponses,
		Total:    total,
		Page:     req.Page,
		PageSize: req.PageSize,
	}

	return response, nil
}

// CancelOrder 处理取消订单逻辑
func (s *orderService) CancelOrder(orderNo string, userID uint, req models.CancelOrderRequest) error {
	order, err := s.orderRepo.FindByOrderNo(orderNo)
	if err != nil {
		log.Printf("Error finding order for cancellation %s: %v\n", orderNo, err)
		return errors.New("error finding order")
	}
	if order == nil {
		return errors.New("order not found")
	}

	// --- 权限校验 ---
	if order.UserID != userID {
		log.Printf("User %d attempting to cancel order %s owned by user %d\n", userID, orderNo, order.UserID)
		return errors.New("permission denied")
	}

	// --- 状态校验 (只有待接单状态才能取消) ---
	if order.Status != models.StatusWaiting {
		log.Printf("Order %s cannot be cancelled in status %d\n", orderNo, order.Status)
		return errors.New("order cannot be cancelled in current status") // 用户友好的错误信息
	}

	// --- 执行取消操作 ---
	now := time.Now()
	updateData := map[string]interface{}{
		"status":              models.StatusCancelled,
		"cancellation_time":   &now, // 注意是指针
		"cancellation_reason": req.Reason,
	}

	err = s.orderRepo.UpdateFields(orderNo, updateData)
	if err != nil {
		log.Printf("Error updating order status for cancellation %s: %v\n", orderNo, err)
		return errors.New("failed to cancel order")
	}

	// --- 后续处理 (例如：退款逻辑 - 如果已支付) ---
	// if order.PaymentStatus == models.PaymentStatusPaid {
	//     // 调用退款服务...
	//     // s.refundService.InitiateRefund(order.OrderNo, order.TotalAmount)
	// }

	return nil
}

func (s *orderService) OrderReview(orderNo string, UserId, Score uint, Tags []string) error {
	order, err := s.orderRepo.FindByOrderNo(orderNo)
	if err != nil {
		log.Printf("Error finding order for cancellation %s: %v\n", orderNo, err)
		return errors.New("error finding order")
	}
	if order == nil {
		return errors.New("order not found")
	}

	// --- 权限校验 ---
	if order.UserID != UserId {
		log.Printf("User %d attempting to cancel order %s owned by user %d\n", UserId, orderNo, order.UserID)
		return errors.New("permission denied")
	}

	// --- 状态校验 (只有待接单状态才能取消) ---
	if order.Status != models.StatusCompleted {
		log.Printf("Order %s cannot be cancelled in status %d\n", orderNo, order.Status)
		return errors.New("order cannot be cancelled in current status") // 用户友好的错误信息
	}

	// --- 执行评价操作 ---
	tagsStr, _ := json.Marshal(Tags)
	updateData := map[string]interface{}{
		"score":  Score, // 注意是指针
		"tags":   datatypes.JSON(tagsStr),
		"status": models.StatusReviewed,
	}

	err = s.orderRepo.UpdateFields(orderNo, updateData)
	if err != nil {
		log.Printf("Error updating order status for review %s: %v\n", orderNo, err)
		return errors.New("failed to review order")
	}
	return nil
}

// MapOrderToResponse 将 GORM 模型转换为响应 DTO
func MapOrderToResponse(order *models.Order) *models.OrderResponse {
	if order == nil {
		return nil
	}
	return &models.OrderResponse{
		OrderNo:           order.OrderNo,
		UserID:            order.UserID,
		ProviderID:        order.ProviderID,
		ProductSnapshot:   order.ProductSnapshot,
		UnitPrice:         order.UnitPrice,
		Quantity:          order.Quantity,
		TotalAmount:       order.TotalAmount,
		Status:            order.Status,
		StatusText:        models.GetOrderStatusText(order.Status),
		PaymentStatus:     order.PaymentStatus,
		PaymentStatusText: models.GetPaymentStatusText(order.PaymentStatus),
		ServiceTime:       order.ServiceTime,
		DeliveryAddress:   order.DeliveryAddress,
		// UserContact:        order.UserContact,
		PaymentTime:        order.PaymentTime,
		OrderTime:          order.OrderTime,
		AcceptedTime:       order.AcceptedTime,
		CompletionTime:     order.CompletionTime,
		CancellationTime:   order.CancellationTime,
		CancellationReason: order.CancellationReason,
		CreatedAt:          order.CreatedAt,
	}
}
