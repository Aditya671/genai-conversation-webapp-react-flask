# tasks.py
from typing import List
from fastapi import UploadFile
from backend.celery_worker.celery_app import celery_app
from backend.convo_llm.index_locally import LocalOnlyFileIndexer
from backend.convo_llm.ai_models_list import AiModel
from backend.convo_llm.ai_models_list import resolve_model

@celery_app.task(name="index_user_uploaded_files")
def index_user_uploaded_files(root_dir='./uploaded_files',\
    index_name: str = "test", model: str = '', \
    upload_files: List[UploadFile] = []\
    ):
    model_obj = resolve_model(model)
    
    indexer = LocalOnlyFileIndexer(root_dir=root_dir,\
            index_name=index_name, model=model_obj)
    return indexer.index_uploaded_files(file_list=upload_files)
