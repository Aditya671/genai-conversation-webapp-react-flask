from fastapi import APIRouter, status, UploadFile, File
from pandas import DataFrame, to_datetime, Timestamp
from typing import List
from backend.convo_llm.ai_models_list import resolve_model
from backend.convo_llm.index_locally import LocalOnlyFileIndexer
from backend.src.routers.conversations import create_conversation
from backend.src.models.Messages import Message, MessagesList
from backend.src.models import db
from backend.src.models.HttpModels import OkResponse, CreatedResponse, AcceptedResponse
from os import makedirs, path
from fastapi.responses import JSONResponse

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
        await create_conversation(user_id, conv_obj)

    message_dict = message.model_dump(by_alias=True)
    # message_dict['uploadedFiles'] = uploaded_files_metadata
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

from pydantic import BaseModel
from typing import Optional
class UpdateFields(BaseModel):
    isSaved: Optional[bool] = None
    isEdited: Optional[bool] = None
    
@message_router.patch(
    path="/{message_id}/",
    response_model=MessagesList,
    status_code=status.HTTP_202_ACCEPTED,  # default status code
    description="Update Message Object",
    tags=["ROOT"],
    summary="""
        Update Message Object fields such as
        isSaved, isEdited,etc. provided in the request by the user
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
async def patch_message_object(user_id: str, conversation_id: str, message_id: str, update_fields: UpdateFields):
    db.messages.update_one({
            "conversationId": conversation_id,
            "messages.messageId": message_id
        }, {
            "$set": {update_fields.model_dump(exclude_none=True)}
        }
    )
    updated_messages = db.messages.find_one({"conversationId": conversation_id, "userId": user_id})
    return updated_messages

@message_router.patch(
    path="/{message_id}/upload_file",
    response_model=MessagesList,
    status_code=status.HTTP_202_ACCEPTED,
    description="Update Message Object",
    tags=["ROOT"],
    summary="""
        Update Message Object fields such as
        isSaved, isEdited, etc. provided in the request by the user
    """,
    responses={
        status.HTTP_200_OK: {
            "model": OkResponse,
            "description": "Ok Response",
        },
        status.HTTP_201_CREATED: {
            "model": CreatedResponse,
            "description": "Creates something from user request",
        },
        status.HTTP_202_ACCEPTED: {
            "model": AcceptedResponse,
            "description": "Accepts request and handles it later",
        },
    }
)
async def patch_message_object(
    message_id: str,
    user_id: str,
    conversation_id: str,
    upload_files: List[UploadFile] = File(...),
):
    upload_dir = "uploaded_files/files"
    makedirs(upload_dir, exist_ok=True)

    uploaded_files_metadata = []

    for file in upload_files:
        file_location = path.join(upload_dir, file.filename)
        # with open(file_location, "wb") as f:
        #     f.write(await file.read())

        uploaded_files_metadata.append({
            "filename": file.filename,
            "content_type": file.content_type,
            "size": path.getsize(file_location),
            "storage_url": f"/{upload_dir}/{file.filename}"
        })
    user_model = db.conversations.find_one({'conversationId': conversation_id})
    
    model_obj = None
    if user_model['selectedModel']:
        model_obj = resolve_model(user_model['selectedModel'])
        
    indexer = LocalOnlyFileIndexer(root_dir='./uploaded_files', index_name='test', model=model_obj)
    await indexer.index_uploaded_files(file_list=upload_files)

    # Simulate update (uncomment when implementing real DB logic)
    db.messages.update_one(
        {
            "conversationId": conversation_id,
            "messages.messageId": message_id
        },
        {
            "$set": {
                "messages.$.uploadedFiles": uploaded_files_metadata
            }
        }
    )

    updated_doc = db.messages.find_one({
        "conversationId": conversation_id
    })

    if not updated_doc:
        return JSONResponse(status_code=404, content={"detail": "Message not found"})
    return updated_doc