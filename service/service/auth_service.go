package service

import (
	"context"
	"errors"
	"fmt"
	"time"

	"worldCity/model"
	"worldCity/utils"
)

type RegisterInfo struct {
	Name     string
	Password string
}

func buildCodeKey(phone string) string {
	return fmt.Sprintf("verify:%s", phone)
}

func Register(phone, password string) (map[string]interface{}, error) {
	// 检查是否存在
	ok, err := model.IsUserExisted(phone)
	if err != nil {
		return nil, err
	}
	if ok {
		return nil, errors.New("user already exists")
	}

	// 创建云信用户（后面补充）
	// yunxin.RegisterUser(req.Accid)
	accId := phone

	newUser, err := model.CreateUser(&model.User{
		AccId:    accId,
		Name:     phone,
		Password: utils.HashPassword(password), // demo版直接存密码（正式需要加密）
	})
	if err != nil {
		return nil, err
	}

	token, _ := utils.GenerateToken(uint64(newUser.ID), accId)

	return map[string]interface{}{
		"token": token,
	}, nil
}

func Login(name, password string) (map[string]interface{}, error) {
	user, err := model.GetUserByName(name)
	if err != nil {
		return nil, err
	}

	if user.Password != password {
		return nil, errors.New("incorrect password")
	}

	token, _ := utils.GenerateToken(uint64(user.ID), user.AccId)

	return map[string]interface{}{
		"token": token,
	}, nil
}

func SendCode(phone string) (map[string]interface{}, error) {
	// 检查是否存在
	ok, err := model.IsUserExisted(phone)
	if err != nil {
		return nil, err
	}
	if ok {
		return nil, errors.New("user already exists")
	}

	// 生成一个验证码，并发送给手机号,并保存在redis中
	// code := fmt.Sprintf("%06d", rand.Intn(1000000))
	code := "123456"
	rds := model.GetRds()
	rds.SetEx(context.Background(), buildCodeKey(phone), code, time.Minute*10)

	// 推送给手机号

	return nil, nil
}

func VerifyCode(phone, code string) (map[string]interface{}, error) {
	// 从redis查询对应验证码
	rds := model.GetRds()
	result := rds.Get(context.Background(), buildCodeKey(phone))
	if result.Err() != nil {
		return nil, result.Err()
	}
	return nil, nil
}
