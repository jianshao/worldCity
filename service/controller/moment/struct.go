package controller

type MomentRequest struct {
	Content    string   `json:"content"`
	Images     []string `json:"images"`
	Visibility uint     `json:"visibility"`
}
