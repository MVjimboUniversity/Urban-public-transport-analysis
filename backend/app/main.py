from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import tests

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "DELETE", "PATCH", "PUT"],
    allow_headers=["*"],
)

app.include_router(tests.router)

@app.get("/")
async def root():
    return {"message": "Hello World"}