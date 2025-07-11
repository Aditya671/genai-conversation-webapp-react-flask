from fastapi import APIRouter
from backend.src.routers.conversations import create_conversation
from backend.src.models.Messages import Message, MessagesList
from backend.src.models import db
from pandas import DataFrame, to_datetime, Timestamp
message_router = APIRouter()

@message_router.put("/messages", response_model=int)
async def create_message(user_id: str, conversation_id: str, message: Message):
    conversation_existence = db.conversations.find_one({'conversation_id': conversation_id})
    if(conversation_existence == None):
        date_time_formatted = to_datetime(Timestamp.now())
        date_time_formatted = date_time_formatted.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
        conv_obj = {
            'conversationId': conversation_id,
            'conversationTitle': f"Conversation-{date_time_formatted}",
            'selectedModel' : '',
            'dateTimeCreated': date_time_formatted,
            'userId': user_id,
            'isNew': False,
            'isActive': True,
            'isArchieved': False,
            'isPinned': False,
        }
        create_conversation(user_id, conv_obj)

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
