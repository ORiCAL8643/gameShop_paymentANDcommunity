// main.go
package main

import (
	"example.com/sa-gameshop/configs"
    //"example.com/sa-gameshop/entity"
	"example.com/sa-gameshop/controllers"
	"github.com/gin-gonic/gin"
)

const PORT = "8088"

func main() {
	// เชื่อมต่อ DB และตั้งค่าฐานข้อมูล (migrate/seed ตามที่คุณทำไว้ใน configs.SetupDatabase)
	configs.ConnectionDB()
	configs.SetupDatabase()

	r := gin.Default()
	r.Use(CORSMiddleware())

	// health check ง่าย ๆ
	r.GET("/ping", func(c *gin.Context) { c.String(200, "pong") })

	router := r.Group("/")
	{
		// ===== Users =====
		router.POST("/users", controllers.CreateUser)
		router.GET("/users", controllers.FindUsers)
		router.GET("/users/:id", controllers.FindUserByID)
		router.PUT("/users/:id", controllers.UpdateUser)
		router.DELETE("/users/:id", controllers.DeleteUserByID)

		// ===== Games =====
		router.POST("/games", controllers.CreateGame)
		router.GET("/games", controllers.FindGames)
		router.GET("/games/:id", controllers.FindGameByID)
		router.PUT("/games/:id", controllers.UpdateGame)
		router.DELETE("/games/:id", controllers.DeleteGameByID)

		// ===== Threads =====
		router.POST("/threads", controllers.CreateThread)
		router.GET("/threads", controllers.FindThreads)
		router.GET("/threads/:id", controllers.FindThreadByID)
		router.PUT("/threads/:id", controllers.UpdateThread)
		router.DELETE("/threads/:id", controllers.DeleteThreadByID)

		// ===== Comments =====
		router.POST("/comments", controllers.CreateComment)
		router.GET("/comments", controllers.FindComments)
		router.GET("/comments/:id", controllers.FindCommentByID)
		router.PUT("/comments/:id", controllers.UpdateComment)
		router.DELETE("/comments/:id", controllers.DeleteCommentByID)

		// ===== UserGames (สิทธิ์การเป็นเจ้าของเกม) =====
		router.POST("/user-games", controllers.CreateUserGame)
		router.GET("/user-games", controllers.FindUserGames)
		router.GET("/user-games/:id", controllers.FindUserGameByID)
		router.PUT("/user-games/:id", controllers.UpdateUserGame)
		router.DELETE("/user-games/:id", controllers.DeleteUserGameByID)

		// ===== Reactions =====
		router.POST("/reactions", controllers.CreateReaction)
		router.GET("/reactions", controllers.FindReactions)      // ใช้ ?target_type=&target_id=&user_id=
		router.GET("/reactions/:id", controllers.FindReactionByID)
		router.PUT("/reactions/:id", controllers.UpdateReaction)
		router.DELETE("/reactions/:id", controllers.DeleteReactionByID)

		// ===== Attachments =====
		router.POST("/attachments", controllers.CreateAttachment)
		router.GET("/attachments", controllers.FindAttachments)  // ใช้ ?target_type=&target_id=&user_id=
		router.GET("/attachments/:id", controllers.FindAttachmentByID)
		router.PUT("/attachments/:id", controllers.UpdateAttachment)
		router.DELETE("/attachments/:id", controllers.DeleteAttachmentByID)

		// ===== Notifications =====
		router.POST("/notifications", controllers.CreateNotification)
		router.GET("/notifications", controllers.FindNotifications) // ใช้ ?user_id=
		router.GET("/notifications/:id", controllers.FindNotificationByID)
		router.PUT("/notifications/:id", controllers.UpdateNotification)
		router.DELETE("/notifications/:id", controllers.DeleteNotificationByID)

		// Roles
		router.POST("/roles", controllers.CreateRole)
		router.GET("/roles", controllers.FindRoles)
		router.GET("/roles/:id", controllers.FindRoleByID)
		router.PUT("/roles/:id", controllers.UpdateRole)
		router.DELETE("/roles/:id", controllers.DeleteRole)

		// Orders
		router.POST("/orders", controllers.CreateOrder)
		router.GET("/orders", controllers.FindOrders)
		router.GET("/orders/:id", controllers.FindOrderByID)
		router.PUT("/orders/:id", controllers.UpdateOrder)
		router.DELETE("/orders/:id", controllers.DeleteOrder)

		// OrderItems
		router.POST("/order-items", controllers.CreateOrderItem)
		router.GET("/order-items", controllers.FindOrderItems)
		router.PUT("/order-items/:id", controllers.UpdateOrderItem)
		router.DELETE("/order-items/:id", controllers.DeleteOrderItem)

		// GameKeys
		router.POST("/game-keys", controllers.CreateGameKey)
		router.GET("/game-keys", controllers.FindGameKeys)
		router.DELETE("/game-keys/:id", controllers.DeleteGameKey)

		// Payments
		router.POST("/payments", controllers.CreatePayment)
		router.GET("/payments", controllers.FindPayments)
		router.PUT("/payments/:id", controllers.UpdatePayment)
		router.DELETE("/payments/:id", controllers.DeletePayment)

		// PaymentSlips
		router.POST("/payment-slips", controllers.CreatePaymentSlip)
		router.GET("/payment-slips", controllers.FindPaymentSlips)
		router.DELETE("/payment-slips/:id", controllers.DeletePaymentSlip)

		// PaymentReviews
		router.POST("/payment-reviews", controllers.CreatePaymentReview)
		router.GET("/payment-reviews", controllers.FindPaymentReviews)
		router.DELETE("/payment-reviews/:id", controllers.DeletePaymentReview)

		// Promotions
		router.POST("/promotions", controllers.CreatePromotion)
		router.GET("/promotions", controllers.FindPromotions)
		router.GET("/promotions/:id", controllers.FindPromotionByID)
		router.PUT("/promotions/:id", controllers.UpdatePromotion)
		router.DELETE("/promotions/:id", controllers.DeletePromotion)

		// OrderPromotions
		router.POST("/order-promotions", controllers.CreateOrderPromotion)
		router.GET("/order-promotions", controllers.FindOrderPromotions)
		router.DELETE("/order-promotions/:id", controllers.DeleteOrderPromotion)
	}

	// Run the server
	// แก้สเปซตรง "localhost:" ให้ถูกต้อง
	r.Run("localhost:" + PORT)
}

// CORS แบบเดียวกับตัวอย่างที่แนบมา
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}
