package main

import (
	"context"
	"github.com/EvgeniyBudaev/gravity/server-service/internal/app"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	ctx, cancel := signal.NotifyContext(context.Background(),
		os.Interrupt, os.Kill, syscall.SIGQUIT, syscall.SIGTERM)
	defer cancel()

	app := app.New()
	app.Run(ctx)
}
