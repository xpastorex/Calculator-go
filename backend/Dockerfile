FROM golang:1.26-alpine AS builder
WORKDIR /app
COPY go.mod ./
RUN go mod download
COPY . .
# Compilamos el binario de forma estática
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Etapa 2: Imagen final ligera
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/main .
EXPOSE 8080
CMD ["./main"]