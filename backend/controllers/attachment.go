package controllers

import (
	"net/http"
	"strings"

	"example.com/go-example-api/configs"
	"example.com/go-example-api/entity"
	"github.com/gin-gonic/gin"
)

func attachmentTargetExists(targetType string, targetID any) bool {
	switch strings.ToLower(targetType) {
	case "thread":
		var t entity.Thread
		return configs.DB().First(&t, targetID).RowsAffected > 0
	case "comment":
		var m entity.Comment
		return configs.DB().First(&m, targetID).RowsAffected > 0
	default:
		return false
	}
}

// POST /attachments
func CreateAttachment(c *gin.Context) {
	var body entity.Attachment
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
	// เช็ค Target
	if !attachmentTargetExists(body.TargetType, body.TargetID) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid target"})
		return
	}

	if err := configs.DB().Create(&body).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, body)
}

// GET /attachments (required: ?target_type=...&target_id=... ; optional: ?user_id=...)
func FindAttachments(c *gin.Context) {
	var rows []entity.Attachment
	tt := c.Query("target_type")
	tid := c.Query("target_id")
	uid := c.Query("user_id")

	if tt == "" || tid == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "must be parameters 'target_type' and 'target_id'"})
		return
	}

	tx := configs.DB().Preload("User").Model(&entity.Attachment{}).
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

// GET /attachments/:id
func FindAttachmentByID(c *gin.Context) {
	var row entity.Attachment
	if tx := configs.DB().Preload("User").First(&row, c.Param("id")); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, row)
}

// PUT /attachments/:id
func UpdateAttachment(c *gin.Context) {
	var payload entity.Attachment
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db := configs.DB()
	var row entity.Attachment
	if tx := db.First(&row, c.Param("id")); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	// ถ้าแก้ target ให้ตรวจสอบเหมือนเดิม
	if payload.TargetType != "" || payload.TargetID != 0 {
		tt := payload.TargetType
		if tt == "" {
			tt = row.TargetType
		}
		tid := payload.TargetID
		if tid == 0 {
			tid = row.TargetID
		}
		if !attachmentTargetExists(tt, tid) {
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

// DELETE /attachments/:id
func DeleteAttachmentByID(c *gin.Context) {
	if tx := configs.DB().Exec("DELETE FROM attachments WHERE id = ?", c.Param("id")); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "deleted successful"})
}
