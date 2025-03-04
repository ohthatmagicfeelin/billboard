import { useForgotPassword } from '@/features/auth/hooks/useForgotPassword';
import { ForgotPasswordDisplay } from '../password/ForgotPasswordDisplay';

export function ForgotPasswordContainer() {
  const {
    email,
    setEmail,
    submitted,
    error,
    handleSubmit
  } = useForgotPassword();

  return (
    <ForgotPasswordDisplay
      email={email}
      onEmailChange={setEmail}
      submitted={submitted}
      error={error}
      onSubmit={handleSubmit}
    />
  );
} 