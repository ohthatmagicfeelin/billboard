import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '@/features/auth/services/authService';

export function useVerifyEmail() {
  const [status, setStatus] = useState('verifying');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus('success');
        setTimeout(() => {
          navigate('/login', {
            state: { 
              message: 'Email verified successfully! You can now log in.',
              type: 'success'
            }
          });
        }, 3000);
      } catch (err) {
        setStatus('error');
        console.error('VerifyEmail error', err);
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
    }
  }, [token, navigate]);

  return {
    status,
    handleBackToLogin: () => navigate('/login')
  };
} 