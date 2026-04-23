"""
Agent layer — reads the workflow SOP, validates input, calls the repurpose tool.
Run with: uvicorn server:app --reload
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from tools.repurpose_content import repurpose

app = FastAPI(title="Content Repurposing Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["POST"],
    allow_headers=["*"],
)


class RepurposeRequest(BaseModel):
    content: str


@app.post("/api/repurpose")
async def repurpose_content(req: RepurposeRequest):
    try:
        results = await repurpose(req.content)
        return {"results": results}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent error: {str(e)}")
