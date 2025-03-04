// server/src/utils/emailService.js
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import { passwordResetRepository } from '../features/auth/repositories/passwordResetRepository.js';
import { AppError } from './AppError.js';
import { emailVerificationRepository } from '../features/auth/repositories/emailVerificationRepository.js';

export class EmailService {
  constructor() {
    if (config.NODE_ENV === 'production') {
      try {
        console.log('SMTP Configuration:', {
          host: config.EMAIL_SMTP_HOST,
          port: config.EMAIL_SMTP_PORT,
          user: config.EMAIL_SMTP_USER ? '(set)' : '(missing)',
          pass: config.EMAIL_SMTP_PASS ? '(set)' : '(missing)'
        });

        this.transporter = nodemailer.createTransport({
          host: config.EMAIL_SMTP_HOST,
          port: parseInt(config.EMAIL_SMTP_PORT),
          secure: false,
          auth: {
            user: config.EMAIL_SMTP_USER,
            pass: config.EMAIL_SMTP_PASS,
          },
          debug: false,
          logger: false
        });

        this.verifyConnection();
      } catch (error) {
        console.error('Failed to initialize email transporter:', error);
        throw new AppError('Email service initialization failed', 500);
      }
    } else {
    }
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ SMTP Server verified and ready to take messages');
    } catch (error) {
      console.error('❌ SMTP Connection Error:', {
        message: error.message,
        code: error.code,
        command: error.command,
        response: error.response
      });
    }
  }

  async sendVerificationEmail(email, userId) {
    try {
      if (!email || !userId) {
        throw new AppError('Email and userId are required', 400);
      }

      const token = jwt.sign(
        { userId, type: 'email-verification' },
        config.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Store token in database
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      await emailVerificationRepository.createToken({
        token,
        userId,
        expiresAt
      });

      const verificationUrl = `${config.FRONTEND_URL}/verify-email?token=${token}`;

      if (config.NODE_ENV === 'production') {
        if (!this.transporter) {
          throw new AppError('Email service not properly initialized', 500);
        }

        try {
          await this.transporter.sendMail({
            from: `"${config.EMAIL_FROM_NAME}" <${config.EMAIL_FROM}>`,
            to: email,
            subject: 'Verify your email',
            html: `
              <h1>Verify your email</h1>
              <p>Click the link below to verify your email address:</p>
              <a href="${verificationUrl}">Verify Email</a>
            `,
            text: `
              Verify your email
              Click the link below to verify your email address:
              ${verificationUrl}
            `,
          });
          console.log(`Verification email sent successfully to ${email}`);
        } catch (error) {
          console.error('Failed to send verification email:', error);
          throw new AppError('Failed to send verification email', 500);
        }
      }
      if (config.DEBUG) {
        console.log('\n=== Verification Email ===');
        console.log('To:', email);
        console.log('Verification URL:', verificationUrl);
        console.log('========================\n');
      }

      return { success: true };
    } catch (error) {
      console.error('Error in sendVerificationEmail:', error);
      throw error instanceof AppError ? error : new AppError('Failed to process verification email', 500);
    }
  }

  async sendPasswordResetEmail(email, userId) {
    try {
      if (!email || !userId) {
        throw new AppError('Email and userId are required', 400);
      }

      const token = jwt.sign(
        { userId, type: 'password-reset' },
        config.JWT_SECRET,
        { expiresIn: '1h' }
      );

      try {
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await passwordResetRepository.createToken({
          token,
          userId,
          expiresAt
        });
      } catch (error) {
        console.error('Failed to create password reset token:', error);
        throw new AppError('Failed to initiate password reset', 500);
      }

      const resetUrl = `${config.FRONTEND_URL}/reset-password?token=${token}`;

      if (config.NODE_ENV === 'production') {
        if (!this.transporter) {
          throw new AppError('Email service not properly initialized', 500);
        }

        try {
          await this.transporter.sendMail({
            from: `"${config.EMAIL_FROM_NAME}" <${config.EMAIL_FROM}>`,
            to: email,
            subject: 'Reset your password',
            html: `
              <h1>Reset Password</h1>
              <p>Click the link below to reset your password:</p>
              <a href="${resetUrl}">Reset Password</a>
              <p>This link will expire in 1 hour.</p>
            `,
            text: `
              Reset Password
              Click the link below to reset your password:
              ${resetUrl}
              This link will expire in 1 hour.
            `,
          });
          console.log(`Password reset email sent successfully to ${email}`);
        } catch (error) {
          console.error('Failed to send password reset email:', error);
          throw new AppError('Failed to send password reset email', 500);
        }
      } else {
        // Development environment - log to console
        console.log('\n=== Password Reset Email ===');
        console.log('To:', email);
        console.log('Reset URL:', resetUrl);
        console.log('========================\n');

        // Store token in memory for verification in development
        global.resetTokens = global.resetTokens || new Map();
        global.resetTokens.set(token, userId);
      }

      return { success: true };
    } catch (error) {
      console.error('Error in sendPasswordResetEmail:', error);
      throw error instanceof AppError ? error : new AppError('Failed to process password reset email', 500);
    }
  }
}

export const emailService = new EmailService();