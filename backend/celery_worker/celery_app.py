# celery_worker.py
from celery import Celery

celery_app = Celery(
    "indexer",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/1"
)

celery_app.conf.update(
    task_track_started=True,
    task_time_limit=60 * 60 # 30 minutes
)
