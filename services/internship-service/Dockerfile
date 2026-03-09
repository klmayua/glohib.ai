FROM golang:1.22-alpine AS builder
RUN apk add --no-cache git
WORKDIR /app
COPY go.mod ./
RUN go mod download
COPY . .
RUN go build -o internship-service ./cmd/main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates wget
WORKDIR /root/
COPY --from=builder /app/internship-service .
COPY --from=builder /app/config.yaml .
EXPOSE 8083
CMD ["./internship-service"]
