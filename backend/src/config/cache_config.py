cache_config = {
    "default": {
        "cache": "aiocache.SimpleMemoryCache",  # Cache type (e.g., "aiocache.RedisCache", "aiocache.MemcachedCache")
        "serializer": {
            "class": "aiocache.serializers.DefaultSerializer"
        },
        "ttl": 300,  # Default timeout for cached items (in seconds)
        "max_keys": 100,  # Maximum number of items to store in the cache
        "namespace": "fastapi_cache_",  # Prefix for cache keys
    }
}