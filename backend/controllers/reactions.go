package controllers

import (
	"net/http"
	"strings"

	"example.com/go-example-api/configs"
	"example.com/go-example-api/entity"
	"github.com/gin-gonic/gin"
)

func targetExists(targetType string, targetID any) bool {
	db := configs.DB()
	switch strings.ToLower(targetType) {
	case "thread":
		var t entity.Thread
		return db.First(&t, targetID).RowsAffected > 0
	case "comment":
		var m entity.Comment
		return db.First(&m, targetID).RowsAffected > 0
	default:
		return false
	}
}

// POST /reactions
func CreateReaction(c *gin.Context) {
	var body entity.Reaction
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad request body"})
		return
	}

	// เช็ค User
	var user entity.User
	if tx := configs.DB().Where("id = ?", body.UserID).First(&user); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id not found"})
		return
	}
	// เช็คเป้าหมาย
	if !targetExists(body.TargetType, body.TargetID) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid target"})
		return
	}

	if err := configs.DB().Create(&body).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, body)
}

// GET /reactions  (required: ?target_type=...&target_id=... ; optional: ?user_id=...)
func FindReactions(c *gin.Context) {
	var rows []entity.Reaction

	tt := c.Query("target_type")
	tid := c.Query("target_id")
	uid := c.Query("user_id")

	if tt == "" || tid == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "must be parameters 'target_type' and 'target_id'"})
		return
	}

	tx := configs.DB().Model(&entity.Reaction{}).
		Where("target_type = ? AND target_id = ?", tt, tid)
	if uid != "" {
		tx = tx.Where("user_id = ?", uid)
	}

	if err := tx.Find(&rows).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, rows)
}

// GET /reactions/:id
func FindReactionByID(c *gin.Context) {
	var row entity.Reaction
	if tx := configs.DB().First(&row, c.Param("id")); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, row)
}

// PUT /reactions/:id
func UpdateReaction(c *gin.Context) {
	var payload entity.Reaction
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db := configs.DB()
	var row entity.Reaction
	if tx := db.First(&row, c.Param("id")); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	// ถ้าแก้ target ให้เช็คด้วย
	if payload.TargetType != "" || payload.TargetID != 0 {
		tt := payload.TargetType
		if tt == "" {
			tt = row.TargetType
		}
		tid := payload.TargetID
		if tid == 0 {
			tid = row.TargetID
		}
		if !targetExists(tt, tid) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid target"})
			return
		}
	}
	if err := db.Model(&row).Updates(payload).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "updated successful"})
}

// DELETE /reactions/:id
func DeleteReactionByID(c *gin.Context) {
	if tx := configs.DB().Exec("DELETE FROM reactions WHERE id = ?", c.Param("id")); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "deleted successful"})
}
