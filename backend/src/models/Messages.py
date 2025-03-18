
from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId
from . import PyObjectId
from typing import Union

class Message(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    conversationId: str
    messageId: str
    messageType: str
    messageDescription: str
    messageSubDescription: str
    messageAdditionalInfo: dict
    dateTimeCreated: Union[str,datetime]

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}