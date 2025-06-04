package model

import (
	"time"

	"gorm.io/gorm"
)

type Address struct {
	ID           uint      `gorm:"primary,unique" json:"id"`
	UserId       uint      `json:"user_id"`
	Address      string    `json:"address"`
	ContactName  string    `json:"name"`
	ContactPhone string    `json:"phone"`
	IsDefault    bool      `json:"is_default"`
	CreatedAt    time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt    time.Time `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt    time.Time `gorm:"default:NULL" json:"deleted_at"`
}

func CreateAddress(UserId uint, UserAddress, Name, Phone string, IsDefault bool) (*Address, error) {
	db := GetDB()
	address := &Address{
		UserId:       UserId,
		Address:      UserAddress,
		ContactName:  Name,
		ContactPhone: Phone,
		IsDefault:    IsDefault,
	}
	err := db.Model(&Address{}).Create(address).Error
	if err != nil {
		return nil, err
	}
	return address, nil
}

func GetUserAddresses(UserId uint) ([]Address, error) {
	db := GetDB()
	var addresses []Address
	err := db.Model(&Address{}).Where("user_id=?", UserId).Order("is_default desc").Find(&addresses).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return []Address{}, nil
		} else {
			return nil, err
		}
	} else {
		return addresses, nil
	}
}

func UpdateAddress(id uint, updates map[string]interface{}) error {
	db := GetDB()
	return db.Model(&Address{}).Where("id=?", id).Updates(updates).Error
}

func DeleteAddress(AddressId uint) error {
	db := GetDB()
	return db.Delete(&Address{}, AddressId).Error
}
