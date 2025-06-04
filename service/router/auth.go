package router

import (
	auth "worldCity/controller/auth"

	"github.com/gin-gonic/gin"
)

func InitAuthRoutes(api *gin.RouterGroup) {
	api.POST("/auth/register", auth.Register)
	api.POST("/auth/login", auth.Login)

	api.POST("/auth/send_code", auth.SendCode)
	api.POST("/auth/verify_code", auth.VerifyCode)
}
