import client from './client'
import type { Entity, EntityListResponse, EntityStatus } from '../types'

interface ListParams {
  entity_type?: string
  status?: EntityStatus
  q?: string
  skip?: number
  limit?: number
}

interface CreateParams {
  entity_type: string
  title: string
  description?: string
  status?: EntityStatus
  metadata?: Record<string, unknown>
}

interface UpdateParams {
  title?: string
  description?: string
  status?: EntityStatus
  metadata?: Record<string, unknown>
}

export const entitiesApi = {
  list: async (params: ListParams = {}) => {
    const res = await client.get<EntityListResponse>('/entities', { params })
    return res.data
  },

  getById: async (id: string) => {
    const res = await client.get<Entity>(`/entities/${id}`)
    return res.data
  },

  create: async (params: CreateParams) => {
    const res = await client.post<Entity>('/entities', params)
    return res.data
  },

  update: async (id: string, params: UpdateParams) => {
    const res = await client.patch<Entity>(`/entities/${id}`, params)
    return res.data
  },

  delete: async (id: string) => {
    await client.delete(`/entities/${id}`)
  },
}
