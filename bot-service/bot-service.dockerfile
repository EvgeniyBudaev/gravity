FROM alpine:latest

RUN mkdir /app

COPY botApp /app

CMD ["/app/botApp"]