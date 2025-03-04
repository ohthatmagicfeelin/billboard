import jwt from 'jsonwebtoken';
import config from '../../../config/env.js';
import { AppError } from '../../../utils/AppError.js';
import { userRepository } from '../../../features/user/repositories/userRepository.js';
import { emailService } from '../../../utils/emailService.js';
import { auditService } from '../../../common/services/auditService.js';
import { passwordResetRepository } from '../repositories/passwordResetRepository.js';

export const requestPasswordReset = async (email) => {
    const user = await userRepository.getUserByEmail(email);
    if (user) {
        await emailService.sendPasswordResetEmail(email, user.id);
        await auditService.log({
            userId: user.id,
            action: 'PASSWORD_RESET_REQUESTED',
            entity: 'user',
            entityId: user.id.toString(),
            details: { email }
        });
    } else {
        await auditService.log({
            action: 'PASSWORD_RESET_FAILED',
            entity: 'user',
            entityId: email,
            details: { reason: 'User not found' }
        });
    }
    return { message: 'If an account exists, you will receive a reset email.' };
};

export const resetPassword = async (token, newPassword) => {
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        
        const resetToken = await passwordResetRepository.getValidToken(token);
        if (!resetToken) {
            throw new AppError('Invalid or expired reset token', 400);
        }

        const user = await userRepository.getUserById(decoded.userId);
        if (!user) {
            await auditService.log({
                action: 'PASSWORD_RESET_FAILED',
                entity: 'user',
                entityId: decoded.userId.toString(),
                details: { reason: 'User not found' }
            });
            throw new AppError('Invalid reset token', 400);
        }

        await passwordResetRepository.markTokenAsUsed(token);
        await userRepository.updateUserPassword(user.id, newPassword);
        
        await auditService.log({
            userId: user.id,
            action: 'PASSWORD_RESET_COMPLETED',
            entity: 'user',
            entityId: user.id.toString(),
            details: { email: user.email }
        });

    } catch (error) {
        await auditService.log({
            action: 'PASSWORD_RESET_FAILED',
            entity: 'user',
            entityId: token,
            details: { error: error.message }
        });
        throw new AppError('Invalid or expired reset token', 400);
    }
};

export const verifyResetToken = async (token) => {
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        
        const resetToken = await passwordResetRepository.getValidToken(token);
        if (!resetToken) {
            throw new AppError('Invalid or expired reset token', 400);
        }

        const user = await userRepository.getUserById(decoded.userId);
        if (!user) {
            throw new AppError('Invalid reset token', 400);
        }

        return true;
    } catch (error) {
        await auditService.log({
            action: 'PASSWORD_RESET_TOKEN_VERIFICATION_FAILED',
            entity: 'user',
            entityId: token,
            details: { error: error.message }
        });
        throw new AppError('Invalid or expired reset token', 400);
    }
};
