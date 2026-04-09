from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from sqlalchemy import Column, String, Enum
from sqlalchemy.orm import relationship
import enum

from app.models.base import Base

class RoleEnum(str, enum.Enum):
    guest = "guest"
    contributor = "contributor"
    editor = "editor"
    curator = "curator"

class User(SQLAlchemyBaseUserTableUUID, Base):
    __tablename__ = "user"

    username = Column(String, nullable=False, unique=True)
    role = Column(Enum(RoleEnum), default=RoleEnum.guest, nullable=False)
