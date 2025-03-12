
from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId
from __init__ import PyObjectId

class Message(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    conversationId: str
    messageId: int
    messageType: str
    messageAvatarSrc: str
    messageDescription: str
    messageSubDescription: str
    messageAdditionalInfo: dict
    dateTimeCreated: datetime

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}