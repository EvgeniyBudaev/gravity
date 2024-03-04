package app

import (
	profileRepo "github.com/EvgeniyBudaev/gravity/server-service/internal/adapter/psqlRepo/profile"
	identityEntity "github.com/EvgeniyBudaev/gravity/server-service/internal/entity/identity"
	profileHandler "github.com/EvgeniyBudaev/gravity/server-service/internal/handler/profile"
	userHandler "github.com/EvgeniyBudaev/gravity/server-service/internal/handler/user"
	"github.com/EvgeniyBudaev/gravity/server-service/internal/middlewares"
	profileUseCase "github.com/EvgeniyBudaev/gravity/server-service/internal/useCase/profile"
	userUseCase "github.com/EvgeniyBudaev/gravity/server-service/internal/useCase/user"
	"go.uber.org/zap"
)

var prefix = "/api/v1"

func (app *App) StartHTTPServer() error {
	app.fiber.Static("/static", "./static")
	im := identityEntity.NewIdentity(app.config, app.Logger)
	pr := profileRepo.NewRepositoryProfile(app.Logger, app.db.psql)
	imc := userUseCase.NewUseCaseUser(app.Logger, im)
	puc := profileUseCase.NewUseCaseProfile(app.Logger, pr)
	imh := userHandler.NewHandlerUser(app.Logger, imc)
	ph := profileHandler.NewHandlerProfile(app.Logger, puc)
	grp := app.fiber.Group(prefix)
	middlewares.InitFiberMiddlewares(
		app.fiber, app.config, app.Logger, grp, imh, ph, InitPublicRoutes, InitProtectedRoutes)
	if err := app.fiber.Listen(app.config.Port); err != nil {
		app.Logger.Fatal("error func StartHTTPServer, method Listen by path internal/app/http.go", zap.Error(err))
	}
	return nil
}
