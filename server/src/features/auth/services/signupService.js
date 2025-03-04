import { userRepository } from '../../../features/user/repositories/userRepository.js';
import { emailService } from '../../../utils/emailService.js';
import { auditService } from '../../../common/services/auditService.js';
import { AppError } from '../../../utils/AppError.js';

export const signup = async (email, password) => {
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
        await auditService.log({
            action: 'SIGNUP_FAILED',
            entity: 'user',
            entityId: email,
            details: { reason: 'Email already exists' }
        });
        throw new AppError('Email already registered', 400);
    }

    const user = await userRepository.createUser({ email, password });
    await emailService.sendVerificationEmail(email, user.id);

    await auditService.log({
        userId: user.id,
        action: 'SIGNUP',
        entity: 'user',
        entityId: user.id.toString(),
        details: { email }
    });

    return {
        user,
        message: 'Please check your email to verify your account'
    };
};
