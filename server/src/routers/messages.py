from fastapi import APIRouter, HTTPException
from server.src.models.Messages import Messages
from server.src.models import db
from bson import ObjectId

router = APIRouter()


@router.post("/messages/", response_model=Messages)
async def create_message(message: Messages):
    message_dict = message.dict(by_alias=True)
    new_message = await db.messages.insert_one(message_dict)
    created_message = await db.messages.find_one({"_id": new_message.inserted_id})
    return created_message

@router.get("/messages/{message_id}", response_model=Messages)
async def get_message(message_id: str):
    message = await db.messages.find_one({"_id": ObjectId(message_id)})
    if message is None:
        raise HTTPException(status_code=404, detail="Message not found")
    return message
