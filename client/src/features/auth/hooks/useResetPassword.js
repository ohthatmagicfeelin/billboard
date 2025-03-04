import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '@/features/auth/services/authService';

export function useResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await authService.verifyResetToken(token);
        setIsValidToken(true);
      } catch (err) {
        setError('This password reset link has expired or is invalid. Please request a new one.');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setError('No reset token provided');
      setIsLoading(false);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await authService.resetPassword(token, password);
      navigate('/login', { 
        replace: true,
        state: { 
          message: 'Password reset successful. Please log in with your new password.',
          type: 'success'
        }
      });
    } catch (err) {
      if (err.message.includes('Must be at least')) {
        setError('Your password must be at least 8 characters long');
      } else if (err.message.includes('Must contain')) {
        setError('Your password must include uppercase and lowercase letters, numbers, and special characters');
      } else if (err.message.includes('expired')) {
        setError('This password reset link has expired. Please request a new one.');
      } else if (err.message.includes('invalid')) {
        setError('This password reset link is no longer valid. Please request a new one.');
      } else {
        setError('Something went wrong. Please try again or request a new reset link.');
      }
    }
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    isValidToken,
    isLoading,
    handleSubmit
  };
} 