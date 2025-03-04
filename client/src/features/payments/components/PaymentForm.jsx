// src/components/payments/PaymentForm.jsx
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/features/payments/services/stripe';
import { usePaymentIntent } from '@/features/payments/hooks/usePaymentIntent';
import CheckoutForm from './CheckoutForm';

const PaymentForm = () => {
  const { clientSecret, error, loading } = usePaymentIntent(1000); // Amount in cents

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Complete Payment</h2>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm clientSecret={clientSecret} />
      </Elements>
    </div>
  );
};

export default PaymentForm;