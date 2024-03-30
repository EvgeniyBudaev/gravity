Инициализация зависимостей

```
go mod init github.com/EvgeniyBudaev/gravity/server-service
```

Сборка

```
go build -v ./cmd/
```

Удаление неиспользуемых зависимостей

```
go mod tidy -v
```

Библиотека для работы с переменными окружения ENV
https://github.com/joho/godotenv

```
go get -u github.com/joho/godotenv
```

ENV Config
https://github.com/kelseyhightower/envconfig

```
go get -u github.com/kelseyhightower/envconfig
```

Логирование
https://pkg.go.dev/go.uber.org/zap

```
go get -u go.uber.org/zap
```

Подключение к БД
Драйвер для Postgres

```
go get -u github.com/lib/pq
```

Миграции
https://github.com/golang-migrate/migrate/blob/master/cmd/migrate/README.md
https://www.appsloveworld.com/go/83/golang-migrate-installation-failing-on-ubuntu-22-04-with-the-following-gpg-error

```
curl -L https://packagecloud.io/golang-migrate/migrate/gpgkey | apt-key add -
sudo sh -c 'echo "deb https://packagecloud.io/golang-migrate/migrate/ubuntu/ $(lsb_release -sc) main" > /etc/apt/sources.list.d/migrate.list'
sudo apt-get update
sudo apt-get install -y golang-migrate
```

Если ошибка E: Указаны конфликтующие значения параметра Signed-By из источника
https://packagecloud.io/golang-migrate/migrate/ubuntu/
jammy: /etc/apt/keyrings/golang-migrate_migrate-archive-keyring.gpg !=

```
cd /etc/apt/sources.list.d
ls
sudo rm migrate.list
```

Создание миграционного репозитория

```
migrate create -ext sql -dir migrations ProfilesCreationMigration
migrate create -ext sql -dir migrations ProfileFiltersCreationMigration
migrate create -ext sql -dir migrations ProfileComplaintsCreationMigration
migrate create -ext sql -dir migrations ProfileTelegramCreationMigration
migrate create -ext sql -dir migrations ProfileNavigatorsCreationMigration
migrate create -ext sql -dir migrations ProfileImagesCreationMigration
migrate create -ext sql -dir migrations ProfileReviewsCreationMigration
migrate create -ext sql -dir migrations ProfileLikesCreationMigration
migrate create -ext sql -dir migrations ProfileBlocksCreationMigration
```

Создание up sql файлов

```
migrate -path migrations -database "postgres://localhost:5432/tgbot?sslmode=disable&user=postgres&password=root" up
```

Создание down sql файлов

```
migrate -path migrations -database "postgres://localhost:5432/tgbot?sslmode=disable&user=postgres&password=root" down
```

Если ошибка Dirty database version 1. Fix and force version

```
migrate create -ext sql -dir migrations ProfilesCreationMigration force 20240210114558
```

Fiber
https://github.com/gofiber/fiber

```
go get -u github.com/gofiber/fiber/v2
```

CORS
https://github.com/gorilla/handlers

```
go get -u github.com/gorilla/handlers
```

Telegram Bot API
https://github.com/go-telegram-bot-api/telegram-bot-api

```
go get -u github.com/go-telegram-bot-api/telegram-bot-api/v5
```

Errors

```
go get -u github.com/pkg/errors
```

PostGIS

```
pg_config --version // PostgreSQL 14.10 (Ubuntu 14.10-0ubuntu0.22.04.1)
sudo apt-get update
sudo apt install postgis postgresql-14-postgis-3
sudo -u postgres psql -c "CREATE EXTENSION postgis;" tgbot
sudo systemctl restart postgresql
```

JWT
https://github.com/auth0/go-jwt-middleware
https://github.com/form3tech-oss/jwt-go
https://github.com/golang-jwt/jwt

```
go get -u github.com/auth0/go-jwt-middleware
go get -u github.com/form3tech-oss/jwt-go
go get -u github.com/golang-jwt/jwt/v5
go get -u github.com/gofiber/contrib/jwt
```

Golang Keycloak API Package
https://github.com/Nerzal/gocloak

```
go get -u github.com/Nerzal/gocloak/v13
```

Go Util
https://github.com/gookit/goutil

```
go get -u github.com/gookit/goutil
```

go-webp Сжатие изображений
https://github.com/h2non/bim
```
sudo apt install libvips-dev
go get -u github.com/h2non/bimg
```

Запуск RabbitMQ
```
docker-compose up
```
15672 - порт админки
5672 - порт RabbitMQ
После запуска можем перейти в админку по адресу http://localhost:15672

https://github.com/rabbitmq/rabbitmq-tutorials/tree/main/go
```
go get github.com/rabbitmq/amqp091-go
```

Stop process
```
sudo lsof -i :15672
sudo lsof -i :5432
sudo kill PID_number
```

PGAdmin
https://www.pgadmin.org/download/pgadmin-4-apt/
```
sudo service postgresql restart
sudo apt install postgresql
sudo -i -u postgres
psql
\password postgres
root
```

Docker
```
sudo snap install docker
```

```
docker-compose up -d rabbitmq
docker-compose up -d postgres
docker-compose up -d server-service
docker-compose up -d client-service
```

```
docker-compose stop postgres
docker exec -it a87c0fc7d44a  psql -U postgres -c "CREATE DATABASE tgbot;" // контейнер postgres должен быть запущен
docker run --name=infra_postgres_1 -e POSTGRES_PASSWORD='root' -p 5432:5432 -d --rm postgres
ls -l /home/ebudaev/Documents/Others/MyProjects/gravity/infra/db-data/postgres/migrations
sudo mkdir ./db-data/postgres/migrations
sudo migrate -path ./db-data/postgres/migrations -database "postgres://postgres:5432/tgbot?sslmode=disable&user=postgres&password=root" up
sudo migrate -path ./db-data/postgres/migrations -database "postgres://postgres:root@postgres:5432/tgbot?sslmode=disable&user=postgres&password=root" up
```
