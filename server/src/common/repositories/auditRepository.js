import prisma from '../../db/client.js'

export const auditRepository = {
  create: async ({ userId, action, entity, entityId, details }) => {
    return prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        details
      }
    })
  },

  findByEntity: async (entity, entityId) => {
    return prisma.auditLog.findMany({
      where: {
        entity,
        entityId
      },
      include: {
        user: {
          select: {
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  },

  findByUser: async (userId) => {
    return prisma.auditLog.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }
} 