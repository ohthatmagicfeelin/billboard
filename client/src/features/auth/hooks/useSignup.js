import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/features/auth/services/authService';

export function useSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  const validateForm = () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError('');

    try {
      await authService.signup({ email, password, name });
      navigate('/verification-pending', { 
        state: { email },
        replace: true 
      });
    } catch (err) {
      let errorMessage;
      if (err.response?.status === 409) {
        errorMessage = 'An account with this email already exists';
      } else if (err.response?.status === 400) {
        errorMessage = err.response.data.message || 'Invalid input. Please check your details.';
      } else if (!err.response) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else {
        errorMessage = 'An unexpected error occurred. Please try again.';
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    name,
    setName,
    error,
    isSubmitting,
    handleSubmit
  };
} 