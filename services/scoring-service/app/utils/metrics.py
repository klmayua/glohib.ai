import os
from prometheus_client import start_http_server

METRICS_PORT = int(os.getenv("METRICS_PORT", "8001"))

def start_metrics_server(port: int = METRICS_PORT):
    start_http_server(port)
