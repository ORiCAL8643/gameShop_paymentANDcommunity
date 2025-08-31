package entity

import (
	"gorm.io/gorm"
)

type Comment struct {
	gorm.Model
	Content          string    `json:"content"`
	UserID           uint      `json:"user_id"`
	User             *User     `gorm:"foreignKey:UserID" json:"user"`
	ThreadID         uint      `json:"thread_id"`
	Thread           *Thread   `gorm:"foreignKey:ThreadID" json:"thread"`
	ParentCommentID  *uint     `json:"parent_comment_id"` // เป็น nil ถ้าเป็นคอมเมนต์ระดับบน
	Parent           *Comment  `gorm:"foreignKey:ParentCommentID" json:"parent"`

	Replies []Comment `gorm:"foreignKey:ParentCommentID" json:"replies,omitempty"`
}