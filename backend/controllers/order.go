package controllers

import (
	"net/http"
	"time"

	"example.com/sa-gameshop/configs"
    "example.com/sa-gameshop/entity"
	"github.com/gin-gonic/gin"
)

func CreateOrder(c *gin.Context) {
	var body entity.Order
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad request"})
		return
	}
	// ตรวจ User
	var user entity.User
	if tx := configs.DB().First(&user, body.UserID); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id not found"})
		return
	}
	if body.OrderCreate.IsZero() {
		body.OrderCreate = time.Now()
	}
	if err := configs.DB().Create(&body).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, body)
}

func FindOrders(c *gin.Context) {
	var rows []entity.Order
	db := configs.DB().Preload("User").Preload("OrderItems").Preload("Payments").Preload("OrderPromotions")
	userID := c.Query("user_id")
	status := c.Query("status")
	if userID != "" {
		db = db.Where("user_id = ?", userID)
	}
	if status != "" {
		db = db.Where("order_status = ?", status)
	}
	if err := db.Find(&rows).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, rows)
}

func FindOrderByID(c *gin.Context) {
	var row entity.Order
	if tx := configs.DB().
		Preload("User").
		Preload("OrderItems.GameKey").
		Preload("Payments.PaymentSlips").
		Preload("OrderPromotions.Promotion").
		First(&row, c.Param("id")); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, row)
}

func UpdateOrder(c *gin.Context) {
	var payload entity.Order
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var row entity.Order
	db := configs.DB()
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

func DeleteOrder(c *gin.Context) {
	if tx := configs.DB().Exec("DELETE FROM orders WHERE id = ?", c.Param("id")); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "deleted successful"})
}
