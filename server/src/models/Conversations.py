
from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId
from . import PyObjectId

class Conversations(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    conversationId: str
    conversationTitle: str
    dateTimeCreated: datetime
    userId: str
    isNew: bool
    isActive: bool
    dateTimePinned: datetime
    isPinned: bool

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}