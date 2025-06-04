package utils

import (
	"encoding/json"
	"fmt"
	"worldCity/yunxin"
)

// url := "https://api.netease.im/nimserver/msg/sendMsg.action"
func SendYunxinMsg(fromID, toID uint, msgType, content string) error {

	reqBody := map[string]interface{}{
		"from": fmt.Sprintf("%d", fromID),
		"ope":  0,
		"to":   fmt.Sprintf("%d", toID),
		"type": 0, // 文本消息
		"body": fmt.Sprintf(`{"msg":"%s"}`, content),
	}

	data, err := json.Marshal(reqBody)
	if err == nil {
		_, err = yunxin.DoYunXinPost("/msg/sendMsg.action", data)
	}
	return err
}
