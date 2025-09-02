package controllers

import (
	"net/http"

	"example.com/sa-gameshop/configs"
    "example.com/sa-gameshop/entity"
	"github.com/gin-gonic/gin"
)

// POST /comments
func CreateComment(c *gin.Context) {
	var body entity.Comment
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad request body"})
		return
	}

	db := configs.DB()

	// เช็ค User
	var user entity.User
	if tx := db.Where("id = ?", body.UserID).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id not found"})
		return
	}

	// เช็ค Thread
	var thread entity.Thread
	if tx := db.Where("id = ?", body.ThreadID).First(&thread); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "thread_id not found"})
		return
	}

	// เช็ค Parent (ถ้ามี)
	if body.ParentCommentID != nil {
		var parent entity.Comment
		if tx := db.Where("id = ?", *body.ParentCommentID).First(&parent); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "parent_comment_id not found"})
			return
		}
	}

	if err := db.Create(&body).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, body)
}

// GET /comments  (optional: ?thread_id=...  ?user_id=... ?parent_id=...)
func FindComments(c *gin.Context) {
	var comments []entity.Comment
	db := configs.DB()

	threadID := c.Query("thread_id")
	userID := c.Query("user_id")
	parentID := c.Query("parent_id")

	tx := db.Preload("User").Preload("Thread").Preload("Parent").Model(&entity.Comment{})
	if threadID != "" {
		tx = tx.Where("thread_id = ?", threadID)
	}
	if userID != "" {
		tx = tx.Where("user_id = ?", userID)
	}
	if parentID != "" {
		tx = tx.Where("parent_comment_id = ?", parentID)
	}

	if err := tx.Find(&comments).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, comments)
}

// GET /comments/:id
func FindCommentByID(c *gin.Context) {
	var cm entity.Comment
	if tx := configs.DB().Preload("User").Preload("Thread").Preload("Parent").First(&cm, c.Param("id")); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, cm)
}

// PUT /comments/:id
func UpdateComment(c *gin.Context) {
	var payload entity.Comment
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db := configs.DB()
	var cm entity.Comment
	if tx := db.First(&cm, c.Param("id")); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	if err := db.Model(&cm).Updates(payload).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "updated successful"})
}

// DELETE /comments/:id
func DeleteCommentByID(c *gin.Context) {
	if tx := configs.DB().Exec("DELETE FROM comments WHERE id = ?", c.Param("id")); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "deleted successful"})
}
