package utils

import (
	"crypto/sha1"
	"encoding/hex"

	"golang.org/x/crypto/bcrypt"
)

func Sha1(s string) string {
	h := sha1.New()
	h.Write([]byte(s))
	return hex.EncodeToString(h.Sum(nil))
}

func HashPassword(password string) string {
	hash, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(hash)
}
