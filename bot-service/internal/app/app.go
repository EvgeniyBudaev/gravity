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
	// RabbitMQ
	//conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	//if err != nil {
	//	log.Fatal("error func NewApp, method amqp.Dial by path internal/app/app.go", err)
	//}
	//defer conn.Close()
	//ch, err := conn.Channel()
	//if err != nil {
	//	log.Fatal("error func NewApp, method conn.Channel by path internal/app/app.go", err)
	//}
	//defer ch.Close()
	//queueName := "hello"
	//q, err := ch.QueueDeclare(
	//	queueName, // name
	//	false,     // durable
	//	false,     // delete when unused
	//	false,     // exclusive
	//	false,     // no-wait
	//	nil,       // arguments
	//)
	//if err != nil {
	//	log.Fatal("error func NewApp, method ch.QueueDeclare by path internal/app/app.go", err)
	//}
	//messages, err := ch.Consume(
	//	q.Name, // queue
	//	"",     // consumer
	//	true,   // auto-ack
	//	false,  // exclusive
	//	false,  // no-local
	//	false,  // no-wait
	//	nil,    // args
	//)
	//if err != nil {
	//	log.Fatal("error func NewApp, method ch.Consume by path internal/app/app.go", err)
	//}
	//var forever chan struct{}
	//go func() {
	//	for message := range messages {
	//		log.Printf("received a message: %s", message.Body)
	//	}
	//}()
	//log.Printf(" [*] Waiting for messages. To exit press CTRL+C")
	//<-forever
	log.Printf("Starting http server...")
	return &App{
		Logger: loggerLevel,
		config: cfg,
	}
}
