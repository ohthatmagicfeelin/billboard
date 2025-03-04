import { SignupFormDisplay } from '../forms';
import { useSignup } from '@/features/auth/hooks/useSignup';

export function SignupFormContainer() {
  const {
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
  } = useSignup();

  return (
    <SignupFormDisplay
      email={email}
      onEmailChange={setEmail}
      password={password}
      onPasswordChange={setPassword}
      confirmPassword={confirmPassword}
      onConfirmPasswordChange={setConfirmPassword}
      name={name}
      onNameChange={setName}
      error={error}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    />
  );
} 