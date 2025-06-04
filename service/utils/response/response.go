package response

import (
	"github.com/gin-gonic/gin"
)

// Response 是统一的 API 响应结构体
type Response struct {
	Code    int         `json:"code"`           // 业务状态码，可自定义
	Message string      `json:"message"`        // 提示信息
	Data    interface{} `json:"data,omitempty"` // 响应数据 (omitempty 表示如果为空则不显示)
}

// Success 成功响应
func Success(c *gin.Context, httpStatus int, data interface{}) {
	c.JSON(httpStatus, Response{
		Code:    0, // 0 通常表示成功
		Message: "Success",
		Data:    data,
	})
}

// Error 失败响应
func Error(c *gin.Context, httpStatus int, err error) {
	// 可以根据 error 类型判断具体的业务 Code
	businessCode := -1 // -1 通常表示通用错误
	errMsg := "An error occurred"
	if err != nil {
		errMsg = err.Error() // 直接使用错误信息，或映射为用户友好的提示
	}

	c.JSON(httpStatus, Response{
		Code:    businessCode,
		Message: errMsg,
		Data:    nil,
	})
}
