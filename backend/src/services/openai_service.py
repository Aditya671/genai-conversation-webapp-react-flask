from openai import openai
from typing import Union

def get_openai_chat_response(prompt: Union[str, list[str]]) -> str:
    if isinstance(prompt, str):
        prompt = {"role": "user", "content": prompt}
    return openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  # Use the desired model
        messages=[prompt]
    )
