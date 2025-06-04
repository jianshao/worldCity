package controller

import (
	"net/http"
	"strconv"
	"worldCity/service"
	"worldCity/utils"

	"github.com/gin-gonic/gin"
)

func GetCategorys(c *gin.Context) {
	res, err := service.GetAllCategories()
	if err != nil {
		c.JSON(http.StatusOK, utils.BuildFailResp(utils.ErrInternal, err.Error()))
		return
	}
	c.JSON(http.StatusOK, utils.BuildOkResp(res))
}

// 获取服务项目下所有信息，包括服务者
func GetProvidersByCategory(c *gin.Context) {
	CategoryIDStr := c.Param("category_id") // e.g., /categories/:categoryID/providers
	categoryID, _ := strconv.Atoi(CategoryIDStr)

	providers, err := service.GetProvidersByCategoryID(uint(categoryID))
	if err != nil {
		c.JSON(http.StatusOK, utils.BuildFailResp(utils.ErrInternal, err.Error()))
		return
	}
	c.JSON(http.StatusOK, utils.BuildOkResp(map[string]interface{}{
		"count":     len(providers),
		"providers": providers,
	}))
}

func GetProviderById(c *gin.Context) {
	ProviderIdStr := c.Param("id")
	ProviderId, err := strconv.Atoi(ProviderIdStr)
	if err != nil {
		return
	}

	provider, err := service.GetProviderById(uint(ProviderId))
	if err != nil {
		c.JSON(http.StatusOK, utils.BuildFailResp(utils.ErrInternal, err.Error()))
		return
	}
	c.JSON(http.StatusOK, utils.BuildOkResp(provider))
}
