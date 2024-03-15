package app

import (
	"context"
	"github.com/EvgeniyBudaev/gravity/server-service/internal/config"
	"github.com/EvgeniyBudaev/gravity/server-service/internal/logger"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
	"log"
)

type App struct {
	Logger logger.Logger
	config *config.Config
	db     *Database
	fiber  *fiber.App
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
	// Database connection
	postgresConnection, err := newPostgresConnection(cfg)
	if err != nil {
		log.Fatal("error func NewApp, method newPostgresConnection by path internal/app/app.go", err)
	}
	database := NewDatabase(loggerLevel, postgresConnection)
	err = postgresConnection.Ping()
	if err != nil {
		log.Fatal("error func NewApp, method NewDatabase by path internal/app/app.go", err)
	}
	// Fiber
	f := fiber.New(fiber.Config{
		ReadBufferSize: 16384,
	})
	// CORS
	f.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Content-Type, X-Requested-With, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))
	// RabbitMQ
	conn, err := amqp.Dial("amqp://guest:guest@:15672/")
	if err != nil {
		log.Fatal("error func NewApp, method amqp.Dial by path internal/app/app.go", err)
	}
	defer conn.Close()
	ch, err := conn.Channel()
	if err != nil {
		log.Fatal("error func NewApp, method conn.Channel by path internal/app/app.go", err)
	}
	defer ch.Close()
	q, err := ch.QueueDeclare(
		"hello", // name
		false,   // durable
		false,   // delete when unused
		false,   // exclusive
		false,   // no-wait
		nil,     // arguments
	)
	if err != nil {
		log.Fatal("error func NewApp, method ch.QueueDeclare by path internal/app/app.go", err)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	body := "Hello World!"
	err = ch.PublishWithContext(ctx,
		"",     // exchange
		q.Name, // routing key
		false,  // mandatory
		false,  // immediate
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        []byte(body),
		})
	if err != nil {
		log.Fatal("error func NewApp, method ch.PublishWithContext by path internal/app/app.go", err)
	}
	log.Printf(" [x] Sent %s\n", body)
	log.Printf("Starting server service on port %s\n", cfg.Port)
	return &App{
		config: cfg,
		db:     database,
		Logger: loggerLevel,
		fiber:  f,
	}
}
