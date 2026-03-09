package logger

import "go.uber.org/zap"

var log *zap.Logger

func Init() error {
	var err error
	log, err = zap.NewProduction()
	return err
}

func Info(msg string, fields ...zap.Field) {
	log.Info(msg, fields...)
}

func Error(msg string, fields ...zap.Field) {
	log.Error(msg, fields...)
}

func Fatal(msg string, fields ...zap.Field) {
	log.Fatal(msg, fields...)
}
