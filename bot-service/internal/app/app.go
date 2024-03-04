package app

import (
	"github.com/EvgeniyBudaev/gravity/bot-service/internal/config"
	"github.com/EvgeniyBudaev/gravity/bot-service/internal/logger"
	"log"
)

type App struct {
	Logger logger.Logger
	config *config.Config
}

func NewApp() *App {
	// Default logger
	defaultLogger, err := logger.NewLogger(logger.GetDefaultLevel())
	if err != nil {
		log.Fatal("error func NewApp, method NewLogger by path internal/app/app.go", err)
	}
	// Config
	cfg, err := config.Load(defaultLogger)
	if err != nil {
		log.Fatal("error func NewApp, method Load by path internal/app/app.go", err)
	}
	// Logger level
	loggerLevel, err := logger.NewLogger(cfg.LoggerLevel)
	if err != nil {
		log.Fatal("error func NewApp, method NewLogger by path internal/app/app.go", err)
	}
	return &App{
		Logger: loggerLevel,
		config: cfg,
	}
}
