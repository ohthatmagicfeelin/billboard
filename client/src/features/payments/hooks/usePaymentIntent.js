// src/hooks/usePaymentIntent.js
import { useState, useEffect } from 'react';
import { createPaymentIntent } from '@/features/payments/api/payments';

export const usePaymentIntent = (amount) => {
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const { clientSecret } = await createPaymentIntent(amount, getUserId());
        setClientSecret(clientSecret);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentIntent();
  }, [amount]);

  return { clientSecret, error, loading };
};