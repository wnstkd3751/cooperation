from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

def create_embeddings(texts):

    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=texts
    )

    return [
        item.embedding
        for item in response.data
    ]