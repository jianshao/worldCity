package service

import (
	"worldCity/model"
)

type MomentSummy struct {
	MomentInfo *model.Moment `json:"moment"`
	Owner      *model.User   `json:"owner"`
	Liked      bool          `json:"liked"`
	LikeCount  uint          `json:"like_count"`
}

// 获取所有moments，不区分是哪个用户发布的
func GetMoments(LoginedUserId uint) ([]MomentSummy, error) {
	moments, err := model.GetMoments(0)
	if err != nil {
		return nil, err
	}

	summy := []MomentSummy{}
	for _, moment := range moments {
		user, err := model.GetUserById(moment.UserID)
		if err != nil {
			return nil, err
		}

		liked, err := model.IsLiked(LoginedUserId, moment.ID)
		likeCount, err := model.GetMomentsLikesCount(moment.ID)
		summy = append(summy, MomentSummy{
			MomentInfo: &moment,
			Owner:      user,
			Liked:      liked,
			LikeCount:  likeCount,
		})
	}
	return summy, nil
}

// 获取指定用户发布的moments
func GetUserMoments(UserId uint) ([]MomentSummy, error) {
	moments, err := model.GetMoments(UserId)
	if err != nil {
		return nil, err
	}

	summy := []MomentSummy{}
	for _, moment := range moments {
		summy = append(summy, MomentSummy{
			MomentInfo: &moment,
			Owner:      nil,
			Liked:      false,
			LikeCount:  0,
		})
	}
	return summy, nil
}

type MomentInfo struct {
	UserId     uint
	Content    string
	Images     []string
	Location   string
	Visibility uint
}

func PostMoment(moment *MomentInfo) (*model.Moment, error) {
	return model.PostMoment(&model.Moment{
		UserID:     moment.UserId,
		Content:    moment.Content,
		Images:     moment.Images,
		Location:   moment.Location,
		Visibility: moment.Visibility,
	})
}

func LikeMoment(UserId, MomentId uint, status bool) (*model.MomentLike, error) {
	return model.LikeMoment(UserId, MomentId, status)
}

func CommentMoment(UserId, MomentId uint, content string) (*model.MomentComment, error) {
	return model.CommentMoment(UserId, MomentId, content)
}

func GetMomentComments(MomentId uint) ([]model.MomentComment, error) {
	return model.GetMomentComments(MomentId)
}
