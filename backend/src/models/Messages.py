
from pydantic import BaseModel, Field, HttpUrl
from datetime import datetime
from bson import ObjectId
from . import PyObjectId
from typing import Union, Optional, List

class UploadedFile(BaseModel):
    filename: str
    content_type: str
    size: int  # in bytes
    storage_url: Optional[Union[str, HttpUrl ]]

class MessageAdditionalInfo(BaseModel):
    tableData: list
    chartData: list
    extra: dict
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

class Message(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    conversationId: Optional[str] = None
    messageId: str
    messageType: str
    messageAvatarSrc: str
    messageDescription: str
    messageSubDescription: str
    messageAdditionalInfo: dict
    messageDateTimeCreated: Union[str,datetime]
    isEdited: bool
    referenceMessageId: Union[str, None]
    messageAdditionalInfo: MessageAdditionalInfo
    uploadedFiles: Optional[List[UploadedFile]] = []
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class MessagesList(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    conversationId: str
    messages: list[Message]
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}