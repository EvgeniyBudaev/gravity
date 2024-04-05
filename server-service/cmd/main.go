// Package main is the entry point of the program
package main

import (
	"context"
	"github.com/EvgeniyBudaev/gravity/server-service/internal/app"
	"os/signal"
	"syscall"
)

// main is the entry point of the program
func main() {
	ctx, cancelCtx := signal.NotifyContext(context.Background(), syscall.SIGQUIT, syscall.SIGTERM, syscall.SIGINT)
	defer cancelCtx()
	application := app.NewApp()
	application.Run(ctx)
}
