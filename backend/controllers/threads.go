package controllers

import (
	"net/http"

	"example.com/go-example-api/configs"
	"example.com/go-example-api/entity"
	"github.com/gin-gonic/gin"
)

// POST /threads
func CreateThread(c *gin.Context) {
	var body entity.Thread
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad request body"})
		return
	}

	db := configs.DB()
	// เช็ค FK: UserID
	var user entity.User
	if tx := db.Where("id = ?", body.UserID).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id not found"})
		return
	}
	// เช็ค FK: GameID
	var game entity.Game
	if tx := db.Where("id = ?", body.GameID).First(&game); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "game_id not found"})
		return
	}

	if err := db.Create(&body).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, body)
}

// GET /threads  (optional: ?user_id=...  ?game_id=...)
func FindThreads(c *gin.Context) {
	var threads []entity.Thread
	db := configs.DB()

	userID := c.Query("user_id")
	gameID := c.Query("game_id")

	tx := db.Preload("User").Preload("Game").Model(&entity.Thread{})
	if userID != "" {
		tx = tx.Where("user_id = ?", userID)
	}
	if gameID != "" {
		tx = tx.Where("game_id = ?", gameID)
	}

	if err := tx.Find(&threads).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, threads)
}

// GET /threads/:id
func FindThreadByID(c *gin.Context) {
	var thread entity.Thread
	id := c.Param("id")
	if tx := configs.DB().Preload("User").Preload("Game").First(&thread, id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, thread)
}

// PUT /threads/:id
func UpdateThread(c *gin.Context) {
	var payload entity.Thread
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db := configs.DB()
	var thread entity.Thread
	if tx := db.First(&thread, c.Param("id")); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	if err := db.Model(&thread).Updates(payload).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "updated successful"})
}

// DELETE /threads/:id
func DeleteThreadByID(c *gin.Context) {
	if tx := configs.DB().Exec("DELETE FROM threads WHERE id = ?", c.Param("id")); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "deleted successful"})
}
