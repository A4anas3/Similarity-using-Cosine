import os
import pandas as pd
from fastapi import FastAPI, UploadFile, File
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone
from fastapi.middleware.cors import CORSMiddleware



INDEX_NAME = "science"
MODEL_NAME = "all-MiniLM-L6-v2"


app = FastAPI(title="Excel → Pinecone Semantic Search API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],  # Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key = "***"
if not api_key:
    raise RuntimeError("PINECONE_API_KEY not set")

pc = Pinecone(api_key=api_key)
index = pc.Index(INDEX_NAME)
model = SentenceTransformer(MODEL_NAME)






@app.post("/search")
def search(query: str):
  
    query_vector = model.encode(query).tolist()

    result = index.query(
        vector=query_vector,
        top_k=5,
    )

    matches = []
    for match in result["matches"]:
        matches.append({
            "id": match["id"],
            "score": round(match["score"], 4)
        })

    return {
        "query": query,
        "results": matches
    }




