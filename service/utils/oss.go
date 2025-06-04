package utils

// func UploadToOSS(file multipart.File, fileName string) (string, error) {
// 	conf := config.GetConf()
// 	client, err := oss.New(conf.OSS.Endpoint, conf.OSS.AccessKey, conf.OSS.SecretKey)
// 	if err != nil {
// 		return "", err
// 	}

// 	bucket, err := client.Bucket(conf.OSS.Bucket)
// 	if err != nil {
// 		return "", err
// 	}

// 	err = bucket.PutObject(fileName, file)
// 	if err != nil {
// 		return "", err
// 	}

// 	// 返回完整URL
// 	url := fmt.Sprintf("%s/%s", conf.OSS.Domain, fileName)
// 	return url, nil
// }
