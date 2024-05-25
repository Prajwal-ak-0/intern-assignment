from fastapi import FastAPI, HTTPException, Depends
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal, engine
from pydantic import BaseModel
from sqlalchemy.orm import Session
import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:5173",
    "localhost:5173",
    "https://jubilant-spork-w6rw5v6qrwxf5ggr-5173.app.github.dev",
    "jubilant-spork-w6rw5v6qrwxf5ggr-5173.app.github.dev"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class UserCreate(BaseModel):
    clerkId: str
    username: str
    email: str
    link: str

@app.post("/api/users/", response_model=UserCreate)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(
        clerkId=user.clerkId,
        email=user.email,
        username=user.username,
        links=user.link
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    print("User created successfully")
    print(db_user)
    return db_user
