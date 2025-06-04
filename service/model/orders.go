package model

import (
	"errors"
	"time"

	"github.com/shopspring/decimal"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

// 确保导入 decimal 包

// OrderStatus 定义订单状态常量
type OrderStatus uint8

const (
	StatusWaitForPayment OrderStatus = 0 // 待支付 (如果需要)
	StatusWaiting        OrderStatus = 1 // 待接单
	StatusAccepted       OrderStatus = 2 // 已接单/服务中
	StatusCompleted      OrderStatus = 3 // 已完成
	StatusCancelled      OrderStatus = 4 // 已取消
	StatusRefunded       OrderStatus = 5 // 已退款
	StatusReviewed       OrderStatus = 6 // 已评价
)

// PaymentStatus 定义支付状态常量
type PaymentStatus uint8

const (
	PaymentStatusUnpaid    PaymentStatus = 0 // 未支付
	PaymentStatusPaid      PaymentStatus = 1 // 已支付
	PaymentStatusFailed    PaymentStatus = 2 // 支付失败
	PaymentStatusRefunding PaymentStatus = 3 // 退款中
	PaymentStatusRefunded  PaymentStatus = 4 // 已退款
)

// Order GORM 模型
type Order struct {
	ID         uint   `gorm:"primaryKey;autoIncrement" json:"-"` // 隐藏内部ID
	OrderNo    string `gorm:"type:varchar(64);uniqueIndex;not null" json:"order_no"`
	UserID     uint   `gorm:"not null;index:idx_user_id_status" json:"user_id"`         // 前端可能不需要，按需添加 json tag
	ProviderID uint   `gorm:"not null;index:idx_provider_id_status" json:"provider_id"` // 前端可能不需要
	MerchantID uint   `gorm:"not null" json:"merchant_id"`                              // 前端可能不需要

	ProductSnapshot datatypes.JSON  `gorm:"type:json" json:"product_snapshot"`
	UnitPrice       decimal.Decimal `gorm:"type:decimal(10,2);not null" json:"unit_price"`
	Quantity        uint            `gorm:"not null;default:1" json:"quantity"`
	TotalAmount     decimal.Decimal `gorm:"type:decimal(12,2);not null" json:"total_amount"`

	Status        OrderStatus   `gorm:"type:tinyint unsigned;not null;default:1;index:idx_user_id_status;index:idx_provider_id_status" json:"status"`
	PaymentStatus PaymentStatus `gorm:"type:tinyint unsigned;not null;default:0" json:"payment_status"`

	ServiceTime     *time.Time     `gorm:"" json:"service_time"` // 使用指针表示可空
	DeliveryAddress datatypes.JSON `gorm:"type:json" json:"delivery_address"`
	// UserContact     datatypes.JSON `gorm:"type:json" json:"user_contact"`

	PaymentTime        *time.Time     `gorm:"" json:"payment_time"`
	OrderTime          time.Time      `gorm:"not null" json:"order_time"` // 默认值由数据库设置
	AcceptedTime       *time.Time     `gorm:"" json:"accepted_time"`
	CompletionTime     *time.Time     `gorm:"" json:"completion_time"`
	CancellationTime   *time.Time     `gorm:"" json:"cancellation_time"`
	CancellationReason datatypes.JSON `gorm:"type:json" json:"cancellation_reason"`

	Score float32        `gorm:"" json:"score"`
	Tags  datatypes.JSON `gorm:"type:json" json:"tags"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"` // 隐藏删除时间
}

// --- Request DTOs ---

// CreateOrderRequest 创建订单的请求体
type CreateOrderRequest struct {
	UserID          uint           `json:"-"` // 从 Token 获取，不由前端传递
	ProviderID      uint           `json:"provider_id" binding:"required"`
	MerchantID      uint           `json:"merchant_id" binding:"required"`
	Quantity        uint           `json:"quantity" binding:"required,gte=1"`
	ServiceTime     *time.Time     `json:"service_time"` // 可选
	DeliveryAddress datatypes.JSON `json:"delivery_address" binding:"required"`
	// UserContact     datatypes.JSON `json:"user_contact" binding:"required"`
	// 商品快照、单价、总价由后端根据 ProductID 计算和获取，不从此 DTO 传入
}

// CancelOrderRequest 取消订单的请求体
type CancelOrderRequest struct {
	Reason datatypes.JSON `json:"reason" binding:"required"` // 可以是 ["reason1", "reason2"] 或 {"reasons": [...]}
}

// GetOrdersRequest 获取订单列表的查询参数
type GetOrdersRequest struct {
	UserID   uint  `form:"-"`      // 从 Token 获取
	Status   *uint `form:"status"` // 使用指针判断是否传入状态过滤条件
	Page     int   `form:"page,default=1"`
	PageSize int   `form:"page_size,default=10"`
}

type OrderReviewRequest struct {
	OrderNo string   `json:"order_no" binding:"required"`
	Score   uint     `json:"score" binding:"required"`
	Tags    []string `json:"tags" binding:"required"`
}

// --- Response DTOs ---

// OrderResponse 返回给前端的单个订单信息
type OrderResponse struct {
	OrderNo            string          `json:"order_no"`
	UserID             uint            `json:"user_id"`
	ProviderID         uint            `json:"provider_id"`
	ProductSnapshot    datatypes.JSON  `json:"product_snapshot"`
	UnitPrice          decimal.Decimal `json:"unit_price"`
	Quantity           uint            `json:"quantity"`
	TotalAmount        decimal.Decimal `json:"total_amount"`
	Status             OrderStatus     `json:"status"`
	StatusText         string          `json:"status_text"` // 添加状态文本
	PaymentStatus      PaymentStatus   `json:"payment_status"`
	PaymentStatusText  string          `json:"payment_status_text"` // 添加支付状态文本
	ServiceTime        *time.Time      `json:"service_time"`
	DeliveryAddress    datatypes.JSON  `json:"delivery_address"`
	UserContact        datatypes.JSON  `json:"user_contact"`
	PaymentTime        *time.Time      `json:"payment_time"`
	OrderTime          time.Time       `json:"order_time"`
	AcceptedTime       *time.Time      `json:"accepted_time"`
	CompletionTime     *time.Time      `json:"completion_time"`
	CancellationTime   *time.Time      `json:"cancellation_time"`
	CancellationReason datatypes.JSON  `json:"cancellation_reason"`
	CreatedAt          time.Time       `json:"created_at"`
	// 一般不返回 UpdatedAt, DeletedAt
}

// OrderListResponse 返回给前端的订单列表及分页信息
type OrderListResponse struct {
	Orders   []*OrderResponse `json:"orders"`
	Total    int64            `json:"total"`
	Page     int              `json:"page"`
	PageSize int              `json:"page_size"`
}

// Helper functions to map status codes to text (可以移到 pkg 或 service)
func GetOrderStatusText(status OrderStatus) string {
	switch status {
	case StatusWaiting:
		return "待接单"
	case StatusAccepted:
		return "已接单"
	case StatusCompleted:
		return "已完成"
	case StatusCancelled:
		return "已取消"
	case StatusRefunded:
		return "已退款"
	case StatusWaitForPayment:
		return "待支付"
	case StatusReviewed:
		return "已评价"
	default:
		return "未知"
	}
}

func GetPaymentStatusText(status PaymentStatus) string {
	switch status {
	case PaymentStatusUnpaid:
		return "未支付"
	case PaymentStatusPaid:
		return "已支付"
	case PaymentStatusFailed:
		return "支付失败"
	case PaymentStatusRefunding:
		return "退款中"
	case PaymentStatusRefunded:
		return "已退款"
	default:
		return "未知"
	}
}

// OrderRepository 定义订单数据访问接口
type OrderRepository interface {
	Create(order *Order) error
	FindByOrderNo(orderNo string) (*Order, error)
	FindByUserID(userID uint, status *uint, page, pageSize int) ([]Order, int64, error)
	Update(order *Order) error
	UpdateFields(orderNo string, updateData map[string]interface{}) error
}

// orderRepository 实现了 OrderRepository 接口
type orderRepository struct {
	db *gorm.DB
}

// NewOrderRepository 创建一个新的 orderRepository 实例
func NewOrderRepository(db *gorm.DB) OrderRepository {
	return &orderRepository{db: GetDB()}
}

// Create 创建订单
func (r *orderRepository) Create(order *Order) error {
	return r.db.Create(order).Error
}

// FindByOrderNo 根据订单号查找订单
func (r *orderRepository) FindByOrderNo(orderNo string) (*Order, error) {
	var order Order
	err := r.db.Where("order_no = ?", orderNo).First(&order).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil // Not found is not necessarily an error here
		}
		return nil, err
	}
	return &order, nil
}

// FindByUserID 根据用户ID查找订单列表（带分页和状态过滤）
func (r *orderRepository) FindByUserID(userID uint, status *uint, page, pageSize int) ([]Order, int64, error) {
	var orders []Order
	var total int64

	query := r.db.Model(&Order{}).Where("user_id = ?", userID)

	// 添加状态过滤条件（如果 status 指针非空）
	if status != nil {
		query = query.Where("status = ?", *status)
	}

	// 计算总数
	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	// 计算偏移量
	offset := (page - 1) * pageSize

	// 获取分页数据，并按创建时间降序排序
	err = query.Order("created_at desc").Offset(offset).Limit(pageSize).Find(&orders).Error
	if err != nil {
		return nil, 0, err
	}

	return orders, total, nil
}

// Update 更新整个订单对象 (请谨慎使用，通常建议 UpdateFields)
func (r *orderRepository) Update(order *Order) error {
	// 使用 Select("*") 确保零值字段（如 Status=0）也能被更新
	// 或者明确指定要更新的字段 .Select("Status", "PaymentStatus", ...)
	// return r.db.Save(order).Error // Save 会更新所有字段
	return r.db.Model(order).Select("*").Updates(order).Error // 使用 Updates 更新非零值，用 Select 更新包括零值
}

// UpdateFields 更新指定字段
func (r *orderRepository) UpdateFields(orderNo string, updateData map[string]interface{}) error {
	result := r.db.Model(&Order{}).Where("order_no = ?", orderNo).Updates(updateData)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound // 或者自定义错误
	}
	return nil
}
