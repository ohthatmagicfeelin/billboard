// server/src/middleware/auth.js
import { userRepository } from '../../features/user/repositories/userRepository.js';
import { AppError } from '../../utils/AppError.js';
import { auditService } from '../../common/services/auditService.js';

export const requireAuth = async (req, res, next) => {
  const sessionId = req.session.id;
  const userId = req.session.userId;
  const path = req.path;

  console.log('Auth Check:', { sessionId, userId, path });

  if (!req.session.userId) {
    await auditService.log({
      action: 'AUTH_FAILED',
      entity: 'session',
      entityId: sessionId || 'no_session',
      details: {
        reason: 'No userId in session',
        path,
        timestamp: new Date().toISOString()
      }
    });

    return res.status(401).json({ 
      error: 'Unauthorized',
      code: 'SESSION_REQUIRED'
    });
  }

  try {
    const user = await userRepository.getUserById(req.session.userId);
    
    if (!user) {
      await auditService.log({
        action: 'AUTH_FAILED',
        entity: 'session',
        entityId: sessionId,
        details: {
          reason: 'User not found',
          userId,
          path,
          timestamp: new Date().toISOString()
        }
      });

      req.session.destroy();
      return res.status(401).json({ 
        error: 'User not found',
        code: 'INVALID_SESSION'
      });
    }

    if (!user.emailVerified) {
      await auditService.log({
        userId: user.id,
        action: 'AUTH_FAILED',
        entity: 'session',
        entityId: sessionId,
        details: {
          reason: 'Email not verified',
          path,
          timestamp: new Date().toISOString()
        }
      });

      return res.status(401).json({ 
        error: 'Email verification required',
        code: 'EMAIL_VERIFICATION_REQUIRED',
        requiresVerification: true 
      });
    }

    // Log successful auth
    await auditService.log({
      userId: user.id,
      action: 'AUTH_SUCCESS',
      entity: 'session',
      entityId: sessionId,
      details: {
        path,
        timestamp: new Date().toISOString()
      }
    });

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    await auditService.log({
      userId: req.session.userId,
      action: 'AUTH_ERROR',
      entity: 'session',
      entityId: sessionId,
      details: {
        error: error.message,
        path,
        timestamp: new Date().toISOString()
      }
    });

    next(new AppError('Authentication failed', 500));
  }
};