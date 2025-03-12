from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import uvicorn

load_dotenv()
from server.config import constants
from server.config.cache_config import cache_config

app = FastAPI()
# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=constants.allowed_origins,
    allow_credentials=True,
    allow_methods=constants.allowed_methods,
    allow_headers=["Content-Type", "Authorization"],
    max_age=constants.allowed_max_age
)

# Configure FastAPI-Limiter (Using slowapi)
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address, default_limits=["200 per minute"])
app.state.limiter = limiter
app.add_exception_handler(429, _rate_limit_exceeded_handler)

# Configure Cache (Using aiocache)
from aiocache import caches
caches.set_config(cache_config)

from server.src.routers.conversations import conv_router
app.include_router(conv_router, prefix="/api", tags=["conversations"])

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"message": "An unexpected error occurred. Please try again later."}
    )

# Custom Validation Error Handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"message": "Validation error", "details": exc.errors()}
    )

@app.get('/')
def hello():
    return {"message": "Hello, World!"}
# Run the application
if __name__ == '__main__':
    uvicorn.run(app)
