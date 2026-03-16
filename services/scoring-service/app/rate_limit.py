"""Rate Limiting Middleware for GlohibAI MVP"""
from fastapi import Request
from fastapi.responses import JSONResponse
import time

_request_counts = {}

async def rate_limit_middleware(request: Request, call_next):
    """Basic rate limiting - 100 requests per minute per IP"""
    client_ip = request.client.host
    now = time.time()
    window_seconds = 60
    max_requests = 100
    
    if client_ip not in _request_counts:
        _request_counts[client_ip] = []
    
    # Clean old requests
    _request_counts[client_ip] = [t for t in _request_counts[client_ip] if now - t < window_seconds]
    
    # Check limit
    if len(_request_counts[client_ip]) >= max_requests:
        return JSONResponse(
            status_code=429,
            content={"error": "Rate limit exceeded. Try again later."}
        )
    
    # Record request
    _request_counts[client_ip].append(now)
    
    return await call_next(request)
