from fastapi import FastAPI
from sentence_transformers import SentenceTransformer
import json
from fastapi import Request


app = FastAPI();
model = SentenceTransformer("nomic-ai/nomic-embed-text-v1", trust_remote_code=True)

@app.post("/embed/{type_of_query}")
async def embedText(type_of_query: str, request: Request):
    data = await request.json()
    print("data:", data)
    texts = [f"{type_of_query}: {item['pageContent']}" for item in data]
    embeddings = model.encode(texts).tolist();
    return {"embeddings" : embeddings}


