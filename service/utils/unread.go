package utils

import (
	"fmt"
)

func GetUnreadKey(userID uint) string {
	return fmt.Sprintf("unread:%d", userID)
}
