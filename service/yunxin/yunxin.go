package yunxin

import (
	"bytes"
	"crypto/md5"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

const (
	YunXinAppKey    = "你的AppKey"
	YunXinAppSecret = "你的AppSecret"
	YunXinAPIBase   = "https://api.netease.im/nimserver"
)

func generateNonce() string {
	b := make([]byte, 16)
	rand.Read(b)
	return hex.EncodeToString(b)
}

func generateCheckSum(nonce, curTime string) string {
	data := YunXinAppSecret + nonce + curTime
	sum := md5.Sum([]byte(data))
	return hex.EncodeToString(sum[:])
}

func DoYunXinPost(path string, body []byte) ([]byte, error) {
	nonce := generateNonce()
	curTime := fmt.Sprintf("%d", time.Now().Unix())
	checkSum := generateCheckSum(nonce, curTime)

	client := &http.Client{}
	req, _ := http.NewRequest("POST", YunXinAPIBase+path, bytes.NewReader(body))

	req.Header.Set("AppKey", YunXinAppKey)
	req.Header.Set("Nonce", nonce)
	req.Header.Set("CurTime", curTime)
	req.Header.Set("CheckSum", checkSum)
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8")

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	return ioutil.ReadAll(resp.Body)
}
