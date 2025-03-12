from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from os import getenv

# MongoDB connection
MONGODB_URL = getenv("MONGODB_URL")
client = AsyncIOMotorClient(MONGODB_URL)
db = client.genai_app

# Pydantic models for validation
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")