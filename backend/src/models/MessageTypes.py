
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from enum import Enum
from bson import ObjectId
from . import PyObjectId
from typing import Union

class TypesOfMessage(str, Enum):
    USER = 'USER'
    SYSTEM = 'SYSTEM'
    MODEL = 'MODEL'
    
class MessageTypes(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    type: TypesOfMessage | None = None
    description: str
    dateTimeAdded: Union[str,datetime]
    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True,
                              json_encoders={ObjectId: str})