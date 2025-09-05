// entity/promotion.go
package entity

import (
	"time"

	"gorm.io/gorm"
)

type Promotion struct {
	gorm.Model
	Title        string    `json:"title"`
	Description  string    `json:"description"`
	DiscountValue int      `json:"discount_value"` // คิดเป็นจำนวนเงินหรือเปอร์เซ็นต์แล้วแต่กติกา
	StartDate    time.Time `json:"start_date"`
	EndDate      time.Time `json:"end_date"`
	PromoName    string    `json:"promoname"`

	CreatedBy uint  `json:"createdby"`
	Creator   *User `gorm:"foreignKey:CreatedBy" json:"creator,omitempty"`

	OrderPromotions []OrderPromotion `gorm:"foreignKey:PromotionID" json:"order_promotions,omitempty"`
}
