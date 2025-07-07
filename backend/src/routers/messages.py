from fastapi import APIRouter, HTTPException
from backend.src.models.Messages import Message, MessagesList
from backend.src.models import db
from pandas import DataFrame
message_router = APIRouter()

@message_router.post("/messages", response_model=Message)
async def create_message(user_id: str, conversation_id: str, message: Message):
    message_dict = message.dict(by_alias=True)
    new_message = await db.messages.insert_one(message_dict)
    created_message = await db.messages.find_one({"_id": new_message.inserted_id})
    return created_message

@message_router.get("/messages", response_model=list[MessagesList])
async def get_message(user_id: str, conversation_id: str):
    conv_messages = db.messages.find({"conversationId": conversation_id})
    messages_list = DataFrame(conv_messages.to_list(length=None))
    if messages_list is None or len(messages_list) == 0:
        raise HTTPException(status_code=404, detail="Empty Conversation")

    if 'messageDateTimeCreated' in messages_list.columns and messages_list['messageDateTimeCreated'].dtype != str:
        messages_list['messageDateTimeCreated'] = messages_list['messageDateTimeCreated'].dt.strftime('%Y-%m-%d %H:%M:%S')

    messages_list.fillna('', inplace=True)
    messages_list = messages_list.to_dict('records')
    return messages_list
