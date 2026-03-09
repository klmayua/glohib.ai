FROM golang:1.22-alpine AS builder
RUN apk add --no-cache git
WORKDIR /app
COPY go.mod ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o assessment-service ./cmd/main.go

FROM alpine:3.19
RUN apk --no-cache add ca-certificates wget
WORKDIR /root/
COPY --from=builder /app/assessment-service .
COPY --from=builder /app/config.yaml .
EXPOSE 8084 50054
CMD ["./assessment-service"]
