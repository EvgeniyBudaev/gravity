package app

import (
	"context"
	profileRepo "github.com/EvgeniyBudaev/gravity/server-service/internal/adapter/psqlRepo/profile"
	"github.com/EvgeniyBudaev/gravity/server-service/internal/entity/hub"
	identityEntity "github.com/EvgeniyBudaev/gravity/server-service/internal/entity/identity"
	profileHandler "github.com/EvgeniyBudaev/gravity/server-service/internal/handler/profile"
	userHandler "github.com/EvgeniyBudaev/gravity/server-service/internal/handler/user"
	"github.com/EvgeniyBudaev/gravity/server-service/internal/middlewares"
	profileUseCase "github.com/EvgeniyBudaev/gravity/server-service/internal/useCase/profile"
	userUseCase "github.com/EvgeniyBudaev/gravity/server-service/internal/useCase/user"
	"go.uber.org/zap"
)

var prefix = "/api/v1"

func (app *App) StartHTTPServer(ctx context.Context, h *hub.Hub) error {
	app.fiber.Static("/static", "./static")
	done := make(chan struct{})
	im := identityEntity.NewIdentity(app.config, app.Logger)
	pr := profileRepo.NewRepositoryProfile(app.Logger, app.db.psql)
	imc := userUseCase.NewUseCaseUser(app.Logger, im)
	puc := profileUseCase.NewUseCaseProfile(app.Logger, pr, h)
	imh := userHandler.NewHandlerUser(app.Logger, imc)
	ph := profileHandler.NewHandlerProfile(app.Logger, puc)
	grp := app.fiber.Group(prefix)
	middlewares.InitFiberMiddlewares(
		app.fiber, app.config, app.Logger, grp, imh, ph, InitPublicRoutes, InitProtectedRoutes)
	go func() {
		if err := app.fiber.Listen(app.config.Port); err != nil {
			app.Logger.Fatal("error func StartHTTPServer, method Listen by path internal/app/http.go", zap.Error(err))
		}
		close(done)
	}()
	select {
	case <-ctx.Done():
		if err := app.fiber.Shutdown(); err != nil {
			app.Logger.Error("error func StartHTTPServer, method Shutdown by path internal/app/http.go,"+
				" error shutting down the server", zap.Error(err))
		}
	case <-done:
		app.Logger.Info("server finished successfully")
	}
	return nil
}
