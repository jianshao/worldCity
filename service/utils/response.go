package utils

type ApiResponse struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

const (
	ErrBadRequest = 1
	ErrInternal   = 2
)

func BuildFailResp(code int, message string) *ApiResponse {
	return &ApiResponse{
		Code:    code,
		Message: message,
	}
}

func BuildOkResp(data interface{}) *ApiResponse {
	return &ApiResponse{
		Code:    0,
		Message: "",
		Data:    data,
	}
}
