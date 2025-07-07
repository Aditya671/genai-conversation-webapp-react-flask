
from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId
from . import PyObjectId
from typing import Union, Optional

class LlmModels(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    modelValue: str
    ModelName: str
    dateTimeCreated: Union[str, datetime]
    isActive: bool
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}