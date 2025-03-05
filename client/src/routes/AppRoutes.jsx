// src/routes/AppRoutes.jsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Loading from '@/common/components/ui/Loading';
import PaymentForm from '@/features/payments/components/PaymentForm';
import { LoginForm, SignupForm, EmailVerificationPending, ForgotPassword, ResetPassword, VerifyEmail } from '@/features/auth/components/index.js';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { Settings } from '@/pages/Settings';
import { MainLayout } from '@/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { BillboardContainer } from '@/features/billboard/components/BillboardContainer';
import { SpotifyCallback } from '@/features/spotify/components/SpotifyCallback';


const NotFound = lazy(() => import('@/common/components/error/NotFound'));

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <MainLayout>
        <Routes>
          {/* Update root route to show Billboard */}
          <Route 
            path="/" 
            element={<BillboardContainer />} 
          />

          {/* Public routes - redirect if authenticated */}
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />} 
          />
          <Route 
            path="/signup" 
            element={isAuthenticated ? <Navigate to="/" replace /> : <SignupForm />} 
          />

          <Route path="/verify-email" element={<VerifyEmail />}/>
          <Route path="/forgot-password" element={<ForgotPassword />}/>
          <Route path="/reset-password" element={<ResetPassword />}/>  
          <Route path="/verification-pending" element={<EmailVerificationPending />}/>

          {/* Protected routes */}
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<NotFound />} />

          <Route path="/callback/spotify" element={<SpotifyCallback />} />
        </Routes>
      </MainLayout>
    </Suspense>
  );
}

export default AppRoutes;