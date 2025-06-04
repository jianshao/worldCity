package utils

import (
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

// 从url中获取用户ID
func GetUserIdFromUrl(c *gin.Context, key string) uint {
	UserIdStr := c.Param(key)
	UserId, err := strconv.Atoi(UserIdStr)
	if err != nil || UserId == 0 {
		c.JSON(http.StatusUnauthorized, BuildFailResp(ErrBadRequest, fmt.Sprintf("uid 错误: %s", err.Error())))
		return 0
	}
	return uint(UserId)
}

// GenerateOrderID 生成订单编号
func GenerateOrderNo(shopID uint) string {
	// 获取当前时间戳（精确到毫秒）
	timestamp := time.Now().UnixNano() / int64(time.Millisecond)

	// 生成随机码（6位随机数）
	rand.Seed(time.Now().UnixNano())
	randomCode := fmt.Sprintf("%06d", rand.Intn(1000000))

	// 拼接订单编号：时间戳 + 店铺编号 + 随机码
	orderID := fmt.Sprintf("%d%d%s", timestamp, shopID, randomCode)
	return orderID

}
