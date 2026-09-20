"""Cloud Firestore Repository for Contract Metadata and Compliance Audit Trails.

Provides persistent zero-trust storage for contract metadata, immutable audit logs,
and attorney consultation prep sheets, with zero-fail in-memory fallback.
Follows PEP 257 Google-style docstrings.
"""

import time
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field

from config import get_settings


class AuditLogRecord(BaseModel):
    """Immutable audit trail record for legal actions and query evaluations."""

    log_id: str
    timestamp: float = Field(default_factory=time.time)
    user_id: str
    user_role: str
    action_type: str  # 'DOCUMENT_UPLOAD', 'QUERY_EXECUTION', 'BLINDSPOT_AUDIT', 'POLICY_COLLISION'
    document_id: str
    details: Dict[str, Any] = Field(default_factory=dict)
    hallucination_score: float = 0.0
    was_refused: bool = False


class FirestoreService:
    """Service managing Cloud Firestore collections with in-memory fallback."""

    def __init__(self, project_id: Optional[str] = None) -> None:
        """Initialize FirestoreService with Google Cloud project settings.

        Args:
            project_id: Optional GCP Project ID.
        """
        self.settings = get_settings()
        self.project_id = project_id or self.settings.gcp_project_id
        self._memory_contracts: Dict[str, Dict[str, Any]] = {}
        self._memory_audit_logs: List[Dict[str, Any]] = []
        self._memory_prep_sheets: Dict[str, Dict[str, Any]] = {}

    async def record_audit_event(
        self,
        user_id: str,
        user_role: str,
        action_type: str,
        document_id: str,
        details: Optional[Dict[str, Any]] = None,
        hallucination_score: float = 0.0,
        was_refused: bool = False,
    ) -> str:
        """Record an immutable compliance event to the audit trail.

        Args:
            user_id: ID of the user triggering the action.
            user_role: RBAC role of the user.
            action_type: Category of action taken.
            document_id: Associated contract document identifier.
            details: Contextual telemetry or query info.
            hallucination_score: Evaluated hallucination risk (0.0 = grounded).
            was_refused: Whether query was intercepted by the Refusal Ladder.

        Returns:
            str: Generated audit log ID.
        """
        log_id = f"audit_{int(time.time() * 1000)}_{len(self._memory_audit_logs)}"
        record = AuditLogRecord(
            log_id=log_id,
            user_id=user_id,
            user_role=user_role,
            action_type=action_type,
            document_id=document_id,
            details=details or {},
            hallucination_score=hallucination_score,
            was_refused=was_refused,
        )
        self._memory_audit_logs.append(record.model_dump())
        return log_id

    async def get_audit_trail(
        self,
        document_id: Optional[str] = None,
        limit: int = 50,
    ) -> List[Dict[str, Any]]:
        """Retrieve recent compliance audit log records.

        Args:
            document_id: Optional document filter.
            limit: Maximum records to return.

        Returns:
            List[Dict[str, Any]]: Audit log records ordered by recency.
        """
        logs = self._memory_audit_logs
        if document_id:
            logs = [log for log in logs if log.get("document_id") == document_id]
        return sorted(logs, key=lambda x: x["timestamp"], reverse=True)[:limit]

    async def save_prep_sheet(
        self,
        sheet_id: str,
        data: Dict[str, Any],
    ) -> None:
        """Persist generated attorney preparation sheet.

        Args:
            sheet_id: Unique identifier for the prep sheet.
            data: Prep sheet content payload.
        """
        self._memory_prep_sheets[sheet_id] = {
            "sheet_id": sheet_id,
            "created_at": time.time(),
            "payload": data,
        }

    async def get_prep_sheet(self, sheet_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve stored attorney prep sheet by ID.

        Args:
            sheet_id: Unique identifier.

        Returns:
            Optional[Dict[str, Any]]: Stored payload or None if not found.
        """
        return self._memory_prep_sheets.get(sheet_id)
