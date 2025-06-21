from os import getenv

allowed_origins = getenv('APP_CORS_ALLOWED_ORIGINS', '*').split(',') if getenv('APP_CORS_ALLOWED_ORIGINS') else ['*']
allowed_methods = getenv('APP_CORS_ALLOWED_METHODS', 'GET').split(',') if getenv('APP_CORS_ALLOWED_METHODS') else 'GET'
allowed_max_age = getenv('APP_CORS_MAX_AGE', 3600)
application_debug_state = getenv('APPLICATION_DEBUG_STATE', False)