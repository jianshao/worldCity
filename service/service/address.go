package service

import "worldCity/model"

func CreateAddress(UserId uint, Name, Phone, Address string, IsDefault bool) (*model.Address, error) {
	address, err := model.CreateAddress(UserId, Address, Name, Phone, IsDefault)
	if err != nil {
		return nil, err
	}
	return address, nil
}

func DeleteAddress(AddressId uint) error {
	return model.DeleteAddress(AddressId)
}

func GetUserAddresses(UserId uint) (map[string]interface{}, error) {
	addresses, err := model.GetUserAddresses(UserId)
	if err != nil {
		return nil, err
	}
	return map[string]interface{}{
		"count":     len(addresses),
		"addresses": addresses,
	}, nil
}
