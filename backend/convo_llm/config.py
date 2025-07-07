
import os
import yaml
import logging
from typing import Optional, Dict, Any
from dotenv import load_dotenv
from enum import Enum

# Constants in UPPER_CASE
DEFAULT_ENVIRONMENT: str = "local"
VALID_ENVIRONMENTS = {"local", "development", "staging", "production"}

# Enum class in PascalCase
class Environment(str, Enum):
    LOCAL = "local"
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"

class IndexConfig:
    """
    Represents the index-specific configuration.
    This ties together the chunk, metadata, storage, embed, and RAG settings.
    """
    def __init__(self, name: str, settings: Dict[str, Any]) -> None:
        self.name = name
        self.settings = settings