import uuid

from flask import Blueprint, jsonify, request
from sqlalchemy import func, select

from app.api.deps import roles_required
from app.extensions import db
from app.models.event import AuditEvent
from app.models.user import UserRole
from app.schemas.event import AuditEventListResponse, AuditEventRead

bp = Blueprint("events", __name__, url_prefix="/api/v1/events")


@bp.get("")
@roles_required(UserRole.admin, UserRole.member)
def list_events():
    event_type = request.args.get("event_type")
    entity_id = request.args.get("entity_id")
    actor_id = request.args.get("actor_id")
    skip = int(request.args.get("skip", 0))
    limit = min(int(request.args.get("limit", 50)), 200)

    stmt = select(AuditEvent).order_by(AuditEvent.created_at.desc())
    if event_type:
        stmt = stmt.where(AuditEvent.event_type == event_type)
    if entity_id:
        stmt = stmt.where(AuditEvent.entity_id == uuid.UUID(entity_id))
    if actor_id:
        stmt = stmt.where(AuditEvent.actor_id == uuid.UUID(actor_id))

    total = db.session.scalar(select(func.count()).select_from(stmt.subquery()))
    rows = db.session.scalars(stmt.offset(skip).limit(limit)).all()

    result = AuditEventListResponse(
        total=total or 0,
        items=[AuditEventRead.model_validate(r) for r in rows],
    )
    return jsonify(result.model_dump(mode="json"))
