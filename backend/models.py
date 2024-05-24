from sqlalchemy import Column, String, Integer, DateTime, Enum, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import enum
from datetime import datetime

Base = declarative_base()

# Define the Sender Enum
class Sender(enum.Enum):
    USER = "USER"
    BOT = "BOT"

# Define the User model
class User(Base):
    __tablename__ = 'users'
    
    clerkId = Column(String, primary_key=True, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    apiKey = Column(String, unique=True, nullable=True)
    isApiVerified = Column(Boolean, default=False)
    links = Column(ARRAY(String))
    documents = relationship("Document", back_populates="user")
    queries = relationship("Query", back_populates="user")
    chatHistory = relationship("ChatHistory", back_populates="user")

# Define the Document model
class Document(Base):
    __tablename__ = 'documents'
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    clerkId = Column(String, ForeignKey('users.clerkId'))
    title = Column(String, nullable=True)
    link = Column(String, nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="documents")

# Define the Query model
class Query(Base):
    __tablename__ = 'queries'
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    clerkId = Column(String, ForeignKey('users.clerkId'))
    query = Column(String)
    createdAt = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="queries")

# Define the ChatHistory model
class ChatHistory(Base):
    __tablename__ = 'chat_history'
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    clerkId = Column(String, ForeignKey('users.clerkId'))
    message = Column(String)
    sender = Column(Enum(Sender))
    createdAt = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="chatHistory")
