import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export function useLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;
  const messageType = location.state?.type || 'error';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login({ email, password, rememberMe });
      setTimeout(() => {
        const from = location.state?.from?.pathname || '/home';
        navigate(from, { replace: true });
      }, 0);
    } catch (err) {
      let errorMessage;
      if (err.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (err.response?.status === 429) {
        errorMessage = 'Too many login attempts. Please try again later.';
      } else if (!err.response) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else {
        errorMessage = 'An unexpected error occurred. Please try again.';
      }
      setError(errorMessage);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    error,
    message,
    messageType,
    handleSubmit
  };
} 