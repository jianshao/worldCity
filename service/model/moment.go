package model

import (
	"errors"
	"fmt"
	"time"

	"gorm.io/gorm"
)

type Moment struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	UserID     uint      `gorm:"not null;index" json:"user_id"` // 外键字段
	Content    string    `gorm:"type:text;not null" json:"content"`
	Images     []string  `gorm:"type:json;serializer:json" json:"images"` // 推荐使用 GORM serializer
	Location   string    `gorm:"type:varchar(255)" json:"location"`
	Visibility uint      `gorm:"default:0" json:"visibility"` // 0:public 1:followers 2:private
	CreatedAt  time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt  time.Time `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt  time.Time `gorm:"default:NULL" json:"deleted_at"`
}

type MomentLike struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `gorm:"not null;index:idx_user_moment,unique" json:"user_id"`
	MomentID  uint      `gorm:"not null;index:idx_user_moment,unique" json:"moment_id"`
	Status    uint      `gorm:"default:0" json:"status"` // 1: liked, 0: canceled
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt time.Time `gorm:"default:NULL" json:"deleted_at"`
}

type MomentComment struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	MomentID  uint      `gorm:"not null;index" json:"moment_id"`
	UserID    uint      `gorm:"not null;index" json:"user_id"`
	Content   string    `gorm:"type:text;not null" json:"content"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt time.Time `gorm:"default:NULL" json:"deleted_at"`
}

func GetMoments(UserId uint) ([]Moment, error) {
	var moments []Moment
	db := GetDB()
	sqlStr := ""
	if UserId != 0 {
		sqlStr = fmt.Sprintf("user_id = %d", UserId)
	} else {
		sqlStr = "1=1"
	}
	err := db.Model(&Moment{}).Where(sqlStr).Order("created_at desc").Find(&moments).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return nil, err
	}
	return moments, nil
}

func PostMoment(moment *Moment) (*Moment, error) {
	db := GetDB()
	err := db.Create(moment).Error
	if err != nil {
		return nil, err
	}
	return moment, nil
}

func LikeMoment(UserId, MomentId uint, status bool) (*MomentLike, error) {
	var like MomentLike

	db := GetDB()
	err := db.Model(&MomentLike{}).
		Unscoped(). // 包括软删除记录
		Where("user_id = ? AND moment_id = ?", UserId, MomentId).
		First(&like).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// 第一次点赞，插入记录
			newLike := MomentLike{
				UserID:   UserId,
				MomentID: MomentId,
				Status:   1,
			}
			err = db.Create(&newLike).Error
			if err != nil {
				return nil, err
			} else {
				return &newLike, nil
			}
		}
		return nil, err
	}

	newStatus := uint(0)
	if status {
		newStatus = 1
	}

	err = db.Model(&like).Updates(map[string]interface{}{
		"status":     newStatus,
		"deleted_at": gorm.DeletedAt{}, // 清除软删除
	}).Error
	if err != nil {
		return nil, err
	} else {
		return &like, nil
	}
}

func CommentMoment(UserId, MomentId uint, content string) (*MomentComment, error) {
	db := GetDB()
	comment := &MomentComment{
		UserID:   UserId,
		MomentID: MomentId,
		Content:  content,
	}
	err := db.Model(&MomentComment{}).Create(comment).Error
	if err != nil {
		return nil, err
	}
	return comment, nil
}

func GetMomentComments(MomentId uint) ([]MomentComment, error) {
	db := GetDB()
	var comments []MomentComment
	sql := fmt.Sprintf("moment_id=%d", MomentId)
	err := db.Model(&MomentComment{}).Where(sql).Limit(100).Order("created_at desc").Find(&comments).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return nil, err
	}
	return comments, nil
}

func GetMomentsLikesCount(MomentId uint) (uint, error) {
	db := GetDB()
	var count int64
	err := db.Model(&MomentLike{}).Where("moment_id=? and status=1", MomentId).Count(&count).Error
	if err != nil {
		return 0, err
	}
	return uint(count), nil
}

func IsLiked(UserId, MomentId uint) (bool, error) {
	db := GetDB()
	var count int64
	sql := fmt.Sprintf("moment_id=%d and user_id=%d and status=1", MomentId, UserId)
	err := db.Model(&MomentLike{}).Where(sql).Count(&count).Error
	if err != nil {
		return false, err
	}
	if count == 0 {
		return false, nil
	} else {
		return true, nil
	}
}
