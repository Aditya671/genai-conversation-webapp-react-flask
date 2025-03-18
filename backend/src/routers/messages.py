from fastapi import APIRouter, HTTPException
from backend.src.models.Messages import Message
from backend.src.models import db
from pandas import DataFrame

message_router = APIRouter()

@message_router.post("/messages", response_model=Message)
async def create_message(user_id: str, conversation_id: str, message: Message):
    message_dict = message.dict(by_alias=True)
    new_message = await db.messages.insert_one(message_dict)
    created_message = await db.messages.find_one({"_id": new_message.inserted_id})
    return created_message

@message_router.get("/messages", response_model=list[Message])
async def get_message(user_id: str, conversation_id: str):
    message = db.messages.find({"conversationId": conversation_id})
    message_list = message.to_list(length=None)
    if message_list is None:
        raise HTTPException(status_code=404, detail="Message not found")
        
    message_list = DataFrame(message_list)
    if 'dateTimeCreated' in message_list.columns:
        message_list['dateTimeCreated'] = message_list['dateTimeCreated'].dt.strftime('%Y-%m-%d %H:%M:%S')
    message_list.fillna('', inplace=True)
    message_list = message_list.to_dict(orient="records")
    return message_list
