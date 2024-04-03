package main

import (
	"context"
	"fmt"
	"github.com/EvgeniyBudaev/gravity/server-service/internal/app"
	"github.com/EvgeniyBudaev/gravity/server-service/internal/entity/hub"
	"go.uber.org/zap"
	"os/signal"
	"sync"
	"syscall"
)

func main() {
	ctx, cancelCtx := signal.NotifyContext(context.Background(), syscall.SIGQUIT, syscall.SIGTERM, syscall.SIGINT)
	defer cancelCtx()
	var wg sync.WaitGroup
	application := app.NewApp()
	h := hub.NewHub()
	msgChan := make(chan string, 1) // msgChan - канал для передачи сообщений
	wg.Add(1)
	go func() {
		if err := application.StartHTTPServer(ctx, h); err != nil {
			application.Logger.Fatal("error func main, method StartHTTPServer by path cmd/main.go", zap.Error(err))
		}
		wg.Done()
	}()
	go func() {
		if err := application.StartBot(ctx, msgChan); err != nil {
			application.Logger.Fatal("error func main, method StartBot by path cmd/main.go", zap.Error(err))
		}
		wg.Done()
	}()
	wg.Add(1)
	go func() {
		for {
			select {
			case <-ctx.Done():
				wg.Done()
				return
			case c, ok := <-h.Broadcast:
				if !ok {
					h.Broadcast = nil
					continue
				}
				fmt.Println("hub message: ", c)
				msgChan <- c
			}
		}
	}()
	wg.Wait()
}
