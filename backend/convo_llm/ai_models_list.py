from enum import Enum
from typing import Union

class AiModelResponseMode(str, Enum):
    """Mode determining the detail level of engine responses."""
    DETAILED = 'detailed'
    CONCISE = 'concise'

class AiModel(str, Enum):
    """Enum for supported AI models.
    Supported models:
    o3-mini: Proprietary model, lightweight, general-purpose.
    o3: Proprietary model, general-purpose.
    o4-mini: Proprietary model, lightweight, general-purpose.
    o4-mini-high: Proprietary model, high performance.
    gpt-4o: OpenAI's flagship model, strong at reasoning and chat.
    gpt-4.1: OpenAI's advanced model, strong at reasoning and general tasks.
    gpt-4.1-mini: OpenAI's lightweight model.
    deepseek-r1: Open-source, good for research and general tasks.
    llama2-7b: Meta's open-source model, general-purpose, good for reasoning and chat.
    llama3-8b: Meta's open-source model, improved reasoning, chat, and instruction following.
    mistral-7b: Fast, efficient, strong at summarization and QA.
    gemma-7b: Google's open-source model, good for general tasks and chat.
    ollama: Local inference framework for running open-source models on your machine.
    vicuna-7b: Llama-based, good for chat and instruction following.
    phi-2: Microsoft's small, efficient model, good for reasoning and code.
    stablelm-2-1b: Stability AI's small, general-purpose model.
    falcon-7b: TII's open-source model, good for summarization, QA, and chat.
    dolly-v2-12b: Databricks' model, fine-tuned for instruction following.
    redpajama-incite-7b: Together's model, good for chat and general tasks.
    starling-lm-7b: HuggingFace's model, good for reasoning and chat.
    nous-hermes-2-mixtral-8x7b: Strong at reasoning and following instructions.
    openhermes-2.5-mistral-7b: Mistral-based, good for chat and reasoning.
    ollama-vicuna-7b: Llama-based, Ollama format, good for chat and local inference.
    codellama-7b: Meta's code LLM, excellent for code generation and reasoning.
    mpt-7b: MosaicML's model, general-purpose, good for reasoning and summarization.
    falcon-40b: TII's large model, strong at reasoning, summarization, and QA.
    yi-34b: 01.AI's model, good for reasoning, chat, and multilingual tasks.
    qwen-7b: Alibaba's model, good for reasoning, chat, and code.
    """

    O3_MINI = "o3-mini"
    O3 = "o3"
    O4_MINI = "o4-mini"
    O4_MINI_HIGH = "o4-mini-high"
    GPT4O = "gpt-4o"
    GPT41 = "gpt-4.1"
    GPT41_MINI = "gpt-4.1-mini"
    DEEPSEEK_R1 = "deepseek-ai/DeepSeek-R1"
    LLAMA2_7B = "llama2-7b"           # Free, open-source. General-purpose, good for reasoning and chat.
    LLAMA3_8B = "llama3-8b"           # Free, open-source. Improved reasoning, chat, and instruction following.
    MISTRAL_7B = "mistral-7b"         # Free, open-source. Fast, efficient, strong at summarization and QA.
    GEMMA_7B = "gemma-7b"             # Free, open-source. Google, good for general tasks and chat.
    OLLAMA = "ollama"                 # Free, open-source, local inference framework (runs models locally).
    VICUNA_7B = "vicuna-7b"           # Free, open-source, Llama-based. Good for chat and instruction following.
    PHI_2 = "phi-2"                   # Free, open-source, Microsoft. Small, efficient, good for reasoning and code.
    STABLELM_2_1B = "stablelm-2-1b"   # Free, open-source, Stability AI. Good for general tasks, small footprint.
    FALCON_7B = "falcon-7b"           # Free, open-source, TII. Good for summarization, QA, and chat.
    DOLLY_V2_12B = "dolly-v2-12b"     # Free, open-source, Databricks. Fine-tuned for instruction following.
    REDPAJAMA_INCITE_7B = "redpajama-incite-7b" # Free, open-source, Together. Good for chat and general tasks.
    STARLING_LM_7B = "starling-lm-7b" # Free, open-source, HuggingFace. Good for reasoning and chat.
    NOUS_HERMES_2_MIXTRAL_8X7B = "nous-hermes-2-mixtral-8x7b" # Free, open-source, Nous Research. Strong at reasoning and following instructions.
    OPENHERMES_2_5_MISTRAL_7B = "openhermes-2.5-mistral-7b" # Free, open-source, Mistral-based. Good for chat and reasoning.
    OLLAMA_VICUNA_7B = "ollama-vicuna-7b" # Free, open-source, Llama-based, Ollama format. Good for chat and local inference.
    CODELLAMA_7B = "codellama-7b"                # Meta's open-source code LLM. Excellent for code generation and reasoning.
    MPT_7B = "mpt-7b"                            # MosaicML's open-source model. General-purpose, good for reasoning and summarization.
    FALCON_40B = "falcon-40b"                    # TII's large open-source model. Strong at reasoning, summarization, and QA.
    YI_34B = "yi-34b"                            # 01.AI's open-source model. Good for reasoning, chat, and multilingual tasks.
    QWEN_7B = "qwen-7b"                          # Alibaba's open-source model. Good for reasoning, chat, and code.


class AiModelHosted(str, Enum):
    """
    Free and open-source models available via HuggingFace Inference API (cloud, no local download required).
    Usage: These models do not require local download or GPU, but do require a HuggingFace API key for hosted inference.
    """
    LLAMA3_8B = "meta-llama/Meta-Llama-3-8B"
    MISTRAL_7B_INSTRUCT_V02 = "mistralai/Mistral-7B-Instruct-v0.2"
    GEMMA_7B_IT = "google/gemma-7b-it"
    PHI3_MINI_4K_INSTRUCT = "microsoft/Phi-3-mini-4k-instruct"
    TINYLLAMA_1_1B_CHAT = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
    QWEN1_5_7B_CHAT = "Qwen/Qwen1.5-7B-Chat"
    QWEN3_EMBEDDING = "Qwen/Qwen3-Embedding-0.6B"
    GEMMA_2B_IT = "google/gemma-2b-it"
    MISTRAL_7B_INSTRUCT_V01 = "mistralai/Mistral-7B-Instruct-v0.1"
    LLAMA2_7B_CHAT = "meta-llama/Llama-2-7b-chat-hf"
    NOUS_HERMES_2_MISTRAL_7B_DPO = "TheBloke/Nous-Hermes-2-Mistral-7B-DPO"
    OPENHERMES_2_5_MISTRAL_7B = "TheBloke/OpenHermes-2.5-Mistral-7B"
    CODELLAMA_7B_INSTRUCT = "TheBloke/CodeLlama-7B-Instruct-GGUF"
    MISTRAL_7B_INSTRUCT_V02_GGUF = "TheBloke/Mistral-7B-Instruct-v0.2-GGUF"
    PHI_2_GGUF = "TheBloke/phi-2-GGUF"
    ZEPHYR_7B_BETA_GGUF = "TheBloke/zephyr-7B-beta-GGUF"
    STABLELM_2_1B_GGUF = "TheBloke/StableLM-2-1B-GGUF"
    MIXTRAL_8X7B_INSTRUCT = "TheBloke/Mixtral-8x7B-Instruct-v0.1-GGUF"
    STARLING_LM_7B_ALPHA = "TheBloke/Starling-LM-7B-alpha-GGUF"
    MPT_7B_INSTRUCT = "TheBloke/MPT-7B-Instruct-GGUF"
    FALCON_7B_INSTRUCT = "TheBloke/Falcon-7B-Instruct-GGUF"
    

def resolve_model(model_str: str) -> Union[AiModel, AiModelHosted]:
        if model_str in AiModel._value2member_map_:
            return AiModel(model_str)
        elif model_str in AiModelHosted._value2member_map_:
            return AiModelHosted(model_str)
        else:
            raise ValueError(f"Invalid model: {model_str}")