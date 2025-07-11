
from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Union
from bson import ObjectId
from . import PyObjectId

class Conversations(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    conversationId: str
    conversationTitle: str
    selectedModel : str
    dateTimeCreated: Union[str,datetime]
    userId: str
    isNew: bool
    isActive: bool
    isArchieved: bool
    isPinned: bool

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
    
    
    # @field_validator('dateTimeCreated', 'dateTimePinned', mode='before')
    # def parse_datetime(cls, value):
    #     if isinstance(value, str):
    #         return datetime.fromisoformat(value)
    #     return value