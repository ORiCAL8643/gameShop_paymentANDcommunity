// configs/migrate_payment.go
package configs

import (
	"example.com/sa-gameshop/entity"
	"gorm.io/gorm"
)

// รวมเฉพาะตารางของ Payment
func AutoMigratePayment(db *gorm.DB) error {
	return db.AutoMigrate(
		&entity.Role{},           // ใช้กับ User.RoleID
		&entity.Order{},
		&entity.OrderItem{},
		&entity.GameKey{},
		&entity.Payment{},
		&entity.PaymentSlip{},
		&entity.PaymentReview{},
		&entity.Promotion{},
		&entity.OrderPromotion{},
	)
}
