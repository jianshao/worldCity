package controller

import (
	"net/http"
	"strconv"
	"worldCity/middleware"
	"worldCity/service"
	"worldCity/utils"

	"github.com/gin-gonic/gin"
)

func GetMoments(c *gin.Context) {
	// 需要查询登陆用户对moment的关系
	UserId := middleware.GetUserIdFromToken(c)
	if UserId == 0 {
		c.JSON(http.StatusBadRequest, utils.BuildFailResp(utils.ErrBadRequest, "先登录"))
		return
	}

	moments, err := service.GetMoments(UserId)
	if err != nil {
		c.JSON(http.StatusOK, utils.BuildFailResp(utils.ErrInternal, err.Error()))
	} else {
		c.JSON(http.StatusOK, utils.BuildOkResp(map[string]interface{}{
			"count":   len(moments),
			"moments": moments,
		}))
	}
}

type UserResponse struct {
	ID       uint   `json:"id"`
	Nickname string `json:"nickname"`
	Avatar   string `json:"avatar"`
}

type MomentResponse struct {
	ID         uint         `json:"id"`
	Content    string       `json:"content"`
	Images     []string     `json:"images"`
	Location   string       `json:"location"`
	Visibility uint         `json:"visibility"`
	Owner      UserResponse `json:"owner"`
	Liked      bool         `json:"liked"`
	LikeCount  uint         `json:"like_count"`
}

func PostMoment(c *gin.Context) {
	var moment MomentRequest
	if err := c.ShouldBindJSON(&moment); err != nil {
		c.JSON(http.StatusBadRequest, utils.BuildFailResp(utils.ErrBadRequest, err.Error()))
		return
	}
	UserId := middleware.GetUserIdFromToken(c)
	if UserId == 0 {
		c.JSON(http.StatusBadRequest, utils.BuildFailResp(utils.ErrBadRequest, "先登录"))
		return
	}
	if len(moment.Images) == 0 && len(moment.Content) == 0 {
		c.JSON(http.StatusBadRequest, utils.BuildFailResp(utils.ErrBadRequest, "动态内容不能为空"))
		return
	}
	newMoment, err := service.PostMoment(&service.MomentInfo{
		UserId:     uint(UserId),
		Content:    moment.Content,
		Images:     moment.Images,
		Visibility: moment.Visibility,
	})
	if err != nil {
		c.JSON(http.StatusOK, utils.BuildFailResp(utils.ErrInternal, err.Error()))
		return
	}

	c.JSON(http.StatusOK, utils.BuildOkResp(newMoment))
}

type MomentLikeRequest struct {
	UserId   uint `json:"user_id"`
	MomentId uint `json:"moment_id"`
	Status   bool `json:"status"`
}

func LikeMoment(c *gin.Context) {
	var like MomentLikeRequest
	if err := c.ShouldBindJSON(&like); err != nil {
		c.JSON(http.StatusBadRequest, utils.BuildFailResp(utils.ErrBadRequest, err.Error()))
		return
	}
	UserId := middleware.GetUserIdFromToken(c)
	newLike, err := service.LikeMoment(UserId, like.MomentId, like.Status)
	if err != nil {
		c.JSON(http.StatusOK, utils.BuildFailResp(utils.ErrInternal, err.Error()))
		return
	}
	c.JSON(http.StatusOK, utils.BuildOkResp(newLike))
}

type MomentCommentRequest struct {
	MomentId uint   `json:"moment_id"`
	Content  string `json:"content"`
}

func CommentMoment(c *gin.Context) {
	var comment MomentCommentRequest
	if err := c.ShouldBindJSON(&comment); err != nil {
		c.JSON(http.StatusBadRequest, utils.BuildFailResp(utils.ErrBadRequest, err.Error()))
		return
	}
	newComment, err := service.CommentMoment(middleware.GetUserIdFromToken(c), comment.MomentId, comment.Content)
	if err != nil {
		c.JSON(http.StatusOK, utils.BuildFailResp(utils.ErrInternal, err.Error()))
		return
	}
	c.JSON(http.StatusOK, utils.BuildOkResp(newComment))
}

func GetMomentComments(c *gin.Context) {
	idStr := c.Param("id")
	momentId, _ := strconv.Atoi(idStr)
	comments, err := service.GetMomentComments(uint(momentId))
	if err != nil {
		c.JSON(http.StatusOK, utils.BuildFailResp(utils.ErrInternal, err.Error()))
		return
	}
	c.JSON(http.StatusOK, utils.BuildOkResp(map[string]interface{}{
		"count":    len(comments),
		"comments": comments,
	}))
}
