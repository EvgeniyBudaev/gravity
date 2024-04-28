package app

import (
	"context"
	"github.com/EvgeniyBudaev/gravity/aggregation/internal/config"
	"github.com/EvgeniyBudaev/gravity/aggregation/internal/entity"
	"github.com/EvgeniyBudaev/gravity/aggregation/internal/logger"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"go.uber.org/zap"
	"log"
	"sync"
)

// App - application structure
type App struct {
	Logger logger.Logger
	config *config.Config
	db     *Database
	fiber  *fiber.App
}

func New() *App {
	// Default logger
	defaultLogger, err := logger.New(logger.GetDefaultLevel())
	if err != nil {
		log.Fatal("error func New, method NewLogger by path internal/app/app.go", err)
	}
	// Config
	cfg, err := config.Load(defaultLogger)
	if err != nil {
		log.Fatal("error func New, method Load by path internal/app/app.go", err)
	}
	// Logger level
	loggerLevel, err := logger.New(cfg.LoggerLevel)
	if err != nil {
		log.Fatal("error func New, method NewLogger by path internal/app/app.go", err)
	}
	// Database connection
	postgresConnection, err := newPostgresConnection(cfg)
	if err != nil {
		log.Fatal("error func New, method newPostgresConnection by path internal/app/app.go", err)
	}
	database := NewDatabase(loggerLevel, postgresConnection)
	err = postgresConnection.Ping()
	if err != nil {
		log.Fatal("error func New, method NewDatabase by path internal/app/app.go", err)
	}
	// Fiber
	f := fiber.New(fiber.Config{
		ReadBufferSize: 4 << 12,
	})
	// CORS
	f.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Content-Type, X-Requested-With, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))
	return &App{
		config: cfg,
		db:     database,
		Logger: loggerLevel,
		fiber:  f,
	}
}

// Run launches the application
func (app *App) Run(ctx context.Context) {
	var wg sync.WaitGroup
	h := entity.NewHub()
	msgChan := make(chan *entity.Content, 1) // msgChan - канал для передачи сообщений
	wg.Add(1)
	go func() {
		if err := app.StartHTTPServer(ctx, h); err != nil {
			app.Logger.Fatal("error func main, method StartHTTPServer by path cmd/main.go", zap.Error(err))
		}
		wg.Done()
	}()
	go func() {
		if err := app.StartBot(ctx, msgChan); err != nil {
			app.Logger.Fatal("error func main, method StartBot by path cmd/main.go", zap.Error(err))
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
				msgChan <- c
			}
		}
	}()
	wg.Wait()
}
