"""Tests for Agent Harness 2.0 Module.

Validates:
1. Data models (AgentPlan, AgentAction, VerificationCheck, HarnessFeedback, HarnessResult).
2. HarnessMemoryStore (channels, formatting, constraints).
3. GitGuard (inspection, forbidden files detection, rollback).
4. VerificationEngine (syntax, behavior, architecture layers, error hashing).
5. AgentHarness (plan review, recovery loop, infinite loop detection, max attempts boundary).
"""

from harness.agent_harness import AgentHarness
from harness.git_guard import GitGuard
from harness.memory_store import HarnessMemoryStore
from harness.models import (
    AgentAction,
    AgentPlan,
    HarnessFeedback,
    HarnessResult,
    VerificationCheck,
    VerificationReport,
)
from harness.verification_engine import VerificationEngine


def test_harness_models():
    """Verify serialization and defaults of Harness 2.0 data models."""
    plan = AgentPlan(
        task="Add endpoint",
        target_files=["src/api/routes.py"],
        proposed_changes=["Add /status route"],
        architecture_rationale="Public liveness check",
    )
    assert plan.task == "Add endpoint"
    assert not plan.is_approved

    action = AgentAction(
        action_type="write_file",
        target="src/api/routes.py",
        payload={"content": "def status(): pass"},
        rationale="create file",
    )
    assert action.action_type == "write_file"

    check = VerificationCheck(
        name="typecheck",
        layer="syntax",
        success=True,
    )
    assert check.success

    report = VerificationReport(
        success=True,
        checks=[check],
    )
    assert report.success
    assert report.failing_layer is None

    feedback = HarnessFeedback(
        attempt=1,
        what_failed="syntax",
        why_it_failed="SyntaxError line 10",
        what_changed="Added route",
        what_to_try_next="Fix indentation",
        error_hash="abc123",
    )
    assert feedback.attempt == 1

    result = HarnessResult(
        success=True,
        task="Add endpoint",
        total_attempts=1,
        message="Done",
    )
    assert result.success


def test_harness_memory_store():
    """Verify persistent memory channels and formatted prompt generation."""
    mem = HarnessMemoryStore()
    assert len(mem.get_architecture_rules()) == 5

    mem.record_decision("API Pattern", "Use FastAPI routers", "Ensures modularity")
    mem.record_progress("Phase 1", "Scaffolded project")
    mem.record_failure("DB Direct Call", "Controller bypassed repo", "Use service layer")

    assert len(mem.get_decisions()) == 1
    assert len(mem.get_progress()) == 1
    assert len(mem.get_failures()) == 1

    context = mem.format_context_memory()
    assert "# HARNESS 2.0 MEMORY CONTEXT" in context
    assert "Architectural Constraints" in context
    assert "Prior Failures & Anti-Patterns" in context
    assert "Past Architectural Decisions" in context


def test_harness_memory_store_empty():
    """Verify memory context formatting with empty channels."""
    mem = HarnessMemoryStore()
    mem._architecture = []
    context = mem.format_context_memory()
    assert context == "# HARNESS 2.0 MEMORY CONTEXT"


def test_git_guard_safe_and_forbidden():
    """Verify GitGuard detects forbidden files and executes rollback."""
    guard = GitGuard()

    # Safe changes
    is_safe, violations = guard.inspect_changes(["src/api/routes.py", "tests/test_api.py"])
    assert is_safe
    assert violations == []

    # Unsafe changes targeting .env
    is_safe, violations = guard.inspect_changes(["src/api/routes.py", ".env", "secrets/id_rsa"])
    assert not is_safe
    assert len(violations) == 2
    assert ".env" in violations
    assert "secrets/id_rsa" in violations

    # Rollback execution
    rollback_msg = guard.rollback()
    assert "Rollback executed successfully" in rollback_msg


def test_verification_engine_layers():
    """Verify verification engine orders layers and catches errors and exceptions."""
    engine = VerificationEngine()

    engine.register_check(
        layer="syntax",
        name="typecheck",
        runner=lambda: True,
    )
    engine.register_check(
        layer="behavior",
        name="unit_tests",
        runner=lambda: True,
    )
    engine.register_check(
        layer="architecture",
        name="security_scan",
        runner=lambda: True,
    )
    engine.register_check(
        layer="governance_compliance",
        name="vpc_sc_check",
        runner=lambda: True,
    )

    report = engine.verify()
    assert report.success
    assert len(report.checks) == 3
    assert report.error_hash == ""


def test_verification_engine_failure_and_exception():
    """Verify failure captures layer, message, and error hash."""
    engine = VerificationEngine()

    engine.register_check(
        layer="syntax",
        name="lint",
        runner=lambda: False,
        error_msg="Lint formatting violation",
    )

    def crashing_check():
        raise RuntimeError("Test runner crashed")

    engine.register_check(
        layer="behavior",
        name="crasher",
        runner=crashing_check,
    )

    report = engine.verify()
    assert not report.success
    assert report.failing_layer == "syntax"
    assert "Lint formatting violation" in (report.error_summary or "")
    assert len(report.error_hash) == 12


def test_agent_harness_success_first_attempt():
    """Verify happy path where plan is approved and passes verification on attempt 1."""
    harness = AgentHarness()
    harness.verifier.register_check(
        layer="behavior",
        name="tests",
        runner=lambda: True,
    )

    plan = harness.formulate_plan(
        task="Implement legal router",
        target_files=["src/agents/router.py"],
        proposed_changes=["Add intent router"],
        architecture_rationale="Separation of agent duties",
    )

    result = harness.execute_with_recovery(
        task="Implement legal router",
        plan=plan,
        executor=lambda attempt, fb: {"status": "ok"},
    )

    assert result.success
    assert result.total_attempts == 1
    assert "Task completed and independently verified" in result.message
    assert len(harness.memory.get_progress()) == 1
    assert len(harness.memory.get_decisions()) == 1


def test_agent_harness_forbidden_plan_rejection():
    """Verify harness immediately rejects plan touching forbidden files."""
    harness = AgentHarness()
    plan = harness.formulate_plan(
        task="Update credentials",
        target_files=[".env.local"],
        proposed_changes=["Inject secret key"],
    )

    result = harness.execute_with_recovery(
        task="Update credentials",
        plan=plan,
        executor=lambda attempt, fb: {},
    )

    assert not result.success
    assert result.total_attempts == 0
    assert "Plan rejected by GitGuard" in result.message


def test_agent_harness_recovery_loop_success_attempt_2():
    """Verify harness provides feedback on attempt 1 failure and succeeds on attempt 2."""
    harness = AgentHarness()
    attempt_count = 0

    def dynamic_check():
        return attempt_count >= 2

    harness.verifier.register_check(
        layer="syntax",
        name="type_validator",
        runner=dynamic_check,
        error_msg="Missing type annotation on line 42",
    )

    def mock_executor(attempt, feedback):
        nonlocal attempt_count
        attempt_count = attempt
        return {"attempt": attempt}

    plan = harness.formulate_plan(
        task="Refactor contract model",
        target_files=["src/models.py"],
        proposed_changes=["Add Pydantic types"],
    )

    result = harness.execute_with_recovery(
        task="Refactor contract model",
        plan=plan,
        executor=mock_executor,
    )

    assert result.success
    assert result.total_attempts == 2
    assert len(result.feedback_history) == 1
    assert result.feedback_history[0].what_failed == "syntax"


def test_agent_harness_infinite_loop_detection():
    """Verify harness halts execution when same error hash repeats."""
    harness = AgentHarness()

    harness.verifier.register_check(
        layer="behavior",
        name="integration_test",
        runner=lambda: False,
        error_msg="Foreign key constraint failure",
    )

    plan = harness.formulate_plan(
        task="Insert duplicate row",
        target_files=["src/db.py"],
        proposed_changes=["Write raw SQL"],
    )

    result = harness.execute_with_recovery(
        task="Insert duplicate row",
        plan=plan,
        executor=lambda attempt, fb: {},
    )

    assert not result.success
    assert result.total_attempts == 2
    assert "Infinite loop detected with repeated error hash" in result.message
    assert len(harness.memory.get_failures()) == 1


def test_agent_harness_max_attempts_exhausted():
    """Verify harness safely stops and rolls back after MAX_ATTEMPTS distinct failures."""
    harness = AgentHarness()
    counter = 0

    def rotating_error_check():
        nonlocal counter
        counter += 1
        return False

    def runner_with_dynamic_error():
        return False

    engine = VerificationEngine()
    # Register check that returns different error messages to avoid same error hash
    err_msgs = ["Error alpha", "Error beta", "Error gamma"]
    idx = 0

    def dynamic_runner():
        nonlocal idx
        msg = err_msgs[idx % len(err_msgs)]
        idx += 1
        raise ValueError(msg)

    engine.register_check(layer="behavior", name="rotating_check", runner=dynamic_runner)
    harness.verifier = engine

    plan = harness.formulate_plan(
        task="Complex flaky task",
        target_files=["src/flaky.py"],
        proposed_changes=["Try experimental approach"],
    )

    result = harness.execute_with_recovery(
        task="Complex flaky task",
        plan=plan,
        executor=lambda attempt, fb: {},
    )

    assert not result.success
    assert result.total_attempts == 3
    assert "Task failed safely after 3 attempts" in result.message


def test_agent_harness_unapproved_safe_plan_review_inside_execute():
    """Verify plan not yet approved gets reviewed and approved inside execute_with_recovery."""
    harness = AgentHarness()
    harness.verifier.register_check(
        layer="behavior",
        name="tests",
        runner=lambda: True,
    )

    plan = harness.formulate_plan(
        task="Clean refactor",
        target_files=["src/clean.py"],
        proposed_changes=["Extract helper"],
    )
    assert not plan.is_approved

    result = harness.execute_with_recovery(
        task="Clean refactor",
        plan=plan,
        executor=lambda attempt, fb: {"attempt": attempt},
    )

    assert result.success
    assert plan.is_approved
    assert result.total_attempts == 1


def test_agent_harness_preapproved_plan():
    """Verify that when a plan is already approved, review_plan is skipped."""
    harness = AgentHarness()
    harness.verifier.register_check(
        layer="behavior",
        name="tests",
        runner=lambda: True,
    )
    plan = harness.formulate_plan(
        task="Pre-approved task",
        target_files=["src/clean.py"],
        proposed_changes=["Extract helper"],
    )
    plan.is_approved = True

    result = harness.execute_with_recovery(
        task="Pre-approved task",
        plan=plan,
        executor=lambda attempt, fb: {"status": "ok"},
    )
    assert result.success
    assert result.total_attempts == 1
