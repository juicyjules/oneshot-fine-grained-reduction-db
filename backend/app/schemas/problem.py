from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
import uuid

from app.models.problem import ProblemStatusEnum
from app.models.problem import ReductionStatusEnum, ReductionTypeEnum

class ProblemBase(BaseModel):
    slug: str
    title: str
    description: str
    latex_definition: Optional[str] = None
    complexity_class: Optional[str] = None
    is_assumption: bool = False
    status: ProblemStatusEnum = ProblemStatusEnum.pending
    current_runtime: Optional[str] = None
    io_schema: Optional[Dict[str, Any]] = None

class ProblemCreate(ProblemBase):
    pass

class ProblemRead(ProblemBase):
    id: str

    class Config:
        from_attributes = True

class ReductionBase(BaseModel):
    source_id: str
    target_id: str
    type: ReductionTypeEnum = ReductionTypeEnum.deterministic
    technique: Optional[str] = None
    status: ReductionStatusEnum = ReductionStatusEnum.pending
    runtime_relation: Optional[Dict[str, Any]] = None

class ReductionCreate(ReductionBase):
    pass

class ReductionRead(ReductionBase):
    id: str

    class Config:
        from_attributes = True
