package service

import (
	"worldCity/model"
)

func CreateGroup(groupID, name, creatorID string) error {
	db := model.GetDB()

	group := model.Group{
		GroupID:   groupID,
		Name:      name,
		CreatorID: creatorID,
	}
	if err := db.Create(&group).Error; err != nil {
		return err
	}

	// 添加创建者为成员
	member := model.GroupMember{
		GroupID: groupID,
		UserID:  creatorID,
		Role:    "owner",
	}
	return db.Create(&member).Error
}

func AddMember(groupID, userID string) error {
	db := model.GetDB()

	member := model.GroupMember{
		GroupID: groupID,
		UserID:  userID,
		Role:    "member",
	}
	return db.Create(&member).Error
}

func GetGroupMembers(groupID string) ([]model.GroupMember, error) {
	var members []model.GroupMember
	err := model.GetDB().Where("group_id = ?", groupID).Find(&members).Error
	return members, err
}
