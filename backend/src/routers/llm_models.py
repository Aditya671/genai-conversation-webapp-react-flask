
from fastapi import APIRouter, HTTPException
from backend.src.models.LlmModels import LlmModels
from backend.src.models import db
from pandas import DataFrame, to_datetime
from fastapi import status
from pandas import DataFrame
from backend.src.models.HttpModels import OkResponse, CreatedResponse, AcceptedResponse

models_router = APIRouter()

@models_router.get(
    path="/",
    response_model=list[LlmModels],
    status_code=status.HTTP_200_OK,  # default status code
    description="Retrieve all llm models for a user",
    tags=[
        "Get LlmModels", "LlmModels List",
        "List of LlmModels", "Get All LlmModels"
        ],
    summary="Get All LlmModels",
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
async def get_models():
    models_result = db.models.find().to_list()
    models_list = DataFrame(models_result)
    # Set dtypes
    models_list = models_list.astype({
        '_id': 'string',             # ObjectId can be stringified
        'modelValue': 'string',
        'ModelName': 'string',
        'isActive': 'bool'
    })
    if models_list is None or len(models_list) == 0:
        raise HTTPException(status_code=404, detail="Empty Conversation")

    if 'dateTimeCreated' in models_list.columns:
        models_list['dateTimeCreated'] = to_datetime(models_list['dateTimeCreated'], errors='coerce')
        if  models_list['dateTimeCreated'].dtype != str:
            models_list['dateTimeCreated'] = models_list['dateTimeCreated'].dt.strftime('%Y-%m-%d %H:%M:%S')

    models_list.fillna('', inplace=True)
    models_list = models_list.to_dict('records')
    return models_list