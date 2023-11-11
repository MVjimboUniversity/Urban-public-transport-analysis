from fastapi import FastAPI

from .routers import tests

app = FastAPI()

app.include_router(tests.router)

@app.get("/")
async def root():
    return {"message": "Hello World"}