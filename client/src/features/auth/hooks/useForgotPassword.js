import { useState } from 'react';
import { authService } from '@/features/auth/services/authService';

export function useForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.requestPasswordReset(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    email,
    setEmail,
    submitted,
    error,
    handleSubmit
  };
} 