package model

import (
	"errors"
	"fmt"
	"time"

	"gorm.io/gorm"
)

type VideoInfo struct {
	Title  string `json:"title"`
	Access uint   `json:"access"`
	Uri    string `json:"uri"`
}

type User struct {
	// 默认包含ID, CreatedAt, UpdatedAt, DeletedAt
	ID         uint        `gorm:"primary,unique" json:"id"`
	Name       string      `gorm:"unique" json:"name"`
	Nickname   string      `json:"nickname"`
	Password   string      `json:"password"`
	Avatar     string      `json:"avatar"`
	AccId      string      `gorm:"unique" json:"acc_id"`
	MerchantId uint        `json:"merchant_id"`
	Gender     uint        `json:"gender"`
	Photos     []string    `gorm:"type:json;serializer:json" json:"photos"` // 推荐使用 GORM serializer
	Videos     []VideoInfo `gorm:"type:json;serializer:json" json:"videos"`
	Desc       string      `gorm:"type:text" json:"desc"`
	Birthday   time.Time   `gorm:"default:'1970-01-01'" json:"birthday"`
	Height     uint        `json:"height"`
	Weight     uint        `json:"weight"`
	Coins      uint        `gorm:"default:0" json:"coins"`
	Merchant   Merchant    `json:"merchant"`
	CreatedAt  time.Time   `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt  time.Time   `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt  time.Time   `gorm:"default:NULL" json:"deleted_at"`
}

type Tags struct {
	ID        uint      `gorm:"primary,unique" json:"id"`
	UserId    uint      `json:"user_id"`
	Tag       string    `gorm:"type:varchar(255);uniqueIndex" json:"tag"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
	DeletedAt time.Time `gorm:"default:NULL"`
}

func GetUserById(uid uint) (*User, error) {
	var user User
	db := GetDB()
	if err := db.Model(&User{}).Where("id = ?", uid).First(&user).Error; err != nil {
		return nil, errors.New("user not found")
	}
	return &user, nil
}

func GetUserByName(name string) (*User, error) {
	var user User
	db := GetDB()
	if err := db.Model(&User{}).Where("name = ?", name).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func GetUserList(PageNum, PageSize uint) ([]User, error) {
	var users []User
	db := GetDB()
	offset := (PageNum - 1) * PageSize
	if err := db.Model(&User{}).Find(&users).Offset(int(offset)).Limit(int(PageSize)).Error; err != nil {
		return nil, err
	}
	return users, nil
}

func IsUserExisted(name string) (bool, error) {
	var user User
	db := GetDB()
	err := db.Model(&User{}).Where("name = ?", name).First(&user).Error
	if err == gorm.ErrRecordNotFound {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	return true, nil
}

func CreateUser(user *User) (*User, error) {
	db := GetDB()
	// gorm create 之后会自动更新原结构体
	err := db.Model(&User{}).Create(user).Error
	if err != nil {
		return nil, err
	}

	return user, nil
}

func UpdateUserInfo(user *User) (*User, error) {
	db := GetDB()
	err := db.Model(&User{}).Where("id = ?", user.ID).Updates(user).Error
	if err != nil {
		return nil, err
	}
	return user, nil
}

func GetTagsByUserId(UserId uint) ([]Tags, error) {
	db := GetDB()
	var tags []Tags
	sqlStr := fmt.Sprintf("user_id=%d", UserId)
	err := db.Model(&Tags{}).Where(sqlStr).Find(&tags).Error
	if err == gorm.ErrRecordNotFound {
		return []Tags{}, nil
	} else if err != nil {
		return nil, err
	} else {
		return tags, nil
	}
}

func CreateTag(UserId uint, Tag string) (*Tags, error) {
	db := GetDB()
	tag := &Tags{UserId: UserId, Tag: Tag}
	err := db.Model(&Tags{}).Create(tag).Error
	if err != nil {
		return nil, err
	}
	return tag, nil
}

func DeleteTag(TagId uint) error {
	db := GetDB()
	return db.Model(&Tags{}).Delete(&Tags{}, TagId).Error
}

func UserRecharge(UserId, Coins uint) error {
	db := GetDB()
	return db.Model(&User{}).Where("id=?", UserId).Update("coins", gorm.Expr("coins + ?", Coins)).Error
}
