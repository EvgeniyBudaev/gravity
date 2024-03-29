# https://docs.docker.com/language/golang/build-images/
# base go image
FROM golang:1.21.6-alpine as builder

WORKDIR /app

RUN apk --no-cache add bash git make gcc gettext musl-dev vips-dev

# dependencies
COPY ["go.mod", "go.sum", "./"]
RUN go mod download

# build
COPY . .
RUN CGO_ENABLED=1 GOOS=linux GOARCH=amd64 go build -o ./bin/serverApp ./cmd

FROM alpine:latest

RUN apk --no-cache add vips

COPY --from=builder /app/.env /
COPY --from=builder /app/bin/serverApp /
CMD ["/serverApp"]