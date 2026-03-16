FROM golang:1.22-alpine AS builder
RUN apk add --no-cache git
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o identity-service ./cmd/main.go

FROM alpine:3.19
RUN apk --no-cache add ca-certificates wget
RUN addgroup -g 1000 app && adduser -D -u 1000 -G app app
WORKDIR /root/
COPY --from=builder /app/identity-service .
COPY --from=builder /app/config.yaml .
RUN chown -R app:app /root/
USER app
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -q --spider http://localhost:8080/health || exit 1
CMD ["./identity-service"]
