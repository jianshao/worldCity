package user

type ProfileResponse struct {
	Uid      int    `json:"uid"`
	Name     string `json:"name"`
	Nickname string `json:"nickname"`
	Avatar   string `json:"avatar"`
	Coins    int    `json:"coins"`
}

type ProfileUpdateRequest struct {
	Nickname string `json:"nickname"`
	Gender   uint   `json:"gender"`
	Birthday string `json:"birthday"`
	Avatar   string `json:"avatar"`
}
