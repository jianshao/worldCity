package model

import "time"

type Category struct {
	ID        uint      `gorm:"primary,unique" json:"id"`
	Name      string    `gorm:"size:64;not null;unique" json:"name"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt time.Time `gorm:"default:NULL" json:"deleted_at"`
}

func CreateCategory(obj *Category) error {
	return db.Create(obj).Error
}

func GetAllCategories() ([]Category, error) {
	var list []Category
	err := db.Find(&list).Error
	return list, err
}

func GetCategoryByID(id uint) (*Category, error) {
	var obj Category
	err := db.First(&obj, id).Error
	return &obj, err
}

func UpdateCategory(id uint, updates map[string]interface{}) error {
	return db.Model(&Category{}).Where("id = ?", id).Updates(updates).Error
}

func DeleteCategory(id uint) error {
	return db.Delete(&Category{}, id).Error
}
