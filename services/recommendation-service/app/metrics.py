"""
Prometheus metrics middleware for FastAPI services
"""
import time
import os
from fastapi import Request, Response
from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST

# Metrics definitions
HTTP_REQUESTS_TOTAL = Counter(
    'http_requests_total',
    'Total number of HTTP requests',
    ['service', 'method', 'endpoint', 'status']
)

HTTP_REQUEST_DURATION = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration in seconds',
    ['service', 'method', 'endpoint'],
    buckets=Histogram.DEFAULT_BUCKETS
)

HTTP_REQUESTS_IN_FLIGHT = Gauge(
    'http_requests_in_flight',
    'Number of HTTP requests currently being processed'
)

SERVICE_NAME = os.getenv('SERVICE_NAME', 'unknown-service')


async def metrics_middleware(request: Request, call_next):
    """Middleware to record HTTP request metrics"""
    start_time = time.time()
    HTTP_REQUESTS_IN_FLIGHT.inc()
    
    try:
        response = await call_next(request)
        status_code = response.status_code
    except Exception as e:
        status_code = 500
        raise
    finally:
        duration = time.time() - start_time
        HTTP_REQUESTS_IN_FLIGHT.dec()
        
        # Record metrics
        endpoint = request.url.path
        method = request.method
        
        HTTP_REQUESTS_TOTAL.labels(
            service=SERVICE_NAME,
            method=method,
            endpoint=endpoint,
            status=str(status_code)
        ).inc()
        
        HTTP_REQUEST_DURATION.labels(
            service=SERVICE_NAME,
            method=method,
            endpoint=endpoint
        ).observe(duration)
    
    return response


def metrics_endpoint(request: Request) -> Response:
    """Endpoint to expose Prometheus metrics"""
    return Response(
        content=generate_latest(),
        media_type=CONTENT_TYPE_LATEST
    )
