// client/src/services/authService.js
import axios from 'axios';
import config from '@/config/env';
import api from '@/api/api';

class AuthService {
  constructor() {
    this.api = api;
  }

  validatePassword(password) {
    const minLength = 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);

    const errors = [];
    if (password.length < minLength) errors.push(`Must be at least ${minLength} characters`);
    if (!hasUpper) errors.push('Must contain uppercase letter');
    if (!hasLower) errors.push('Must contain lowercase letter');
    if (!hasNumber) errors.push('Must contain number');
    if (!hasSpecial) errors.push('Must contain special character');

    return {
      isValid: errors.length === 0,
      errors
    };
  }


  async signup({ email, password, rememberMe = false }) {
    const { isValid, errors } = this.validatePassword(password);
    if (!isValid) {
      throw new Error(errors.join(', '));
    }

    const response = await this.api.post('/api/signup', {
      email,
      password,
      rememberMe
    });
    return response.data;
  }


  async login({ email, password, rememberMe = false }) {
    const response = await this.api.post('/api/login', {
      email,
      password,
      rememberMe
    });
    return response.data;
  }


  async logout() {
    await this.api.post('/api/logout');
  }


  async validateSession() {
    try {
        
      const response = await this.api.get('/api/validate');
      return response;
    } catch (error) {
      // Handle 401 silently on signup page
      if (error.response?.status === 401 && window.location.pathname === '/signup') {
        return { data: { user: null } };
      }
      
      // For other 401s or other errors, throw the error
      if (error.response?.status === 401) {
        throw new Error('Unauthorized: Session expired');
      }
      throw error;
    }
  }

  async requestPasswordReset(email) {
    await this.api.post('/api/password-reset-request', { email });
  }

  async resetPassword(token, newPassword) {
    const { isValid, errors } = this.validatePassword(newPassword);
    if (!isValid) {
      throw new Error(errors.join(', '));
    }

    await this.api.post('/api/password-reset', {
      token,
      newPassword
    });
  }

  async verifyEmail(token) {
    await this.api.post('/api/verify-email', { token });
  }

  async resendVerificationEmail(email) {
    await this.api.post('/api/resend-verification', { email });
  }

  async verifyResetToken(token) {
    if (!token) throw new Error('No token provided');
    await this.api.post('/api/verify-reset-token', { token });
  }
}

export const authService = new AuthService();