from fastapi import FastAPI
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

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(429, _rate_limit_exceeded_handler)

# Configure Cache (Using aiocache)
from aiocache import caches
caches.set_config(cache_config)

from server.src.routers.conversations import router as conversations_router
app.include_router(conversations_router, prefix="/api", tags=["conversations"])
# Example Endpoint
@app.get('/')
def hello():
    return {"message": "Hello, World!"}

# Run the application
if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8000)
