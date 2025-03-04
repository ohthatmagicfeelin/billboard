import { FeedbackButtonDisplay } from './FeedbackButtonDisplay';
import { FeedbackModalDisplay } from './FeedbackModalDisplay';
import { useFeedback } from '@/features/feedback/hooks/useFeedback';

export function FeedbackContainer() {
  const {
    isOpen,
    setIsOpen,
    rating,
    setRating,
    message,
    setMessage,
    email,
    setEmail,
    name,
    setName,
    isSubmitting,
    status,
    handleSubmit,
    user
  } = useFeedback();

  return (
    <>
      <FeedbackButtonDisplay onClick={() => setIsOpen(true)} />
      <FeedbackModalDisplay
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        rating={rating}
        onRatingChange={setRating}
        message={message}
        onMessageChange={setMessage}
        email={email}
        onEmailChange={setEmail}
        name={name}
        onNameChange={setName}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        status={status}
        isAuthenticated={!!user}
      />
    </>
  );
} 