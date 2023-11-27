from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import network

app = FastAPI(title="Urban Public Transport Analysis Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "DELETE", "PATCH", "PUT"],
    allow_headers=["*"],
)

app.include_router(network.router)

@app.get("/")
async def root():
    return {"message": "Urban Public Transport Analysis Service"}