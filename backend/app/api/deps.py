import uuid
from functools import wraps

from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

from app.extensions import db
from app.models.user import User, UserRole


def get_current_user() -> User:
    """Resolve the JWT identity to a User row. Call inside a @jwt_required() route."""
    user_id = get_jwt_identity()
    return db.session.get(User, uuid.UUID(user_id))


def roles_required(*roles: UserRole):
    """Decorator that enforces JWT auth + role membership."""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            user = get_current_user()
            if not user or not user.is_active:
                return jsonify(detail="User not found"), 401
            if user.role not in roles:
                return jsonify(detail="Insufficient permissions"), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator
