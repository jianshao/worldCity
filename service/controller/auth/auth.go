package auth

import (
	"net/http"
	"worldCity/service"
	"worldCity/utils"

	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, utils.BuildFailResp(utils.ErrBadRequest, err.Error()))
		return
	}
	res, err := service.Login(req.Name, req.Password)
	if err != nil {
		c.JSON(http.StatusOK, utils.BuildFailResp(utils.ErrInternal, err.Error()))
		return
	}
	c.JSON(http.StatusOK, utils.BuildOkResp(res))
}

func SendCode(c *gin.Context) {
	var req SendCodeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, utils.BuildFailResp(utils.ErrBadRequest, "手机号不能为空"))
		return
	}

	_, err := service.SendCode(req.Phone)
	if err != nil {
		c.JSON(http.StatusOK, utils.BuildFailResp(utils.ErrInternal, err.Error()))
		return
	}

	c.JSON(http.StatusOK, utils.BuildOkResp(nil))
}

func Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, utils.BuildFailResp(utils.ErrBadRequest, err.Error()))
		return
	}

	res, err := service.Register(req.Phone, req.Password)
	if err != nil {
		c.JSON(http.StatusOK, utils.BuildFailResp(utils.ErrInternal, err.Error()))
		return
	}

	c.JSON(http.StatusOK, utils.BuildOkResp(res))
}

func VerifyCode(c *gin.Context) {
	var req VerifyCodeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, utils.BuildFailResp(utils.ErrBadRequest, err.Error()))
		return
	}

	res, err := service.VerifyCode(req.Phone, req.Code)
	if err != nil {
		c.JSON(http.StatusOK, utils.BuildFailResp(utils.ErrInternal, err.Error()))
		return
	}

	c.JSON(http.StatusOK, utils.BuildOkResp(res))
}
