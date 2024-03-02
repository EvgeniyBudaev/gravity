package middlewares

import (
	"context"
	"github.com/EvgeniyBudaev/gravity/server-service/internal/config"
	"github.com/EvgeniyBudaev/gravity/server-service/internal/entity/identity"
	"github.com/EvgeniyBudaev/gravity/server-service/internal/handler/profile"
	"github.com/EvgeniyBudaev/gravity/server-service/internal/handler/user"
	"github.com/EvgeniyBudaev/gravity/server-service/internal/logger"
	"github.com/EvgeniyBudaev/gravity/server-service/internal/shared/enums"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/requestid"
)

func InitFiberMiddlewares(app *fiber.App,
	cfg *config.Config,
	l logger.Logger,
	grp fiber.Router,
	imh *user.HandlerUser,
	ph *profile.HandlerProfile,
	initPublicRoutes func(grp fiber.Router, imh *user.HandlerUser, ph *profile.HandlerProfile),
	initProtectedRoutes func(grp fiber.Router, ph *profile.HandlerProfile)) {
	app.Use(requestid.New())
	app.Use(func(c *fiber.Ctx) error {
		// get the request id that was added by requestid middleware
		var requestId = c.Locals("requestid")
		// create a new context and add the requestid to it
		var ctx = context.WithValue(context.Background(), enums.ContextKeyRequestId, requestId)
		c.SetUserContext(ctx)
		return c.Next()
	})
	// routes that don't require a JWT token
	initPublicRoutes(grp, imh, ph)
	tokenRetrospector := identity.NewIdentity(cfg, l)
	app.Use(NewJwtMiddleware(cfg, tokenRetrospector, l))
	// routes that require authentication/authorization
	initProtectedRoutes(grp, ph)
}
