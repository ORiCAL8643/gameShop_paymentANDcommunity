// configs/migrate_community.go
package configs

import (
	"example.com/sa-gameshop/entity"
	"gorm.io/gorm"
)

// รวมเฉพาะตารางของ Community
func AutoMigrateCommunity(db *gorm.DB) error {
	return db.AutoMigrate(
		&entity.User{},
		&entity.Game{},
		&entity.Thread{},
		&entity.UserGame{},
		&entity.Comment{},
		&entity.Reaction{},
		&entity.Attachment{},
		&entity.Notification{},
	)
}
