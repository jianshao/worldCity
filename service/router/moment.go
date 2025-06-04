package router

import (
	controller "worldCity/controller/moment"
	"worldCity/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterMomentRoutes(r *gin.RouterGroup) {
	moments := r.Group("/moments")

	moments.Use(middleware.JWTAuth())
	{
		r.GET("", controller.GetMoments)
		r.POST("", controller.PostMoment)
		r.POST("/:id/like", controller.LikeMoment)
		r.POST("/:id/comment", controller.CommentMoment)
		r.GET("/:id/comments", controller.GetMomentComments)
	}
}
