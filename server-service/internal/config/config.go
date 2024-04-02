package config

import (
	"github.com/EvgeniyBudaev/gravity/server-service/internal/logger"
	"github.com/joho/godotenv"
	"github.com/kelseyhightower/envconfig"
	"go.uber.org/zap"
)

type Config struct {
	Port                string `envconfig:"PORT"`
	LoggerLevel         string `envconfig:"LOGGER_LEVEL"`
	Host                string `envconfig:"HOST"`
	DBPort              string `envconfig:"POSTGRES_PORT"`
	DBUser              string `envconfig:"POSTGRES_USER"`
	DBPassword          string `envconfig:"POSTGRES_PASSWORD"`
	DBName              string `envconfig:"POSTGRES_NAME"`
	DBSSlMode           string `envconfig:"POSTGRES_SSLMODE"`
	JWTSecret           string `envconfig:"JWT_SECRET"`
	JWTIssuer           string `envconfig:"JWT_ISSUER"`
	JWTAudience         string `envconfig:"JWT_AUDIENCE"`
	CookieDomain        string `envconfig:"COOKIE_DOMAIN"`
	Domain              string `envconfig:"DOMAIN"`
	BaseUrl             string `envconfig:"KEYCLOAK_BASE_URL"`
	Realm               string `envconfig:"KEYCLOAK_REALM"`
	ClientId            string `envconfig:"KEYCLOAK_CLIENT_ID"`
	ClientSecret        string `envconfig:"KEYCLOAK_CLIENT_SECRET"`
	RealmRS256PublicKey string `envconfig:"KEYCLOAK_REALM_RS256_PUBLIC_KEY"`
	TelegramBotToken    string `envconfig:"TELEGRAM_BOT_TOKEN"`
}

func Load(l logger.Logger) (*Config, error) {
	var cfg Config
	if err := godotenv.Load(); err != nil {
		l.Debug("error func Load, method Load by path internal/config/config.go", zap.Error(err))
		return nil, err
	}
	err := envconfig.Process("MYAPP", &cfg)
	if err != nil {
		l.Debug("error func Load, method Process by path internal/config/config.go", zap.Error(err))
		return nil, err
	}
	return &cfg, nil
}
