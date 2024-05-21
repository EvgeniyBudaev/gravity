Инициализация зависимостей

```
go mod init github.com/EvgeniyBudaev/gravity/aggregation
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
migrate create -ext sql -dir migrations initSchema
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
migrate create -ext sql -dir migrations initSchema force 20240410053939
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
https://github.com/h2non/bimg
```
sudo apt-get update
sudo apt install libvips-dev
go get -u github.com/h2non/bimg
```

Stop process
```
sudo lsof -i :15672
sudo lsof -i :5432
sudo lsof -i :3000
sudo lsof -i :80
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
docker-compose up -d postgres
docker-compose up -d aggregation
docker-compose up -d web
```

```
docker-compose stop postgres
```

из директории infra выполнить команду:
```
docker run -v /home/ebudaev/Documents/Others/MyProjects/gravity/aggregation/migrations:/migrations --network host migrate/migrate -path=/migrations/ -database "postgresql://postgres:root@localhost:5432/tgbot?sslmode=disable" up
```

Подготовка сервера
Check container
```
apk add curl
curl http://127.0.0.1:8080/api/v1/user/add
```

--- SERVER ---

Установка Go на сервере ubuntu
https://timeweb.cloud/tutorials/go/ustanovka-go-na-ubuntu
```
wget https://go.dev/dl/go1.22.1.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.22.1.linux-amd64.tar.gz
sudo nano ~/.profile

export PATH=$PATH:/usr/local/go/bin
export GOPATH=$HOME/goproject
export PATH=$PATH:$GOPATH/bin

source ~/.profile
mkdir $HOME/goproject
go version
```

Установка Node.js на сервере ubuntu
https://selectel.ru/blog/tutorials/how-to-install-node-js-on-ubuntu-20-04/
```
sudo apt update
sudo apt install build-essential checkinstall libssl-dev
вариант 1)
sudo wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | sudo bash
. .bashrc
если не сработает вариант 1, то вариант 2) 
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

nvm --help
nvm install 20.12.2
nvm use 20.12.2
node --version
```

Установка Git
```
sudo apt update
sudo apt-get install git
git --help
```

Удаление директории с файлами
```
rm -rf go1.21.1.linux-amd64.tar.gz
```

Установка Docker
https://selectel.ru/blog/docker-install-ubuntu/
```
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update
sudo apt install docker-ce -y
sudo systemctl start docker
sudo systemctl enable docker
docker -v
```

Установка Docker compose
https://docs.docker.com/compose/install/linux/
```
вариант 1)
sudo curl -L "https://github.com/docker/compose/releases/download/1.28.6/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo docker–compose –version
вариант 2)
sudo apt-get update
sudo apt-get install docker-compose-plugin
docker compose version
```

Установка Make
```
sudo apt update
sudo apt-get install build-essential
make --version
```

Порты, nginx
```
sudo apt install nginx -y
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable 
sudo ufw status
sudo systemctl start nginx
```

Docker
Список контейнеров
```
sudo docker ps -a
```
Список всех образов
```
sudo docker image ls
```

Список всех volumes
```
sudo docker volume ls
```

Удаление контейнера
```
sudo docker rm container_id
```

Удаление образа
```
sudo docker image rm id_image
```

Удаление volume
```
sudo docker volume rm volume_name
```

Удаление всех контейнеров
```
sudo docker rm -f $(sudo docker ps -a -q)
```
Удаление всех образов
```
sudo docker rmi -f $(sudo docker images -q)
```

Удаление всех volumes
```
sudo docker volume prune
```

Сборка docker-образа
```
docker build . # Соберёт образ на основе Dockerfile
docker image ls # Отобразит информацию обо всех образах
```

SSH-ключ для доступа на сервер
Создание новго ключа
```
ssh-keygen -t rsa
Enter passphrase (empty for no passphrase): жмем Enter
cat ~/.ssh/id_rsa.pub
```

Добавление публичного ключа на удаленный сервер
```
cat ~/.ssh/id_rsa.pub
ssh-copy-id -i ~/.ssh/id_rsa.pub root@158.160.90.159
--- server #2 ---
ssh-copy-id -i ~/.ssh/id_rsa.pub root@91.236.199.58
```
Добавление приватного ключа на удаленный сервер
```
cat ~/.ssh/id_rsa
```

Отредактируйте файл nginx.conf и в строке server_name впишите свой IP

Из infra скопируйте файлы docker-compose.yaml и nginx.conf из проекта на сервер (на локальной машине в терминале по месту
нахождения файла, нужно создать на сервере mkdir nginx):
для CI/CD
```
scp docker-compose.yml budaev799@158.160.90.159:/home/budaev799/docker-compose.yml
scp nginx.conf budaev799@158.160.90.159:/home/budaev799/nginx.conf
scp .env budaev799@158.160.90.159:/home/budaev799/.env
```
без CI/CD
```
scp ./.env budaev799@158.160.90.159:/home/budaev799/gravity/infra/.env
scp ../aggregation/.env.prod budaev799@158.160.90.159:/home/budaev799/gravity/aggregation/.env
scp ../web/.env.prod budaev799@158.160.90.159:/home/budaev799/gravity/web/.env

scp ./.env root@91.236.199.58:/root/gravity/infra/.env
scp ../aggregation/.env.prod root@91.236.199.58:/root/gravity/aggregation/.env
scp ../web/.env.prod root@91.236.199.58:/root/gravity/web/.env
```

Клонирование
```
git clone https://github.com/EvgeniyBudaev/gravity
```

Удаление директории с файлами
```
rm -rf gravity/
rm -rf docker-compose.yml
rm -rf nginx.conf
rm -rf .env
```
Проект доступен по адресу
```
http://158.160.90.159:3000
https://158.160.90.159:3000
https://gravity-web.ddnsking.com
https://www.gravity-web.ddnsking.com
```

Получение и настройка SSL-сертификата
```
sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot 
```

Получение сертификата
```
sudo certbot --nginx
sudo systemctl reload nginx 
```

Вход на сервер
```
ssh budaev799@158.160.90.159
ssh root@91.236.199.58
```

Без CI/CD
На сервере сборка из директории infra (незабыть скопировать env файлы в backend и web)
```
make up_build
```
gravity-web.ddnsking.com
gravity-selectel.ddnsking.com
