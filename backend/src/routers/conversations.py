from fastapi import APIRouter, HTTPException
from backend.src.models.Conversations import Conversations
from backend.src.models import db
from bson import ObjectId
from fastapi import status
from pandas import DataFrame, to_datetime
from backend.src.models.HttpModels import OkResponse, CreatedResponse, AcceptedResponse
conv_router = APIRouter()

# Routes
# userId = '67d1c4e768fd6d29d3043c98'

@conv_router.get(
    path="/",
    response_model=list[Conversations],
    status_code=status.HTTP_200_OK,  # default status code
    description="Retrieve all conversations for a user",
    tags=[
        "Get User Conversations", "Conversations List",
        "List of Conversations for a User", "Get All User Conversations"
        ],
    summary="Get All User Conversations",
    responses={
        status.HTTP_200_OK: {
            "model": OkResponse, # custom pydantic model for 200 response
            "description": "Ok Response",
        },
        status.HTTP_201_CREATED: {
            "model": CreatedResponse,  # custom pydantic model for 201 response
            "description": "Creates something from user request",
        },
        status.HTTP_202_ACCEPTED: {
            "model": AcceptedResponse,  # custom pydantic model for 202 response
            "description": "Accepts request and handles it later",
        },
    }
)
async def get_all_conversations(user_id: str):
    conversations = db.conversations.find({"userId": user_id}).to_list(length=None)
    if not conversations:
        raise HTTPException(status_code=404, detail="Conversation not found")
    conversations = DataFrame(conversations)
    conversations['dateTimeCreated'] = to_datetime(conversations['dateTimeCreated'], errors='coerce')
    if 'dateTimeCreated' in conversations.columns and conversations["dateTimeCreated"].dtype != str:
        conversations['dateTimeCreated'] = to_datetime(conversations['dateTimeCreated']).dt.strftime('%Y-%m-%d %H:%M:%S')
    conversations.fillna('', inplace=True)
    conversations = conversations.to_dict(orient="records")
    return conversations

@conv_router.post(
    path="/",
    response_model=Conversations, 
    status_code=status.HTTP_201_CREATED,  # default status code
    description="Create a new conversation for a user",
    tags=["New User Conversation", "Create User Conversation", "Add Conversation for User", ],
    summary="Create New User Conversation",
    responses={
        status.HTTP_200_OK: {
            "model": OkResponse, # custom pydantic model for 200 response
            "description": "Ok Response",
        },
        status.HTTP_201_CREATED: {
            "model": CreatedResponse,  # custom pydantic model for 201 response
            "description": "Creates something from user request ",
        },
        status.HTTP_202_ACCEPTED: {
            "model": AcceptedResponse,  # custom pydantic model for 202 response
            "description": "Accepts request and handles it later",
        },
    })
async def create_conversation(user_id: str, conversation: Conversations):
    user = db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    conversation_dict = conversation.model_dump(mode='json',by_alias=True)
    conversation_dict["userId"] = user_id
    new_conversation = db.conversations.insert_one(conversation_dict)
    created_conversation = db.conversations.find_one({"_id": new_conversation.inserted_id})
    return created_conversation


from pydantic import BaseModel
from typing import Optional

class UpdateFields(BaseModel):
    conversationTitle: Optional[str]
    isActive: Optional[bool]
    isPinned: Optional[bool]
    selectedModel : Optional[str]
    
@conv_router.patch(
    path="/{conversation_id}/",
    response_model=Conversations,
    status_code=status.HTTP_202_ACCEPTED,  # default status code
    description="Update Conversation Object fields",
    tags=["ROOT"],
    summary="""
        Update Conversation Object fields such as
        isActive, dateTimePinned, dateTimeCreated, etc. provided in the request by the user
    """,
    responses={
        status.HTTP_200_OK: {
            "model": OkResponse, # custom pydantic model for 200 response
            "description": "Ok Response",
        },
        status.HTTP_201_CREATED: {
            "model": CreatedResponse,  # custom pydantic model for 201 response
            "description": "Creates something from user request ",
        },
        status.HTTP_202_ACCEPTED: {
            "model": AcceptedResponse,  # custom pydantic model for 202 response
            "description": "Accepts request and handles it later",
        },
    }
)
async def patch_conversation_object(user_id: str, conversation_id: str, update_fields: UpdateFields):
    db.conversations.update_one(
        filter={'conversationId': conversation_id, 'userId': user_id},
        update={'$set': update_fields.dict()}
    )
    updated_conversation = db.conversations.find_one({"conversationId": conversation_id, "userId": user_id})
    return updated_conversation


# @conv_router.put(
#     path="/{conversation_id}",
#     response_model=Conversations,
#     status_code=status.HTTP_200_OK,  # default status code
#     description="Application Root Endpoint",
#     tags=["ROOT"],
#     summary="Root Endpoint",
#     responses={
#         status.HTTP_200_OK: {
#             "model": OkResponse, # custom pydantic model for 200 response
#             "description": "Ok Response",
#         },
#         status.HTTP_201_CREATED: {
#             "model": CreatedResponse,  # custom pydantic model for 201 response
#             "description": "Creates something from user request ",
#         },
#         status.HTTP_202_ACCEPTED: {
#             "model": AcceptedResponse,  # custom pydantic model for 202 response
#             "description": "Accepts request and handles it later",
#         },
#     })
# async def update_conversation(user_id: str, conversation_id: str, update_fields: Conversations):
#     await db.conversations.update_one(filter={'_id': ObjectId(conversation_id), 'userId': userId},
#                                 update= {'$set': update_fields.dict(by_alias=True)})
#     updated_conversation = await db.conversations.find_one({"_id": ObjectId(conversation_id), "userId": userId})
#     return updated_conversation
    
# @conv_router.delete(
#     path="/{conversation_id}",
#     response_model=OkResponse,  # default response pydantic model 
#     status_code=status.HTTP_200_OK,  # default status code
#     description="Application Root Endpoint",
#     tags=["ROOT"],
#     summary="Root Endpoint",
#     responses={
#         status.HTTP_200_OK: {
#             "model": OkResponse, # custom pydantic model for 200 response
#             "description": "Ok Response",
#         },
#         status.HTTP_201_CREATED: {
#             "model": CreatedResponse,  # custom pydantic model for 201 response
#             "description": "Creates something from user request ",
#         },
#         status.HTTP_202_ACCEPTED: {
#             "model": AcceptedResponse,  # custom pydantic model for 202 response
#             "description": "Accepts request and handles it later",
#         },
#     }
# )
# async def delete_conversation(user_id: str, conversation_id: str):
#     await db.conversations.update_one(
#         filter={'_id': ObjectId(conversation_id), 'userId': userId},
#         update={'$set': {'isActive': False}}
#     )
#     return {"message": "Conversation deleted successfully"}