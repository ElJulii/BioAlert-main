from fastapi import FastAPI, UploadFile, File
from typing import List
from utils import analyze_images

app = FastAPI()

@app.post("/analyze")
async def analyze(files: List[UploadFile] = File(...)):
    if not files:
        return {
            "animalDetected": False,
            "animals": [],
            "error": "No files uploaded"
        }

    result = analyze_images(files)
    return result