import uuid

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from pydantic import ValidationError
from sqlalchemy import select

from app.api.deps import get_current_user, roles_required
from app.extensions import db
from app.models.user import User, UserRole
from app.schemas.user import UserRead, UserUpdate

bp = Blueprint("users", __name__, url_prefix="/api/v1/users")


@bp.get("/me")
@jwt_required()
def get_me():
    user = get_current_user()
    if not user:
        return jsonify(detail="User not found"), 401
    return jsonify(UserRead.model_validate(user).model_dump(mode="json"))


@bp.get("/<user_id>")
@roles_required(UserRole.admin)
def get_user(user_id: str):
    user = db.session.get(User, uuid.UUID(user_id))
    if not user:
        return jsonify(detail="User not found"), 404
    return jsonify(UserRead.model_validate(user).model_dump(mode="json"))


@bp.patch("/<user_id>")
@roles_required(UserRole.admin)
def update_user(user_id: str):
    try:
        payload = UserUpdate.model_validate(request.get_json())
    except ValidationError as e:
        return jsonify(detail=e.errors()), 422

    user = db.session.get(User, uuid.UUID(user_id))
    if not user:
        return jsonify(detail="User not found"), 404

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(user, field, value)

    db.session.commit()
    db.session.refresh(user)
    return jsonify(UserRead.model_validate(user).model_dump(mode="json"))
