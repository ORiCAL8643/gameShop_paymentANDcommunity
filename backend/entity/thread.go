package entity

import (
	"gorm.io/gorm"
)


type Thread struct {
	gorm.Model
	Title    string `json:"title"`
	Content  string `json:"content"`
	UserID   uint   `json:"user_id"`
	User     *User  `gorm:"foreignKey:UserID" json:"user"`
	GameID   uint   `json:"game_id"`
	Game     *Game  `gorm:"foreignKey:GameID" json:"game"`

	Comments []Comment `gorm:"foreignKey:ThreadID" json:"comments,omitempty"`
}