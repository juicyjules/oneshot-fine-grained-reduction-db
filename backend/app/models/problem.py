from sqlalchemy import Column, String, Boolean, Enum, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
import uuid

from app.models.base import Base

class ProblemStatusEnum(str, enum.Enum):
    pending = "Pending"
    published = "Published"
    archived = "Archived"

class Problem(Base):
    __tablename__ = "problem"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    slug = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)  # Markdown + KaTeX
    latex_definition = Column(String, nullable=True)
    complexity_class = Column(String, nullable=True)
    is_assumption = Column(Boolean, default=False)
    status = Column(Enum(ProblemStatusEnum), default=ProblemStatusEnum.pending)

    current_runtime = Column(String, nullable=True) # e.g. "n^2 log n"
    io_schema = Column(JSON, nullable=True) # e.g. {"input": "Graph", "output": "Boolean"}

    # Relationships
    reductions_out = relationship("Reduction", foreign_keys="[Reduction.source_id]", back_populates="source")
    reductions_in = relationship("Reduction", foreign_keys="[Reduction.target_id]", back_populates="target")

class ReductionTypeEnum(str, enum.Enum):
    deterministic = "Deterministic"
    randomized = "Randomized"

class ReductionStatusEnum(str, enum.Enum):
    pending = "Pending"
    published = "Published"
    archived = "Archived"

class Reduction(Base):
    __tablename__ = "reduction"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    source_id = Column(String, ForeignKey("problem.id"), nullable=False)
    target_id = Column(String, ForeignKey("problem.id"), nullable=False)
    type = Column(Enum(ReductionTypeEnum), default=ReductionTypeEnum.deterministic)
    technique = Column(String, nullable=True)
    status = Column(Enum(ReductionStatusEnum), default=ReductionStatusEnum.pending)

    runtime_relation = Column(JSON, nullable=True) # e.g. {"n_target": "n_source^2", "overhead": "n_source log n"}

    source = relationship("Problem", foreign_keys=[source_id], back_populates="reductions_out")
    target = relationship("Problem", foreign_keys=[target_id], back_populates="reductions_in")
