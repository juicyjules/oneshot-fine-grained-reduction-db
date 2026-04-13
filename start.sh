#!/usr/bin/env bash
cd backend
# make sure db is seeded
alembic upgrade head || true
python seed.py || true
uvicorn main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

cd ../frontend
npm run dev &
FRONTEND_PID=$!

wait $BACKEND_PID $FRONTEND_PID
