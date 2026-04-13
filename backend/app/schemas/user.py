import uuid
from typing import Optional
from fastapi_users import schemas
from app.models.user import RoleEnum

class UserRead(schemas.BaseUser[uuid.UUID]):
    username: str
    role: RoleEnum

class UserCreate(schemas.BaseUserCreate):
    username: str

class UserUpdate(schemas.BaseUserUpdate):
    username: Optional[str] = None
    role: Optional[RoleEnum] = None
