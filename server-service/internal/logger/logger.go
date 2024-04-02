package logger

import (
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

type Logger interface {
	Debug(string, ...zapcore.Field)
	Info(string, ...zapcore.Field)
	Error(string, ...zapcore.Field)
	Fatal(string, ...zapcore.Field)
}

func NewLogger(level string) (Logger, error) {
	lvl, err := zap.ParseAtomicLevel(level)
	if err != nil {
		return nil, err
	}
	cfg := zap.NewDevelopmentConfig()
	cfg.Level = lvl
	zl, err := cfg.Build()
	if err != nil {
		return nil, err
	}
	return zl, nil
}

func GetDefaultLevel() string {
	return "DEBUG"
}

// RequestLogger — middleware-логер для входящих HTTP-запросов
func RequestLogger(logger Logger) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Логируем информацию о запросе
		logger.Error("New request",
			zap.String("method", c.Method()),
			zap.String("path", c.Path()),
		)

		// Продолжаем обработку запроса
		return c.Next()
	}
}
