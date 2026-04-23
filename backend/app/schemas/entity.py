import uuid
from datetime import datetime

from pydantic import BaseModel, Field

from app.models.entity import EntityStatus


class EntityCreate(BaseModel):
    entity_type: str
    title: str
    description: str | None = None
    status: EntityStatus = EntityStatus.active
    metadata: dict | None = Field(None, alias="metadata")

    model_config = {"populate_by_name": True}


class EntityRead(BaseModel):
    model_config = {"from_attributes": True, "populate_by_name": True}

    id: uuid.UUID
    entity_type: str
    title: str
    description: str | None
    status: EntityStatus
    metadata: dict | None = Field(None, serialization_alias="metadata", validation_alias="metadata_")
    owner_id: uuid.UUID | None
    created_at: datetime
    updated_at: datetime


class EntityUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: EntityStatus | None = None
    metadata: dict | None = Field(None, alias="metadata")

    model_config = {"populate_by_name": True}


class EntityListResponse(BaseModel):
    total: int
    items: list[EntityRead]
