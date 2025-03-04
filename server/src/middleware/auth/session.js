import { sessionService } from '../services/sessionService.js';

export const sessionMiddleware = {
  async validateSession(req, res, next) {
    try {
      if (!req.session?.id) {
        return res.status(401).json({ error: 'No session found' });
      }

      const session = await prisma.session.findUnique({
        where: { id: req.session.id },
        include: { user: true }
      });

      if (!session || session.expiresAt < new Date()) {
        req.session.destroy();
        return res.status(401).json({ error: 'Invalid or expired session' });
      }

      req.user = session.user;
      next();
    } catch (error) {
      next(error);
    }
  },

  async extendSession(req, res, next) {
    if (req.session?.id) {
      await sessionService.extendSession(req.session.id);
    }
    next();
  }
};
