package controllers

import (
	"net/http"

	"example.com/go-example-api/configs"
	"example.com/go-example-api/entity"
	"github.com/gin-gonic/gin"
)

// POST /user-games
func CreateUserGame(c *gin.Context) {
	var body entity.UserGame
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad request body"})
		return
	}

	db := configs.DB()
	var user entity.User
	if tx := db.Where("id = ?", body.UserID).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id not found"})
		return
	}
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

// GET /user-games  (optional: ?user_id=... ?game_id=...)
func FindUserGames(c *gin.Context) {
	var rows []entity.UserGame
	db := configs.DB()

	userID := c.Query("user_id")
	gameID := c.Query("game_id")

	tx := db.Preload("User").Preload("Game").Model(&entity.UserGame{})
	if userID != "" {
		tx = tx.Where("user_id = ?", userID)
	}
	if gameID != "" {
		tx = tx.Where("game_id = ?", gameID)
	}

	if err := tx.Find(&rows).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, rows)
}

// GET /user-games/:id
func FindUserGameByID(c *gin.Context) {
	var row entity.UserGame
	if tx := configs.DB().Preload("User").Preload("Game").First(&row, c.Param("id")); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, row)
}

// PUT /user-games/:id
func UpdateUserGame(c *gin.Context) {
	var payload entity.UserGame
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db := configs.DB()
	var row entity.UserGame
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

// DELETE /user-games/:id
func DeleteUserGameByID(c *gin.Context) {
	if tx := configs.DB().Exec("DELETE FROM user_games WHERE id = ?", c.Param("id")); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "deleted successful"})
}
