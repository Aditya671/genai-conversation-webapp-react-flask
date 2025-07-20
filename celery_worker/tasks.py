# tasks.py
from typing import List, Optional
from celery_worker.celery_app import celery_app
from rag_model.index_locally import LocalOnlyFileIndexer
from rag_model.ai_models_list import AiModel
from rag_model.ai_models_list import resolve_model


@celery_app.task
def index_user_uploaded_files(root_dir='./uploaded_files',\
    index_name: str = "test", model: str = '', \
    upload_files: Optional[List[str]] = []\
    ):
    model_obj = resolve_model(model)
    
    indexer = LocalOnlyFileIndexer(root_dir=root_dir,\
            index_name=index_name, model=model_obj)
    return indexer.index_uploaded_files(file_list=upload_files)
