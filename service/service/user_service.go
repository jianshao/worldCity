package service

import "worldCity/model"

func GetUserProfile(UserId uint) (map[string]interface{}, error) {
	user, err := model.GetUserById(UserId)
	if err != nil {
		return nil, err
	}
	tags, err := model.GetTagsByUserId(UserId)
	if err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"id":       user.ID,
		"nickname": user.Nickname,
		"gender":   user.Gender,
		"avatar":   user.Avatar,
		"height":   user.Height,
		"weight":   user.Weight,
		"photos":   user.Photos,
		"birthday": user.Birthday,
		"coins":    user.Coins,
		"tags":     tags,
		"desc":     user.Desc,
		"videos":   user.Videos,
	}, nil
}

func UpdateProfile(uid uint, avatar, nickname string, gender uint) (map[string]interface{}, error) {
	user := &model.User{
		Nickname: nickname,
		Gender:   gender,
		Avatar:   avatar,
	}
	user.ID = uid
	user, err := model.UpdateUserInfo(user)
	if err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"id":       user.ID,
		"nickname": user.Nickname,
		"gender":   user.Gender,
		"avatar":   user.Avatar,
		"height":   user.Height,
		"weight":   user.Weight,
		"photos":   user.Photos,
		"birthday": user.Birthday,
		"coins":    user.Coins,
		"desc":     user.Desc,
		"videos":   user.Videos,
	}, nil
}

func GetUserList(PageNum, PageSize uint) (map[string]interface{}, error) {
	users, err := model.GetUserList(PageNum, PageSize)
	if err != nil {
		return nil, err
	}
	return map[string]interface{}{
		"count": len(users),
		"users": users,
	}, nil
}

type TagInfo struct {
	UserId uint
	Tag    string
}

func GetTags(UserId uint) ([]model.Tags, error) {
	return model.GetTagsByUserId(UserId)
}

func CreateTag(UserId uint, Tag string) (*model.Tags, error) {
	return model.CreateTag(UserId, Tag)
}

func DeleteTag(TagId uint) error {
	return model.DeleteTag(TagId)
}

func UserRecharge(UserId, Coins uint) error {
	return model.UserRecharge(UserId, Coins)
}
