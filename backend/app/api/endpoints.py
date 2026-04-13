from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
import uuid

from app.core.database import get_async_session
from app.models.problem import Problem, Reduction
from app.schemas.problem import ProblemCreate, ProblemRead, ReductionCreate, ReductionRead

router = APIRouter()

@router.get("/problems", response_model=List[ProblemRead])
async def get_problems(session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(select(Problem))
    return result.scalars().all()

@router.post("/problems", response_model=ProblemRead)
async def create_problem(problem: ProblemCreate, session: AsyncSession = Depends(get_async_session)):
    db_problem = Problem(**problem.model_dump())
    session.add(db_problem)
    await session.commit()
    await session.refresh(db_problem)
    return db_problem

@router.get("/problems/{problem_id}", response_model=ProblemRead)
async def get_problem(problem_id: str, session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(select(Problem).where(Problem.id == problem_id))
    problem = result.scalars().first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem

@router.get("/reductions", response_model=List[ReductionRead])
async def get_reductions(session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(select(Reduction))
    return result.scalars().all()

@router.post("/reductions", response_model=ReductionRead)
async def create_reduction(reduction: ReductionCreate, session: AsyncSession = Depends(get_async_session)):
    db_reduction = Reduction(**reduction.model_dump())
    session.add(db_reduction)
    await session.commit()
    await session.refresh(db_reduction)
    return db_reduction
