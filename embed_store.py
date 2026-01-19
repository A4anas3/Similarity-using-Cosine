import os
import pandas as pd
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone


INDEX_NAME = "science"
EXCEL_PATH = "unique_descriptions.xlsx"
MODEL_NAME = "all-MiniLM-L6-v2"


def main():
   
    api_key ="pcsk_6LUd8z_2GLWczaA8gLmDbBfG2SSAKxK3Hj3RfJKCwe5HMc9LVJK3EgmzMQvcqFdEeXXzC5"
    if not api_key:
        raise ValueError("PINECONE_API_KEY not set")

    
    pc = Pinecone(api_key=api_key)
    index = pc.Index(INDEX_NAME)

    
    df = pd.read_excel(EXCEL_PATH)

   
    model = SentenceTransformer(MODEL_NAME)

    
    vectors = []
    for _, row in df.iterrows():
        vector = model.encode(row["Description"]).tolist()
        vectors.append({
            "id": str(row["ID"]),
            "values": vector,
            
        })

    # Upload
    index.upsert(vectors=vectors)
    print("✅ Data successfully stored in Pinecone")

if __name__ == "__main__":
    main()
