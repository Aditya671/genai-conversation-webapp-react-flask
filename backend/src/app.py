from fastapi import FastAPI, Request, status, Response
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from uvicorn import run
from os import path

# Load environment variables
from dotenv import load_dotenv
current_dir = path.dirname(__file__)
# Step 2: Move up one level to reach backend/
backend_root = path.abspath(path.join(current_dir, ".."))
# Step 3: Join the path to .env file inside backend/
env_path = path.join(backend_root, ".env")
# Load the .env file
load_dotenv(dotenv_path=env_path)

app = FastAPI()

# Configure CORS (Using fastapi.middleware.cors-CORSMiddleware)
from backend.src.config import constants
app.add_middleware(
    CORSMiddleware,
    allow_origins=constants.allowed_origins,
    allow_credentials=False,
    # allow_methods=constants.allowed_methods,
    allow_methods=['*'],
    allow_headers=["*"],
    max_age=constants.allowed_max_age
)

# Configure Cache (Using aiocache)
from aiocache import caches
from backend.src.config.cache_config import cache_config
caches.set_config(cache_config)

# Configure FastAPI-Limiter (Using slowapi)
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
limiter = Limiter(key_func=get_remote_address, default_limits=["200 per minute"])
app.state.limiter = limiter
app.add_exception_handler(429, _rate_limit_exceeded_handler)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response: Response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    return response

# Custom Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"message": "An unexpected error occurred. Please try again later."}
    )

# Custom Validation Error Handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"message": "Validation error", "details": exc.errors()}
    )
from backend.src.models.HttpModels import DefaultResponseModel, OkResponse, CreatedResponse, AcceptedResponse
from fastapi import status 
# 
@app.get(
    path="/",
    response_model=DefaultResponseModel,  # default response pydantic model 
    status_code=status.HTTP_200_OK,  # default status code
    description="Application Root Endpoint",
    tags=["ROOT"],
    summary="Root Endpoint",
    responses={
        status.HTTP_200_OK: {
            "model": OkResponse, # custom pydantic model for 200 response
            "description": "Ok Response",
        },
        status.HTTP_201_CREATED: {
            "model": CreatedResponse,  # custom pydantic model for 201 response
            "description": "Creates something from user request ",
        },
        status.HTTP_202_ACCEPTED: {
            "model": AcceptedResponse,  # custom pydantic model for 202 response
            "description": "Accepts request and handles it later",
        },
    },
)
def hello():
    return DefaultResponseModel(
        status=status.HTTP_200_OK,
        message="Hey Threre!, You just entered the genai APIs server"
    )

from backend.src.routers.conversations import conv_router
app.include_router(conv_router, prefix="/api/{user_id}/conversations", tags=["conversations"])

from backend.src.routers.messages import message_router
app.include_router(message_router, prefix="/api/{user_id}/{conversation_id}", tags=["messages"])

from backend.src.routers.llm_models import models_router
app.include_router(models_router, prefix="/api/models", tags=["LLM-Models"])

from uvicorn import run
if __name__ == "__main__":
    run(app)
# uvicorn src.app:app --host 0.0.0.0 --port 8000 --reload