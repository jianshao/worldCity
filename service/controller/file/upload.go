package file

import (
	"github.com/gin-gonic/gin"
)

func UploadFile(c *gin.Context) {
	// file, header, err := c.Request.FormFile("file")
	// if err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "no file uploaded"})
	// 	return
	// }
	// defer file.Close()

	// // 生成唯一文件名
	// now := time.Now()
	// fileName := now.Format("20060102/150405") + "_" + header.Filename

	// url, err := utils.UploadToOSS(file, fileName)
	// if err != nil {
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	// 	return
	// }

	// c.JSON(http.StatusOK, gin.H{
	// 	"url": url,
	// })
}
