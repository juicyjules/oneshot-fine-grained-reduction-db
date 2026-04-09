# Architectural Specification: Fine-Grained Reduction Database (FGRDB)

## 1. System Vision & Logic
A collaborative "Wikipedia for Complexity Theory" that manages a graph of algorithmic problems and their reductions. It provides researchers with automated complexity propagation and high-fidelity visualization.

## 2. Strategic Tech Stack Reasoning (FastAPI/Python)
The backend is implemented in **FastAPI (Python)** for the following domain-specific reasons:
- **Symbolic Algebra (SymPy):** Essential for composing and simplifying reduction runtime formulas (e.g., composing $O(n^2)$ and $O(n \sqrt{n})$).
- **Graph Intelligence (NetworkX):** Provides a robust library for pathfinding, transitive closure, and complexity propagation logic on the reduction network.
- **Type Safety (Pydantic):** Ensures that complex JSONB structures for formulas and problem schemas are strictly validated before storage.
- **Ecosystem Alignment:** Python is the primary language of the algorithmic research community, lowering the barrier for future academic contributions.

## 3. Data Architecture (ER Model)

The system uses **PostgreSQL** with a hybrid Relational/JSONB approach to support both strict metadata and flexible mathematical schemas.

### 3.1 Core Entities
- **Users**: `id (UUID)`, `username`, `email`, `password_hash`, `role (ENUM: Guest, Contributor, Editor, Curator)`, `created_at`.
- **Problems**: 
    - `id (UUID)`, `slug (Unique String)`, `title`, `description (Markdown + KaTeX)`, `latex_definition`, `complexity_class (ENUM)`, `is_assumption (Boolean)`, `status (ENUM: Pending, Published, Archived)`.
    - `current_runtime (String/Formula)`: e.g., "n^2 log n".
    - `io_schema (JSONB)`: Defines input/output types (e.g., `{"input": "Graph", "output": "Boolean"}`).
- **Reductions**: 
    - `id (UUID)`, `source_id (FK -> Problems)`, `target_id (FK -> Problems)`, `type (ENUM: Deterministic, Randomized)`, `technique (String)`, `status (ENUM)`.
    - `runtime_relation (JSONB)`: Stores the symbolic mapping (e.g., `{"n_target": "n_source^2", "overhead": "n_source log n"}`).

### 3.2 Versioning & Review System (Wiki-Style)
- **ContentVersions**: 
    - `id (UUID)`, `entity_type (ENUM: Problem, Reduction)`, `entity_id (UUID)`, `author_id (FK -> Users)`.
    - `data_snapshot (JSONB)`: Full state of the entity at this version.
    - `diff (JSONB)`: Structural changes for easy review.
    - `review_status (ENUM: Pending, Approved, Rejected)`.
    - `curator_comment`, `created_at`.

### 3.3 Research & Engagement
- **Citations**: `id`, `bibtex`, `doi`, `authors`, `year`, `journal`.
- **EntityCitations**: `id`, `entity_id`, `citation_id`, `entity_type` (Join table for Problems/Reductions).
- **Comments**: `id`, `entity_id`, `user_id`, `content`, `parent_id (Self-FK for threads)`.
- **Votes**: `id`, `user_id`, `entity_id`, `value (+1 / -1)`.

## 4. Immersive Graph Visualization & Interaction
To ensure a "flashy and beautiful" experience, the visualization layer must be treated as a high-performance interactive application.

### 4.1 Rendering Engine (React Flow + D3)
- **Hybrid Layout:** Use **D3-force** for a "living" initial layout that settles into a stable state. Use **Dagre** for organized "Reduction Tree" views when tracing a specific complexity path.
- **WebGL Acceleration:** For large graphs, utilize a WebGL-based renderer to maintain 60FPS during pan/zoom.
- **Custom Node Components:** Nodes should be "Cards" with:
    - Inline LaTeX rendering (KaTeX).
    - Status indicators (e.g., "Hard assuming SETH").
    - Mini-charts showing the "Growth Curve" of the problem's runtime.

### 4.2 Animations & Interactive Feedback
- **Living Edges:** Use animated dashed lines to represent "Randomized" reductions or "Active Propagation" of hardness.
- **Highlighting:** Hovering over a node must highlight its **Transitive Closure** (all reachable problems) while dimming unrelated nodes.
- **Focus Mode:** Clicking a node smoothly transitions the camera (Interpolated Zoom) and opens a "Detail Drawer" with full Markdown descriptions and citations.
- **Smooth Transitions:** Use **Framer Motion** for UI elements (drawers, modals) and internal React Flow transitions to ensure a polished, modern feel.

### 4.3 Advanced Filtering UI
- **Dynamic Lenses:** Toggle filters to "Hide non-combinatorial reductions" or "Only show problems under the $O(n^2)$ barrier."
- **Path Highlighting:** A search bar to select two problems ($A$ and $B$), which then illuminates the "Most Efficient Reduction Path" between them with a glowing neon effect.

## 5. Implementation Best Practices (The "Don't Reinvent" Guide)

To ensure security and maintainability, the following libraries and patterns **must** be used:

### 5.1 Authentication & Authorization
- **Do NOT write custom auth logic.** Use `FastAPI Users` with the `SQLAlchemy` backend. It provides ready-made JWT handling, password hashing (Argon2), and registration/login flows.
- **RBAC Management:** Use a simple middleware or FastAPI Dependency that checks the `role` field in the user object against the required permission level for each route.

### 5.2 Frontend State & Forms
- **Graph State:** Use `Zustand` for high-performance, centralized state management of the graph nodes and edges.
- **Form Handling:** Use `React Hook Form` combined with `Zod` for schema-based validation of the complex "Problem" and "Reduction" submission forms.
- **Mathematical Input:** Use `mathquill` or `react-math-view` to provide a visual LaTeX editor for users, ensuring that the strings sent to the backend are consistently formatted for SymPy.

### 5.3 Database & API
- **Migrations:** Use `Alembic` for PostgreSQL schema evolutions. Never manually edit the database schema.
- **Documentation:** Leverage FastAPI’s automatic Swagger UI (`/docs`) as the primary API reference.

### 5.4 Async & Background Tasks
- **Complexity Propagation:** Symbolic calculations can be CPU-heavy. Use `FastAPI BackgroundTasks` for simple updates, or `Celery/Taskiq` if the graph analysis scales significantly.

## 6. Key Functional Modules

### 6.1 Automated Complexity Engine
- **Inference Engine:** A background process (using SymPy + NetworkX) that traverses the graph. 
- **Rule:** If $P_1 \to P_2$ exists with relation $R$, and $P_2$ is "Hard under Assumption $X$", $P_1$ is automatically flagged as "Hard under Assumption $X$" with a derived lower bound formula.

### 6.2 High-Fidelity Visualization (React Flow)
- **Layout Engine:** Force-directed layout for the global view; hierarchical layout for specific reduction paths.
- **IPE Export:** A service that maps the current graph viewport to IPE XML format, converting CSS styles to IPE primitives and wrapping text in LaTeX delimiters.

### 6.3 Crowdsourced Workflow
- **Submission:** Non-authorized users submit a `ContentVersion` (Pending).
- **Review Dashboard:** Curators view a side-by-side diff. Approving a version updates the "Current" record in the `Problems` or `Reductions` table and triggers a re-run of the Complexity Engine.

## 7. Security & Integrity
- **RBAC:** Curators can "Lock" foundational nodes (e.g., SETH assumption) to prevent accidental edits.
- **Integrity:** PostgreSQL constraints prevent self-looping reductions and duplicate slugs.
- **Rate Limiting:** Protects the symbolic solver from complex "formula-bomb" attacks.
