import { auditRepository } from '../repositories/auditRepository.js'

export const auditService = {
  log: async ({ userId, action, entity, entityId, details }) => {
    try {
      await auditRepository.create({
        userId,
        action,
        entity,
        entityId,
        details
      })
    } catch (error) {
      console.error('Audit logging failed:', error)
      // Don't throw - we don't want audit failures to break main operations
    }
  },

  getEntityHistory: async (entity, entityId) => {
    return auditRepository.findByEntity(entity, entityId)
  },

  getUserHistory: async (userId) => {
    return auditRepository.findByUser(userId)
  }
} 