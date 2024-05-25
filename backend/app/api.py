from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated, List
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal, engine
from pydantic import BaseModel
from sqlalchemy.orm import Session
from models import UserCreate, User
import models 

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:5173",
    "localhost:5173"
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

@app.post("/users/", response_model=UserCreate)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(
        clerkId=user.clerkId,
        email=user.email,
        username=user.username,
        links=user.links
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    print("User created successfully")
    print(db_user)
    return db_user