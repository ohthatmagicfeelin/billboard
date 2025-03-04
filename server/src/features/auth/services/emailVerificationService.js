import jwt from 'jsonwebtoken';
import config from '../../../config/env.js';
import { AppError } from '../../../utils/AppError.js';
import { userRepository } from '../../../features/user/repositories/userRepository.js';
import { emailService } from '../../../utils/emailService.js';
import { auditService } from '../../../common/services/auditService.js';
import { emailVerificationRepository } from '../repositories/emailVerificationRepository.js';

export const verifyEmail = async (token) => {
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        
        const verificationToken = await emailVerificationRepository.getValidToken(token);
        if (!verificationToken) {
            throw new AppError('Invalid or expired verification token', 400);
        }

        const user = await userRepository.getUserById(decoded.userId);
        if (!user) {
            await auditService.log({
                action: 'EMAIL_VERIFICATION_FAILED',
                entity: 'user',
                entityId: decoded.userId.toString(),
                details: { reason: 'User not found' }
            });
            throw new AppError('Invalid verification token', 400);
        }

        await emailVerificationRepository.markTokenAsUsed(token);
        await userRepository.markEmailAsVerified(user.id);
        
        await auditService.log({
            userId: user.id,
            action: 'EMAIL_VERIFIED',
            entity: 'user',
            entityId: user.id.toString(),
            details: { email: user.email }
        });

        return user;
    } catch (error) {
        await auditService.log({
            action: 'EMAIL_VERIFICATION_FAILED',
            entity: 'user',
            entityId: token,
            details: { error: error.message }
        });
        throw new AppError('Invalid or expired verification token', 400);
    }
};

export const resendVerification = async (email) => {
    const user = await userRepository.getUserByEmail(email);
    if (user && !user.email_verified) {
        await emailService.sendVerificationEmail(email, user.id);
    }
};
