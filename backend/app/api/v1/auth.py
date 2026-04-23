from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token
from pydantic import ValidationError
from sqlalchemy import select

from app.core.security import hash_password, verify_password
from app.extensions import db
from app.models.user import User
from app.schemas.user import LoginRequest, UserCreate, UserRead

bp = Blueprint("auth", __name__, url_prefix="/api/v1/auth")


@bp.post("/register")
def register():
    try:
        payload = UserCreate.model_validate(request.get_json())
    except ValidationError as e:
        return jsonify(detail=e.errors()), 422

    if db.session.scalar(select(User).where(User.email == payload.email)):
        return jsonify(detail="Email already registered"), 400

    user = User(
        email=payload.email,
        username=payload.username,
        hashed_password=hash_password(payload.password),
    )
    db.session.add(user)
    db.session.commit()
    db.session.refresh(user)

    return jsonify(UserRead.model_validate(user).model_dump(mode="json")), 201


@bp.post("/login")
def login():
    try:
        payload = LoginRequest.model_validate(request.get_json())
    except ValidationError as e:
        return jsonify(detail=e.errors()), 422

    user = db.session.scalar(select(User).where(User.email == payload.email))
    if not user or not verify_password(payload.password, user.hashed_password):
        return jsonify(detail="Invalid credentials"), 401
    if not user.is_active:
        return jsonify(detail="Account is disabled"), 403

    token = create_access_token(identity=str(user.id))
    return jsonify(access_token=token, token_type="bearer")
