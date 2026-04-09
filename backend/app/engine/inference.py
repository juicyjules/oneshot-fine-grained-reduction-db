import sympy as sp
import networkx as nx
from typing import Dict, List, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.problem import Problem, Reduction

class ComplexityEngine:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def build_graph(self) -> nx.DiGraph:
        G = nx.DiGraph()
        prob_result = await self.session.execute(select(Problem))
        problems = prob_result.scalars().all()
        for p in problems:
            G.add_node(p.id, **p.__dict__)

        red_result = await self.session.execute(select(Reduction))
        reductions = red_result.scalars().all()
        for r in reductions:
            G.add_edge(r.source_id, r.target_id, **r.__dict__)

        return G

    def compose_runtimes(self, runtime_target: str, relation: Dict[str, Any]) -> str:
        if not runtime_target or not relation:
            return None

        try:
            n = sp.Symbol('n')
            expr_target = sp.sympify(runtime_target.replace('O(', '').replace(')', ''))

            n_target_mapping = relation.get('n_target')
            if n_target_mapping:
                mapping_expr = sp.sympify(n_target_mapping)
                composed = expr_target.subs(n, mapping_expr)

                overhead = relation.get('overhead', '0')
                overhead_expr = sp.sympify(overhead)

                final_expr = sp.simplify(composed + overhead_expr)
                return str(final_expr)
        except Exception as e:
            print(f"SymPy Error composing runtimes: {e}")
            return None

    async def infer_hardness(self):
        G = await self.build_graph()

        assumptions = [n for n, attr in G.nodes(data=True) if attr.get('is_assumption') == True]

        inferred_updates = []

        for assumption_id in assumptions:
            reachable = nx.descendants(G, assumption_id)
            for node_id in reachable:
                pass

        return inferred_updates
