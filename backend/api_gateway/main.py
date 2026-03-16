from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import httpx
import os

app = FastAPI(title="API Gateway", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

IDENTITY_SERVICE = os.getenv("IDENTITY_SERVICE_URL", "http://localhost:8080")
STUDENT_SERVICE = os.getenv("STUDENT_SERVICE_URL", "http://localhost:8081")
EMPLOYER_SERVICE = os.getenv("EMPLOYER_SERVICE_URL", "http://localhost:8082")
INTERNSHIP_SERVICE = os.getenv("INTERNSHIP_SERVICE_URL", "http://localhost:8083")
APPLICATION_SERVICE = os.getenv("APPLICATION_SERVICE_URL", "http://localhost:8084")
SCORING_SERVICE = os.getenv("SCORING_SERVICE_URL", "http://localhost:8085")
RECOMMENDATION_SERVICE = os.getenv("RECOMMENDATION_SERVICE_URL", "http://localhost:8086")

async def proxy_request(service_url: str, path: str, method: str = "GET", json_data: dict = None, headers: dict = None):
    async with httpx.AsyncClient() as client:
        url = f"{service_url}{path}"
        try:
            if method == "GET":
                response = await client.get(url, headers=headers)
            elif method == "POST":
                response = await client.post(url, json=json_data, headers=headers)
            elif method == "PUT":
                response = await client.put(url, json=json_data, headers=headers)
            elif method == "PATCH":
                response = await client.patch(url, json=json_data, headers=headers)
            elif method == "DELETE":
                response = await client.delete(url, headers=headers)
            else:
                raise HTTPException(status_code=405, detail="Method not allowed")
            
            return JSONResponse(content=response.json(), status_code=response.status_code)
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Service unavailable: {str(e)}")

@app.api_route("/auth/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def identity_proxy(path: str, request: Request):
    return await proxy_request(IDENTITY_SERVICE, f"/{path}", method=request.method, json_data=await request.json() if request.method in ["POST", "PUT", "PATCH"] else None)

@app.api_route("/students/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def student_proxy(path: str, request: Request):
    return await proxy_request(STUDENT_SERVICE, f"/{path}", method=request.method, json_data=await request.json() if request.method in ["POST", "PUT", "PATCH"] else None)

@app.api_route("/employers/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def employer_proxy(path: str, request: Request):
    return await proxy_request(EMPLOYER_SERVICE, f"/{path}", method=request.method, json_data=await request.json() if request.method in ["POST", "PUT", "PATCH"] else None)

@app.api_route("/internships/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def internship_proxy(path: str, request: Request):
    return await proxy_request(INTERNSHIP_SERVICE, f"/{path}", method=request.method, json_data=await request.json() if request.method in ["POST", "PUT", "PATCH"] else None)

@app.api_route("/applications/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def application_proxy(path: str, request: Request):
    return await proxy_request(APPLICATION_SERVICE, f"/{path}", method=request.method, json_data=await request.json() if request.method in ["POST", "PUT", "PATCH"] else None)

@app.api_route("/scoring/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def scoring_proxy(path: str, request: Request):
    return await proxy_request(SCORING_SERVICE, f"/{path}", method=request.method, json_data=await request.json() if request.method in ["POST", "PUT", "PATCH"] else None)

@app.api_route("/recommendations/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def recommendation_proxy(path: str, request: Request):
    return await proxy_request(RECOMMENDATION_SERVICE, f"/{path}", method=request.method, json_data=await request.json() if request.method in ["POST", "PUT", "PATCH"] else None)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "api-gateway"}
