package app

import (
	"context"
	"github.com/EvgeniyBudaev/gravity/server-service/internal/entity"
	"github.com/EvgeniyBudaev/gravity/server-service/internal/handler/http"
	"github.com/EvgeniyBudaev/gravity/server-service/internal/middlewares"
	"github.com/EvgeniyBudaev/gravity/server-service/internal/storage/psql"
	"github.com/EvgeniyBudaev/gravity/server-service/internal/usecases"
	"go.uber.org/zap"
)

var prefix = "/api/v1"

func (app *App) StartHTTPServer(ctx context.Context, h *entity.Hub) error {
	app.fiber.Static("/static", "./static")
	done := make(chan struct{})
	im := entity.NewIdentity(app.config, app.Logger)
	pr := psql.NewProfileRepo(app.Logger, app.db.psql)
	imc := usecases.NewUserUseCases(app.Logger, im)
	puc := usecases.NewProfileUseCases(app.Logger, pr, h)
	imh := http.NewUserHandler(app.Logger, imc)
	ph := http.NewProfileHandler(app.Logger, puc)
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
