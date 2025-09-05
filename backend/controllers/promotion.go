package controllers

import (
	"net/http"
	"time"

	"example.com/sa-gameshop/configs"
    "example.com/sa-gameshop/entity"
	"github.com/gin-gonic/gin"
)

func CreatePromotion(c *gin.Context) {
	var body entity.Promotion
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad request"})
		return
	}
	// ตรวจผู้สร้าง (User)
	if body.CreatedBy != 0 {
		var u entity.User
		if tx := configs.DB().First(&u, body.CreatedBy); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "createdby not found"})
			return
		}
	}
	// guard เวลา
	if body.StartDate.IsZero() {
		body.StartDate = time.Now()
	}
	if err := configs.DB().Create(&body).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, body)
}

func FindPromotions(c *gin.Context) {
	var rows []entity.Promotion
	db := configs.DB().Preload("Creator")
	active := c.Query("active") // "true" = อยู่ในช่วงวันที่ใช้งาน

	if active == "true" {
		now := time.Now()
		db = db.Where("(start_date IS NULL OR start_date <= ?) AND (end_date IS NULL OR end_date >= ?)", now, now)
	}

	if err := db.Find(&rows).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, rows)
}

func FindPromotionByID(c *gin.Context) {
	var row entity.Promotion
	if tx := configs.DB().Preload("Creator").First(&row, c.Param("id")); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, row)
}

func UpdatePromotion(c *gin.Context) {
	var payload entity.Promotion
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db := configs.DB()
	var row entity.Promotion
	if tx := db.First(&row, c.Param("id")); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	if err := db.Model(&row).Updates(payload).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "updated successful"})
}

func DeletePromotion(c *gin.Context) {
	if tx := configs.DB().Exec("DELETE FROM promotions WHERE id = ?", c.Param("id")); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "deleted successful"})
}
