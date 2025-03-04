import { Header } from '@/layouts/MainLayout/components/Header';
import { FeedbackWidget } from '@/features/feedback/components/index.js';
import { ThemeWrapper } from '@/layouts/MainLayout/components/ThemeWrapper';

export function MainLayout({ children }) {
  return (
    <ThemeWrapper>
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <FeedbackWidget />
    </ThemeWrapper>
  );
} 