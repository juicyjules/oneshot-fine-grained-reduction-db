from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.security import auth_backend, fastapi_users
from app.schemas.user import UserRead, UserCreate, UserUpdate
from app.api.endpoints import router as api_router

app = FastAPI(title="Fine-Grained Reduction Database (FGRDB)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"], # For dev. Configure in production.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth/jwt",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)

app.include_router(api_router, prefix="/api", tags=["core"])

@app.get("/")
def read_root():
    return {"message": "Welcome to FGRDB API"}
