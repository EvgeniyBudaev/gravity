SERVER_BINARY=aggregationApp

## up: starts all containers in the background without forcing build
up:
	@echo "Starting Docker images..."
	docker-compose up -d
	@echo "Docker images started!"

## up_build: stops docker-compose (if running), builds all projects and starts docker compose
up_build: build_server
	@echo "Stopping docker images (if running...)"
	docker-compose down
	@echo "Building (when required) and starting docker images..."
	docker-compose up --build -d
	@echo "Docker images build and started!"

## down: stop docker compose
down:
	@echo "Stopping docker compose..."
	docker-compose down
	@echo "Done!"

## build_server: builds the server binary as a linux executable
build_server:
	@echo "Building server binary..."
	chdir ../aggregation && set GOOS=linux && set GOARCH=amd64 && set CGO_ENABLED=0 && go build -o ./bin/${SERVER_BINARY} ./cmd
	@echo "Done!"
