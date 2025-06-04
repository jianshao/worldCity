package service

import (
	"worldCity/model"
)

type ServiceInfo struct {
	Service model.Merchant
	User    *model.User
}

func GetServicesByUserID(UserID uint) ([]model.Merchant, error) {
	services, err := model.GetServicesByUser(UserID)
	if err != nil {
		return nil, err
	}
	return services, err
}

func GetAllCategories() (map[string]interface{}, error) {
	categorys, err := model.GetAllCategories()
	if err != nil {
		return nil, err
	}
	return map[string]interface{}{
		"count":     len(categorys),
		"categorys": categorys,
	}, nil
}
