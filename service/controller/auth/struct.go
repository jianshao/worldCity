package auth

type LoginRequest struct {
	Name     string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}
type SendCodeRequest struct {
	Phone string `json:"phone" binding:"required"`
}
type RegisterRequest struct {
	Phone    string `json:"phone" binding:"required"`
	Password string `json:"password" binding:"required"`
}
type VerifyCodeRequest struct {
	Phone string `json:"phone" binding:"required"`
	Code  string `json:"code" binding:"required"`
}
