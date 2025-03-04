import bcrypt from 'bcrypt';
import { AppError } from '../../../utils/AppError.js';
import { userRepository } from '../../../features/user/repositories/userRepository.js';
import { auditService } from '../../../common/services/auditService.js';

export const login = async (email, password) => {
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
        await auditService.log({
            action: 'LOGIN_FAILED',
            entity: 'user',
            entityId: email,
            details: { reason: 'User not found' }
        });
        throw new AppError('Invalid credentials', 401);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        await auditService.log({
            userId: user.id,
            action: 'LOGIN_FAILED',
            entity: 'user',
            entityId: user.id.toString(),
            details: { reason: 'Invalid password' }
        });
        throw new AppError('Invalid credentials', 401);
    }

    await auditService.log({
        userId: user.id,
        action: 'LOGIN',
        entity: 'user',
        entityId: user.id.toString(),
        details: { email }
    });

    return user;
};

export const logout = async (userId) => {
    if (userId) {
        await auditService.log({
            userId,
            action: 'LOGOUT',
            entity: 'user',
            entityId: userId.toString(),
            details: { timestamp: new Date().toISOString() }
        });
    }
};
