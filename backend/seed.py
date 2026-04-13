import asyncio
import uuid
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from app.models.base import Base
from app.models.user import User, RoleEnum
from app.models.problem import Problem, Reduction, ProblemStatusEnum, ReductionTypeEnum, ReductionStatusEnum
from app.core.config import settings

# Setup DB session
ASYNC_DATABASE_URL = settings.DATABASE_URL.replace("sqlite://", "sqlite+aiosqlite://")
engine = create_async_engine(ASYNC_DATABASE_URL, echo=True)
async_session_maker = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def seed():
    async with async_session_maker() as session:
        # Create a curator user
        curator_id = uuid.uuid4()
        curator = User(
            id=curator_id,
            email="curator@fgrdb.com",
            hashed_password="hashedpassword_placeholder", # We aren't testing login directly with seed, but this is required by fastapi_users
            is_active=True,
            is_superuser=False,
            is_verified=True,
            username="AdminCurator",
            role=RoleEnum.curator
        )
        session.add(curator)

        # Create canonical problems
        seth = Problem(
            slug="seth",
            title="Strong Exponential Time Hypothesis (SETH)",
            description="SETH states that for every $\\epsilon > 0$, there exists a $k$ such that $k$-SAT cannot be solved in $O(2^{(1-\\epsilon)n})$ time.",
            complexity_class="Assumption",
            is_assumption=True,
            status=ProblemStatusEnum.published,
            current_runtime="2^n"
        )

        orth_vectors = Problem(
            slug="ov",
            title="Orthogonal Vectors (OV)",
            description="Given two sets $A, B \\subseteq \\{0,1\\}^d$ of size $n$, are there $a \\in A, b \\in B$ such that $a \\cdot b = 0$?",
            complexity_class="P",
            status=ProblemStatusEnum.published,
            current_runtime="n^2"
        )

        apsp = Problem(
            slug="apsp",
            title="All-Pairs Shortest Paths (APSP)",
            description="Find the shortest paths between all pairs of vertices in an edge-weighted directed graph.",
            complexity_class="P",
            status=ProblemStatusEnum.published,
            current_runtime="n^3"
        )

        negative_triangle = Problem(
            slug="neg-triangle",
            title="Negative Triangle",
            description="Does a given weighted graph contain a triangle with a negative sum of edge weights?",
            complexity_class="P",
            status=ProblemStatusEnum.published,
            current_runtime="n^3"
        )

        session.add_all([seth, orth_vectors, apsp, negative_triangle])
        await session.flush() # To get IDs

        # Create Reductions
        red1 = Reduction(
            source_id=seth.id,
            target_id=orth_vectors.id,
            type=ReductionTypeEnum.deterministic,
            technique="Split-and-List",
            status=ReductionStatusEnum.published,
            runtime_relation={"n_target": "2^{n/2}"}
        )

        red2 = Reduction(
            source_id=apsp.id,
            target_id=negative_triangle.id,
            type=ReductionTypeEnum.deterministic,
            technique="Subcubic Equivalence",
            status=ReductionStatusEnum.published,
            runtime_relation={"n_target": "n"}
        )

        session.add_all([red1, red2])

        await session.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed())
