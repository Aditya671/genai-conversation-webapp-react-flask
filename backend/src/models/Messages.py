
from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId
from . import PyObjectId
from typing import Union, Optional

# conversationId: "9be2c4af-e3de-4ae1-9f7a-dde8445a613b",
#     messages: [
#       {
#         messageId: "101",
#         conversationId: "9be2c4af-e3de-4ae1-9f7a-dde8445a613b",
#         messageType: "User",
#         messageAvatarSrc: "logo",
#         messageDescription: "How do I store user sessions in FastAPI?",
#         messageDateTimeCreated: "2025-06-21T07:01:00Z",
#         isEdited: false,
#         referenceMessageId: null,
#         messageSubDescription: "User asking about session storage",
#         messageAdditionalInfo: { tableData: [], chartData: [], extra: {} },
#       },
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