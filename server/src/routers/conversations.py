from fastapi import APIRouter, HTTPException
from server.src.models.Conversations import Conversations
from server.src.models import db
from bson import ObjectId

router = APIRouter()
# Routes
@router.post("/{user_id}/conversations/", response_model=Conversations)
async def create_conversation(user_id: str, conversation: Conversations):
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    conversation_dict = conversation.dict(by_alias=True)
    conversation_dict["userId"] = user_id
    new_conversation = await db.conversations.insert_one(conversation_dict)
    created_conversation = await db.conversations.find_one({"_id": new_conversation.inserted_id})
    return created_conversation

@router.get("/{user_id}/conversations/", response_model=list[Conversations])
async def get_conversations(user_id: str):
    conversations = await db.conversations.find({"userId": user_id}).to_list(length=None)
    if not conversations:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversations

@router.put("/{user_id}/conversations/{conversation_id}", response_model=Conversations)
async def update_conversation(user_id: str, conversation_id: str, update_fields: Conversations):
    await db.conversations.update_one(filter={'_id': ObjectId(conversation_id), 'userId': user_id},
                                update= {'$set': update_fields.dict(by_alias=True)})
    updated_conversation = await db.conversations.find_one({"_id": ObjectId(conversation_id), "userId": user_id})
    return updated_conversation

@router.delete("/{user_id}/conversations/{conversation_id}")
async def delete_conversation(user_id: str, conversation_id: str):
    await db.conversations.update_one(
        filter={'_id': ObjectId(conversation_id), 'userId': user_id},
        update={'$set': {'isActive': False}}
    )
    return {"message": "Conversation deleted successfully"}