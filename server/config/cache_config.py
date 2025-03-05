cache_config = {
    "CACHE_TYPE": "SimpleCache",  # Cache type (e.g., "RedisCache", "MemcachedCache")
    "CACHE_DEFAULT_TIMEOUT": 300,  # Default timeout for cached items
    "CACHE_THRESHOLD": 100,  # Maximum number of items to store in the cache
    "CACHE_KEY_PREFIX": "flask_cache_",  # Prefix for cache keys
}