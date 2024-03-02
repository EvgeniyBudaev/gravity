package main

import (
	"github.com/EvgeniyBudaev/gravity/server-service/internal/app"
	"go.uber.org/zap"
)

func main() {
	application := app.NewApp()
	if err := application.StartHTTPServer(); err != nil {
		application.Logger.Fatal("error func main, method StartHTTPServer by path cmd/main.go", zap.Error(err))
	}
}
