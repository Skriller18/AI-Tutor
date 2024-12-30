from fastapi import FastAPI, UploadFile, File
from openai import OpenAI
import uvicorn
import base64
from PIL import Image
import io
import os
from dotenv import load_dotenv
from urllib.parse import unquote
from fastapi.exceptions import HTTPException
from typing import Dict
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.post("/api/solve")
async def solve_question(question: str):
    try:
        decoded_question = unquote(question)
        
        decoded_question = decoded_question.strip(',"')
        
        response = client.chat.completions.create(
            model="o1-mini",
            messages=[
                {"role": "user", "content": f"You are a helpful math tutor. Provide step-by-step solutions.Solve this question step by step: {decoded_question}"}
            ]
        )
        return {"solution": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/hint")
async def get_hint(question: str, image: UploadFile = File(...)) -> Dict[str, str]:
    image_content = await image.read()
    base64_image = base64.b64encode(image_content).decode()
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Analyze the partial solution and provide next steps."},
            {
                "role": "user", 
                "content": [
                    {"type": "text", "text": f"Question: {question}\nBased on my work so far, what should be my next step?"},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}",
                            "detail": "high"
                        }
                    }
                ]
            }
        ],
    )    
    return {"hint": response.choices[0].message.content}

@app.post("/api/correct")
async def check_solution(question: str, image: UploadFile = File(...)) -> Dict[str, str]:
    image_content = await image.read()
    base64_image = base64.b64encode(image_content).decode()
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Check this solution for errors and provide corrections. If the solution is correct, type 'The solution is correct'."},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": f"Question: {question}"},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}",
                            "detail": "high"
                        }
                    }
                ]
            }
        ],
        max_tokens=300
    )
    return {"correction": response.choices[0].message.content}

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)