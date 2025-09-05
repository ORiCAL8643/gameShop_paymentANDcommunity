// entity/role.go
package entity

import "gorm.io/gorm"

type Role struct {
	gorm.Model
	RoleName    string `json:"role_name"`
	Description string `json:"description"`

	Users []User `gorm:"foreignKey:RoleID" json:"users,omitempty"`
}
