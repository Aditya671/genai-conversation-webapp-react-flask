from fastapi import APIRouter, HTTPException
from backend.src.models.Messages import Message, MessagesList
from backend.src.models import db
from pandas import DataFrame
message_router = APIRouter()

@message_router.put("/messages", response_model=int)
async def create_message(user_id: str, conversation_id: str, message: Message):
    message_dict = message.dict(by_alias=True)
    new_message  = db.messages.update_one(
    {'conversationId': conversation_id},
    {
        '$setOnInsert': { 'conversationId': conversation_id },
        '$push': { 'messages': message_dict }
    },
    upsert=True
    )
    return new_message.modified_count

@message_router.get("/messages", response_model=list[MessagesList])
async def get_message(user_id: str, conversation_id: str):
    conv_messages = db.messages.find({"conversationId": conversation_id})
    messages_list = DataFrame(conv_messages.to_list(length=None))
    if messages_list is None or len(messages_list) == 0:
        return []
    
    if 'messageDateTimeCreated' in messages_list.columns:
        messages_list['messageDateTimeCreated'] = messages_list(messages_list['messageDateTimeCreated'], errors='coerce')
        if messages_list['messageDateTimeCreated'].dtype != str:
            messages_list['messageDateTimeCreated'] = messages_list['messageDateTimeCreated'].dt.strftime('%Y-%m-%d %H:%M:%S')

    messages_list.fillna('', inplace=True)
    messages_list = messages_list.to_dict('records')
    return messages_list
