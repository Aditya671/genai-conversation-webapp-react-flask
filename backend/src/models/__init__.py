from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from os import getenv

# MongoDB connection
from urllib.parse import quote_plus
MONGODB_URL = getenv("MONGO_DB_CONNECTION_STRING")
# client = AsyncIOMotorClient(quote_plus(MONGODB_URL))



from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
# Create a new client and connect to the server
client = MongoClient(MONGODB_URL, server_api=ServerApi('1'))
db = client.genai_app
# Send a ping to confirm a successful connection
try:
    db.command('ping')
    print("Pinged your deployment, successfully connected to MongoDB!")
except Exception as e:
    print(e)

# Pydantic models for validation
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, *args, **kwargs):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")
        
    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")