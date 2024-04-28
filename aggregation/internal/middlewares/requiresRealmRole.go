package middlewares

import (
	"fmt"
	r "github.com/EvgeniyBudaev/gravity/aggregation/internal/handler/http/api/v1"
	"github.com/EvgeniyBudaev/gravity/aggregation/internal/logger"
	"github.com/EvgeniyBudaev/gravity/aggregation/internal/shared/enums"
	"github.com/EvgeniyBudaev/gravity/aggregation/pkg/jwt"
	"github.com/gofiber/fiber/v2"
	golangJwt "github.com/golang-jwt/jwt/v5"
	"go.uber.org/zap"
	"net/http"
)

func NewRequiresRealmRole(role string, logger logger.Logger) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var ctx = c.UserContext()
		claims := ctx.Value(enums.ContextKeyClaims).(golangJwt.MapClaims)
		jwtHelper := jwt.NewHelper(claims)
		if !jwtHelper.IsUserInRealmRole(role) {
			err := fmt.Errorf("role authorization failed")
			logger.Debug("error while NewRequiresRealmRole. Error in IsUserInRealmRole", zap.Error(err))
			return r.WrapError(c, err, http.StatusUnauthorized)
		}
		return c.Next()
	}
}
