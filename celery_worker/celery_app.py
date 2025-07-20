# celery_worker.py

import eventlet
eventlet.monkey_patch(thread=False)
from celery import Celery

celery_app = Celery(
    "genai_app",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/1",
    include=["celery_worker.tasks"] 
)

celery_app.conf.update(
    task_track_started=True,
    task_time_limit=60 * 60, # 30 minutes
    task_serializer="json",
    accept_content=["json"]
)
