import os
import logging
from typing import Any, Optional, Union
from llama_index.llms.openai import OpenAI
from llama_index.llms.ollama import Ollama
from llama_index.llms.huggingface import HuggingFaceLLM
from backend.convo_llm.ai_models_list import AiModel, AiModelHosted

DEFAULT_TEMPERATURE = 0.1
DEFAULT_TIMEOUT = 10.0

logger = logging.getLogger(__name__)

# Define which models are OpenAI-proprietary and which are open-source (Ollama/HuggingFace)
OPENAI_MODELS = {
    AiModel.O3_MINI, AiModel.O3, AiModel.O4_MINI, AiModel.O4_MINI_HIGH,
    AiModel.GPT4O, AiModel.GPT41, AiModel.GPT41_MINI
}

OLLAMA_MODELS = {
    AiModel.LLAMA2_7B, AiModel.LLAMA3_8B, AiModel.MISTRAL_7B, AiModel.GEMMA_7B,
    AiModel.VICUNA_7B, AiModel.PHI_2, AiModel.STABLELM_2_1B, AiModel.FALCON_7B,
    AiModel.DOLLY_V2_12B, AiModel.REDPAJAMA_INCITE_7B, AiModel.STARLING_LM_7B,
    AiModel.NOUS_HERMES_2_MIXTRAL_8X7B, AiModel.OPENHERMES_2_5_MISTRAL_7B,
    AiModel.OLLAMA_VICUNA_7B, AiModel.CODELLAMA_7B, AiModel.MPT_7B,
    AiModel.FALCON_40B, AiModel.YI_34B, AiModel.QWEN_7B
}

def load_llm(
    model: Union[AiModel, AiModelHosted],
    index_name: str = None,
    temperature: Optional[float] = DEFAULT_TEMPERATURE,
    timeout: Optional[float] = DEFAULT_TIMEOUT,
    context_window: int = 2048,
    max_new_tokens: int = 512,
    query_wrapper_prompt: str = "{query_str}",
    tokenizer_name: Optional[str] = None,
    model_kwargs: dict = None,
    generate_kwargs: dict = None,
    device_map: str = "auto",
    is_chat_model: Optional[bool] = False,
    callback_manager: Any = None,
    system_prompt: str = "",
    ollama_kwargs: dict = None,
    **kwargs
) -> Union[OpenAI, Ollama, HuggingFaceLLM]:
    """
    Load and instantiate an LLM instance based on the provided parameters.
    Returns:
        An instantiated LLM model.
    Raises:
        ValueError: If required configurations for a selected model are missing.
    Note:
        For HuggingFaceLLM, temperature and other generation parameters are NOT supported in the constructor or at inference time.
        These must be set in the model's configuration on HuggingFace, if supported.

    HuggingFaceLLM advanced parameters:
        context_window: int = 2048
            The context window size for the model.
        max_new_tokens: int = 512
            Maximum number of new tokens to generate.
        query_wrapper_prompt: str = "{query_str}"
            Prompt template for queries.
        tokenizer_name: str = None
            Name of the tokenizer to use.
        model_kwargs: dict = None
            Additional kwargs passed to the model.
        generate_kwargs: dict = None
            Additional kwargs passed to the generate method.
        device_map: str = "auto"
            Device mapping for model loading (e.g., "auto", "cpu", "cuda").
        is_chat_model: bool = False
            Whether the model is a chat model.
        callback_manager: Any = None
            Callback manager for advanced use.
        system_prompt: str = ""
            System prompt for chat models.
        ...and more, see HuggingFaceLLM class for all options.

    Ollama advanced parameters (pass as ollama_kwargs):
        model: str
            The model name to use (required).
        base_url: str = "http://localhost:11434"
            The base URL for the Ollama server.
        temperature: float = 0.1
            Sampling temperature for generation.
        request_timeout: float = 10.0
            Timeout for requests to the Ollama server.
        context_window: int = 2048
            The context window size for the model.
        num_ctx: int = None
            Number of context tokens.
        num_predict: int = None
            Number of tokens to predict.
        top_k: int = None
            Top-k sampling parameter.
        top_p: float = None
            Top-p (nucleus) sampling parameter.
        repeat_penalty: float = None
            Penalty for repeated tokens.
        stop: list = None
            List of stop sequences.
        ...and more, see Ollama class for all options.
    """
    logger.info(f"Loading LLM model: {model} with temperature: {temperature}")

    if model in OPENAI_MODELS:
        llm = OpenAI(
            model=model.value,
            temperature=temperature,
            api_key=os.environ.get('OPENAI_API_KEY', None),
            request_timeout=float(timeout)
        )
        logger.info(f"LLM model loaded successfully: {model} (OpenAI)")
        return llm
    elif model in OLLAMA_MODELS:
        ollama_args = dict(
            model=model.value,
            base_url="http://localhost:11434",
            temperature=temperature,
            request_timeout=float(timeout)
        )
        if ollama_kwargs:
            ollama_args.update(ollama_kwargs)
        llm = Ollama(**ollama_args)
        logger.info(f"LLM model loaded successfully: {model} (Ollama)")
        return llm
    else:
        # Default to HuggingFace for any other model
        llm = HuggingFaceLLM(
            model_name=model.value,
            context_window=context_window,
            max_new_tokens=max_new_tokens,
            query_wrapper_prompt=query_wrapper_prompt,
            tokenizer_name=tokenizer_name or model.value,
            model_kwargs=model_kwargs or {},
            generate_kwargs=generate_kwargs or {},
            device_map=device_map,
            is_chat_model=is_chat_model,
            callback_manager=callback_manager,
            system_prompt=system_prompt,
            **kwargs
        )
        logger.info(f"LLM model loaded successfully: {model} (HuggingFace)")
        return llm


def load_embed(
    model: Union[AiModel, AiModelHosted],
    temperature: Optional[float] = 0.1,
    timeout: Optional[float] = 10.0,
    context_window: int = 2048,
    max_new_tokens: int = 512,
    tokenizer_name: Optional[str] = None,
    model_kwargs: dict = None,
    generate_kwargs: dict = None,
    device_map: str = "auto",
    callback_manager: Any = None,
    ollama_kwargs: dict = None,
    **kwargs
) -> Union[Ollama, HuggingFaceLLM]:
    """
    Load and instantiate an embedding model instance based on the model type.
    Returns:
        An instantiated embedding model (Ollama or HuggingFaceLLM).
    Note:
        For HuggingFaceLLM, temperature and other generation parameters are NOT supported in the constructor or at inference time.
        These must be set in the model's configuration on HuggingFace, if supported.

    HuggingFaceLLM advanced parameters:
        context_window: int = 2048
            The context window size for the model.
        max_new_tokens: int = 512
            Maximum number of new tokens to generate.
        tokenizer_name: str = None
            Name of the tokenizer to use.
        model_kwargs: dict = None
            Additional kwargs passed to the model.
        generate_kwargs: dict = None
            Additional kwargs passed to the generate method.
        device_map: str = "auto"
            Device mapping for model loading (e.g., "auto", "cpu", "cuda").
        callback_manager: Any = None
            Callback manager for advanced use.
        ...and more, see HuggingFaceLLM class for all options.

    Ollama advanced parameters (pass as ollama_kwargs):
        model: str
            The model name to use (required).
        base_url: str = "http://localhost:11434"
            The base URL for the Ollama server.
        temperature: float = 0.1
            Sampling temperature for generation.
        request_timeout: float = 10.0
            Timeout for requests to the Ollama server.
        context_window: int = 2048
            The context window size for the model.
        num_ctx: int = None
            Number of context tokens.
        num_predict: int = None
            Number of tokens to predict.
        top_k: int = None
            Top-k sampling parameter.
        top_p: float = None
            Top-p (nucleus) sampling parameter.
        repeat_penalty: float = None
            Penalty for repeated tokens.
        stop: list = None
            List of stop sequences.
        ...and more, see Ollama class for all options.
    """
    if model in OLLAMA_MODELS:
        ollama_args = dict(
            model=model.value,
            base_url="http://localhost:11434",
            temperature=temperature,
            request_timeout=float(timeout)
        )
        if ollama_kwargs:
            ollama_args.update(ollama_kwargs)
        embed_model = Ollama(**ollama_args)
        logger.info(f"Embedding model loaded successfully: {model} (Ollama)")
        return embed_model
    else:
        # Default to HuggingFace for any other model
        embed_model = HuggingFaceLLM(
            model_name=model.value,
            context_window=context_window,
            max_new_tokens=max_new_tokens,
            tokenizer_name=tokenizer_name or model.value,
            model_kwargs={**(model_kwargs or {}), "token": os.getenv("HUGGINGFACE_API_KEY")},
            generate_kwargs=generate_kwargs or {},
            device_map=device_map,
            callback_manager=callback_manager,
            # **kwargs
        )
        logger.info(f"Embedding model loaded successfully: {model} (HuggingFace)")
        return embed_model