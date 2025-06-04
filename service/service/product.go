package service

import (
	"worldCity/model"
)

type ProviderInfo struct {
	// User          *model.User `json:"user"`
	Provider      *model.Product `json:"provider"`
	Orders        uint           `json:"orders"`
	Comments      uint           `json:"comments"`
	Score         uint           `json:"score"`
	AvailableTime string         `json:"available_time"`
	Status        bool           `json:"status"`
}

// 响应信息需要携带用户信息
func GetProvidersByCategoryID(CategoryID uint) ([]ProviderInfo, error) {
	// 先查出该分类下所有服务记录
	var providers []model.Product
	providers, err := model.GetProvidersByCategory(CategoryID)
	if err != nil {
		return nil, err
	}

	infos := []ProviderInfo{}
	for _, provider := range providers {
		infos = append(infos, ProviderInfo{
			Provider:      &provider,
			Orders:        10,
			Score:         4,
			Status:        provider.IsActive,
			AvailableTime: "10:00",
			Comments:      100})
	}
	return infos, nil
}

func GetProviderServices(UserId uint) (map[string]interface{}, error) {
	providers, err := model.GetProviderServices(UserId)
	if err != nil {
		return nil, err
	}
	return map[string]interface{}{
		"count":     len(providers),
		"providers": providers,
	}, nil
}

func GetProviderById(ProviderId uint) (*model.Product, error) {
	return model.GetProviderById(ProviderId)
}
