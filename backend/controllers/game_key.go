package controllers

import (
	"net/http"

	"example.com/sa-gameshop/configs"
    "example.com/sa-gameshop/entity"
	"github.com/gin-gonic/gin"
)

func CreateGameKey(c *gin.Context) {
	var body entity.GameKey
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad request"})
		return
	}
	// ตรวจ Game
	var g entity.Game
	if tx := configs.DB().First(&g, body.GameID); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "game_id not found"})
		return
	}
	if err := configs.DB().Create(&body).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, body)
}

func FindGameKeys(c *gin.Context) {
	var rows []entity.GameKey
	db := configs.DB().Preload("Game").Preload("OrderItem")

	gameID := c.Query("game_id")
	available := c.Query("available") // "true" = ยังไม่ถูกจองให้ OrderItem

	if gameID != "" {
		db = db.Where("game_id = ?", gameID)
	}
	if available == "true" {
		db = db.Where("order_item_id IS NULL")
	}
	if err := db.Find(&rows).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, rows)
}

func DeleteGameKey(c *gin.Context) {
	if tx := configs.DB().Exec("DELETE FROM game_keys WHERE id = ?", c.Param("id")); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "deleted successful"})
}
