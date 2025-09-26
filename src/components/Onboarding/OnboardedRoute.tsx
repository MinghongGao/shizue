import { useOpenAIEndpointValue, useOpenAIKeyValue } from '@/hooks/settings';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

export const OnboardedRoute = ({ children }: { children: ReactNode }) => {
  const openAIKey = useOpenAIKeyValue();
  const openAIEndpoint = useOpenAIEndpointValue();

  const isOnboarded = !!openAIKey && !!openAIEndpoint;

  return isOnboarded ? children : <Navigate to="/onboarding" replace />;
};
