package router

import (
	file "worldCity/controller/file"
	"worldCity/middleware"

	"github.com/gin-gonic/gin"
)

func InitFileRoutes(api *gin.RouterGroup) {
	api.Use(middleware.JWTAuth()) // 下面接口需要登录
	{
		api.POST("/file/upload", file.UploadFile)
	}
}
