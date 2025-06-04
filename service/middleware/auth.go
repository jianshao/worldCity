package middleware

import (
	"net/http"
	"strings"
	"worldCity/utils"

	"github.com/gin-gonic/gin"
)

const (
	UID_KEY = "userID"
)

func JWTAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "No token"})
			// c.Abort()
			return
		}

		token = strings.TrimPrefix(token, "Bearer ")

		claims, err := utils.ParseToken(token)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		c.Set(UID_KEY, claims.UserID)
		c.Set("accid", claims.Accid)
		c.Next()
	}
}

func GetUserIdFromToken(c *gin.Context) uint {
	return uint(c.GetUint64(UID_KEY))
}
