// entity/game_key.go
package entity

import "gorm.io/gorm"

// คีย์เกมในสต็อก; จะถูกจองให้ OrderItem เมื่อขายสำเร็จ
type GameKey struct {
	gorm.Model
	KeyCode string `json:"key_code"`

	GameID uint  `json:"game_id"`
	Game   *Game `gorm:"foreignKey:GameID" json:"game,omitempty"`

	// ถ้าคีย์นี้ถูกใช้กับออเดอร์ไอเท็มไหน
	OrderItemID *uint      `json:"order_item_id"`
	OrderItem   *OrderItem `gorm:"foreignKey:OrderItemID" json:"order_item,omitempty"`
}
