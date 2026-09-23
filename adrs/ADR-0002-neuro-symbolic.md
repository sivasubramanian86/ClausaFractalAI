# ADR-0002: Formal Constraint Verification via Z3 Theorem Prover

## Status
Accepted

## Context
Contractual risk analysis requires absolute mathematical guarantees that proposed clauses and risk assessments strictly obey governing enterprise policies, such as:
1. `AggregateLiabilityCap <= AnnualContractValue`
2. `TerminationNoticeDays >= StatutoryMinimumDays (e.g. 30)`
3. `AuditWindowNoticeDays >= 14`
4. `MutualIndemnity == True` when `VendorLiabilityExceedsThreshold == True`
5. `NoDirectConsequentialDamagesWaiver == True`

Standard regex checks or probabilistic LLM prompt instructions fail when multi-clause interactions produce contradictory terms.

## Decision
We embed the **Z3 SMT Solver** (`z3-solver>=5.1.0`) directly into System 2 of the ClausaFractalAI execution graph:
1. Candidate action plans and contract clauses are parsed into formal Z3 integer, real, and boolean assertions.
2. The solver invokes `check()`. If `sat`, a concrete model is generated confirming satisfiability.
3. If `unsat`, `solver.unsat_core()` extracts the minimal conflicting set of constraints, formatted into structured JSON diffs for the self-repair loop.

## Consequences
- Guarantees formal proof of contract safety before any human lawyer or automated pipeline acts on the intelligence.
- Enables single-shot targeted neural repair by feeding the exact algebraic contradiction back to the model.
