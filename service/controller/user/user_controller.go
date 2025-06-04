package user

import (
	"net/http"
	"strconv"
	"worldCity/middleware"
	"worldCity/service"
	"worldCity/utils"

	"github.com/gin-gonic/gin"
)

// 根据token获取用户信息，适用于登陆检查
func CheckLogin(c *gin.Context) {
	UserId := middleware.GetUserIdFromToken(c)
	if UserId == 0 {
		return
	}

	res, err := service.GetUserProfile(UserId)
	if err != nil {
		c.JSON(http.StatusUnauthorized, utils.BuildFailResp(utils.ErrInternal, err.Error()))
		return
	}
	c.JSON(http.StatusOK, utils.BuildOkResp(res))
}

// 获取指定用户的信息，适用于查看他人信息，以及查看自己信息
func GetUserProfile(c *gin.Context) {
	UserId := utils.GetUserIdFromUrl(c, "id")
	if UserId == 0 {
		return
	}

	res, err := service.GetUserProfile(UserId)
	if err != nil {
		c.JSON(http.StatusUnauthorized, utils.BuildFailResp(utils.ErrInternal, err.Error()))
		return
	}
	c.JSON(http.StatusOK, utils.BuildOkResp(res))
}

// 更新自己的profile，只允许自己修改
func UpdateProfile(c *gin.Context) {
	// 从token中获取用户ID
	UserId := middleware.GetUserIdFromToken(c)
	if UserId == 0 {
		return
	}

	var req ProfileUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, utils.BuildFailResp(utils.ErrBadRequest, "参数有误"))
		return
	}

	res, err := service.UpdateProfile(UserId, req.Avatar, req.Nickname, req.Gender)
	if err != nil {
		c.JSON(http.StatusOK, utils.BuildFailResp(utils.ErrInternal, err.Error()))
		return
	}

	c.JSON(http.StatusOK, utils.BuildOkResp(res))
}

func GetUserList(c *gin.Context) {
	PageNumStr := c.DefaultQuery("page_num", "1")
	PageNum, err := strconv.Atoi(PageNumStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.BuildFailResp(utils.ErrInternal, err.Error()))
		return
	}

	PageSizeStr := c.DefaultQuery("page_size", "10")
	PageSize, _ := strconv.Atoi(PageSizeStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.BuildFailResp(utils.ErrInternal, err.Error()))
		return
	}

	res, err := service.GetUserList(uint(PageNum), uint(PageSize))
	if err != nil {
		c.JSON(http.StatusOK, utils.BuildFailResp(utils.ErrInternal, err.Error()))
		return
	}

	c.JSON(http.StatusOK, utils.BuildOkResp(res))
}

type UserTagRequest struct {
	UserId uint   `json:"user_id"`
	Tag    string `json:"tag"`
}

type UserTagResponse struct {
	ID     uint   `json:"id"`
	UserId uint   `json:"user_id"`
	Tag    string `json:"tag"`
}

func GetTags(c *gin.Context) {
	UserId := utils.GetUserIdFromUrl(c, "id")
	if UserId == 0 {
		return
	}

	res, err := service.GetTags(uint(UserId))
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.BuildFailResp(utils.ErrInternal, err.Error()))
		return
	}
	c.JSON(http.StatusOK, utils.BuildOkResp(map[string]interface{}{
		"count": len(res),
		"data":  res,
	}))
}

func CreateTag(c *gin.Context) {
	var req UserTagRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, utils.BuildFailResp(utils.ErrBadRequest, "参数有误"))
		return
	}
	res, err := service.CreateTag(req.UserId, req.Tag)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.BuildFailResp(utils.ErrInternal, err.Error()))
		return
	}
	c.JSON(http.StatusOK, utils.BuildOkResp(res))
}

func DeleteTag(c *gin.Context) {
	idStr := c.Param("tag_id")
	TagId, err := strconv.Atoi(idStr)
	if err != nil || TagId == 0 {
		c.JSON(http.StatusBadRequest, utils.BuildFailResp(utils.ErrBadRequest, "参数有误"))
		return
	}

	err = service.DeleteTag(uint(TagId))
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.BuildFailResp(utils.ErrInternal, err.Error()))
		return
	}
	c.JSON(http.StatusOK, utils.BuildOkResp(nil))
}

func GetUserMoments(c *gin.Context) {
	UserId := utils.GetUserIdFromUrl(c, "id")
	if UserId == 0 {
		return
	}

	moments, err := service.GetUserMoments(UserId)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.BuildFailResp(utils.ErrInternal, err.Error()))
		return
	}
	c.JSON(http.StatusOK, utils.BuildOkResp(map[string]interface{}{
		"count":   len(moments),
		"moments": moments,
	}))
}

type UserRechargeRequest struct {
	Coins uint
}

func UserRecharge(c *gin.Context) {
	UserId := utils.GetUserIdFromUrl(c, "id")
	if UserId == 0 {
		return
	}
	var req UserRechargeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, utils.BuildFailResp(utils.ErrBadRequest, "参数有误"))
		return
	}
	err := service.UserRecharge(UserId, req.Coins)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.BuildFailResp(utils.ErrInternal, err.Error()))
		return
	}

	c.JSON(http.StatusOK, utils.BuildOkResp(nil))
}

// 获取指定用户提供的服务
func GetUserServices(c *gin.Context) {
	// e.g., /users/:userID/services
	UserID := utils.GetUserIdFromUrl(c, "id")
	if UserID == 0 {
		return
	}

	res, err := service.GetProviderServices(UserID)
	if err != nil {
		c.JSON(http.StatusOK, utils.BuildFailResp(utils.ErrInternal, err.Error()))
		return
	}
	c.JSON(http.StatusOK, utils.BuildOkResp(res))
}

type AddressRequest struct {
	Name      string `json:"name"`
	Phone     string `json:"phone"`
	Address   string `json:"address"`
	IsDefault bool   `json:"is_default"`
}

func CreateAddress(c *gin.Context) {
	UserId := utils.GetUserIdFromUrl(c, "id")
	if UserId == 0 {
		return
	}

	var req AddressRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, utils.BuildFailResp(utils.ErrBadRequest, "参数有误"))
		return
	}
	address, err := service.CreateAddress(UserId, req.Name, req.Phone, req.Address, req.IsDefault)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.BuildFailResp(utils.ErrInternal, err.Error()))
		return
	}

	c.JSON(http.StatusOK, utils.BuildOkResp(address))
}

func GetUserAddresses(c *gin.Context) {
	UserId := utils.GetUserIdFromUrl(c, "id")
	if UserId == 0 {
		return
	}
	addresses, err := service.GetUserAddresses(UserId)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.BuildFailResp(utils.ErrInternal, err.Error()))
		return
	}

	c.JSON(http.StatusOK, utils.BuildOkResp(addresses))
}

func DeleteAddress(c *gin.Context) {
	AddressId := utils.GetUserIdFromUrl(c, "address_id")
	if AddressId == 0 {
		return
	}
	err := service.DeleteAddress(AddressId)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.BuildFailResp(utils.ErrInternal, err.Error()))
		return
	}

	c.JSON(http.StatusOK, utils.BuildOkResp(nil))
}
