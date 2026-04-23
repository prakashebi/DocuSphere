import uuid

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from pydantic import ValidationError
from sqlalchemy import func, select

from app.api.deps import get_current_user
from app.extensions import db
from app.models.entity import Entity, EntityStatus
from app.models.event import AuditEvent
from app.schemas.entity import EntityCreate, EntityListResponse, EntityRead, EntityUpdate

bp = Blueprint("entities", __name__, url_prefix="/api/v1/entities")


@bp.get("")
@jwt_required()
def list_entities():
    entity_type = request.args.get("entity_type")
    status = request.args.get("status")
    q = request.args.get("q")
    skip = int(request.args.get("skip", 0))
    limit = min(int(request.args.get("limit", 50)), 200)

    stmt = select(Entity).where(Entity.is_deleted.is_(False))
    if entity_type:
        stmt = stmt.where(Entity.entity_type == entity_type)
    if status:
        stmt = stmt.where(Entity.status == EntityStatus(status))
    if q:
        stmt = stmt.where(Entity.title.ilike(f"%{q}%"))

    total = db.session.scalar(select(func.count()).select_from(stmt.subquery()))
    rows = db.session.scalars(stmt.offset(skip).limit(limit)).all()

    result = EntityListResponse(
        total=total or 0,
        items=[EntityRead.model_validate(r) for r in rows],
    )
    return jsonify(result.model_dump(mode="json", by_alias=True))


@bp.post("")
@jwt_required()
def create_entity():
    try:
        payload = EntityCreate.model_validate(request.get_json())
    except ValidationError as e:
        return jsonify(detail=e.errors()), 422

    current_user = get_current_user()

    entity = Entity(
        entity_type=payload.entity_type,
        title=payload.title,
        description=payload.description,
        status=payload.status,
        metadata_=payload.metadata,
        owner_id=current_user.id,
    )
    db.session.add(entity)
    db.session.add(AuditEvent(
        event_type="entity.created",
        actor_id=current_user.id,
        entity_type=payload.entity_type,
        payload={"title": payload.title},
    ))
    db.session.commit()
    db.session.refresh(entity)

    return jsonify(EntityRead.model_validate(entity).model_dump(mode="json", by_alias=True)), 201


@bp.get("/<entity_id>")
@jwt_required()
def get_entity(entity_id: str):
    entity = db.session.scalar(
        select(Entity).where(Entity.id == uuid.UUID(entity_id), Entity.is_deleted.is_(False))
    )
    if not entity:
        return jsonify(detail="Entity not found"), 404
    return jsonify(EntityRead.model_validate(entity).model_dump(mode="json", by_alias=True))


@bp.patch("/<entity_id>")
@jwt_required()
def update_entity(entity_id: str):
    try:
        payload = EntityUpdate.model_validate(request.get_json())
    except ValidationError as e:
        return jsonify(detail=e.errors()), 422

    entity = db.session.scalar(
        select(Entity).where(Entity.id == uuid.UUID(entity_id), Entity.is_deleted.is_(False))
    )
    if not entity:
        return jsonify(detail="Entity not found"), 404

    current_user = get_current_user()
    updated_fields: dict = {}

    for field, value in payload.model_dump(exclude_none=True).items():
        if field == "metadata":
            entity.metadata_ = value
        else:
            setattr(entity, field, value)
        updated_fields[field] = value

    db.session.add(AuditEvent(
        event_type="entity.updated",
        actor_id=current_user.id,
        entity_id=entity.id,
        entity_type=entity.entity_type,
        payload=updated_fields,
    ))
    db.session.commit()
    db.session.refresh(entity)

    return jsonify(EntityRead.model_validate(entity).model_dump(mode="json", by_alias=True))


@bp.delete("/<entity_id>")
@jwt_required()
def delete_entity(entity_id: str):
    entity = db.session.scalar(
        select(Entity).where(Entity.id == uuid.UUID(entity_id), Entity.is_deleted.is_(False))
    )
    if not entity:
        return jsonify(detail="Entity not found"), 404

    current_user = get_current_user()
    entity.is_deleted = True
    db.session.add(AuditEvent(
        event_type="entity.deleted",
        actor_id=current_user.id,
        entity_id=entity.id,
        entity_type=entity.entity_type,
        payload={"title": entity.title},
    ))
    db.session.commit()
    return "", 204
