from sqlalchemy import Column, String, Enum, JSON, ForeignKey, DateTime
from sqlalchemy.sql import func
import enum
import uuid

from app.models.base import Base

class EntityTypeEnum(str, enum.Enum):
    problem = "Problem"
    reduction = "Reduction"

class ReviewStatusEnum(str, enum.Enum):
    pending = "Pending"
    approved = "Approved"
    rejected = "Rejected"

class ContentVersion(Base):
    __tablename__ = "content_version"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    entity_type = Column(Enum(EntityTypeEnum), nullable=False)
    entity_id = Column(String, nullable=False) # Problem or Reduction ID
    author_id = Column(String, ForeignKey("user.id"), nullable=False)

    data_snapshot = Column(JSON, nullable=False)
    diff = Column(JSON, nullable=True)

    review_status = Column(Enum(ReviewStatusEnum), default=ReviewStatusEnum.pending)
    curator_comment = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
