package entity

import (
	"gorm.io/gorm"
)


type Reaction struct {
	gorm.Model
	TargetType string `json:"target_type"` // "thread" | "comment" | อื่น ๆ
	TargetID   uint   `json:"target_id"`
	Type       string `json:"type"`        // "like", "love", ...
	UserID     uint   `json:"user_id"`
	User       *User  `gorm:"foreignKey:UserID" json:"user"`
}