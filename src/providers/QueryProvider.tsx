/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

/**
 * React Query Provider
 * Provides React Query client with proper configuration
 */

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface QueryProviderProps {
  children: React.ReactNode;
}

// Create a client outside of the component to avoid recreating on each render
let queryClient: QueryClient | undefined;

function getQueryClient() {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          // With SSR, we usually want to set some default staleTime
          // above 0 to avoid refetching immediately on the client
          staleTime: 60 * 1000, // 1 minute
          gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
          retry: (failureCount, error: any) => {
            // Don't retry on 4xx errors except 408, 429
            if (error?.status >= 400 && error?.status < 500 && ![408, 429].includes(error.status)) {
              return false;
            }
            // Don't retry more than 3 times
            return failureCount < 3;
          },
          retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          refetchOnWindowFocus: false,
          refetchOnMount: true,
          refetchOnReconnect: true,
        },
        mutations: {
          retry: false,
          onError: (error: any) => {
            console.error('=== MUTATION ERROR IN QUERY PROVIDER ===');
            console.error('Mutation error:', error);
            
            // Enhanced error logging for mutations
            if (error) {
              console.error('Error type:', typeof error);
              console.error('Error constructor:', error.constructor?.name);
              
              try {
                console.error('Full error object (JSON):', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
              } catch (jsonError) {
                console.error('Could not JSON stringify error:', jsonError);
              }
              
              console.error('Error message:', error.message);
              console.error('Error code:', error.code);
              console.error('Error details:', error.details);
              console.error('Error hint:', error.hint);
              console.error('Error stack:', error.stack);
              
              // For Supabase errors
              if (error.error) {
                console.error('Nested error:', error.error);
              }
              
              // Provide user-friendly error messages
              let userFriendlyMessage = 'An error occurred';
              
              if (error.message?.includes('RLS Policy')) {
                userFriendlyMessage = 'Database permission error. Please contact the administrator.';
              } else if (error.message?.includes('duplicate')) {
                userFriendlyMessage = 'This item already exists. Please choose a different name.';
              } else if (error.message?.includes('required')) {
                userFriendlyMessage = 'Please fill in all required fields.';
              } else if (error.message?.includes('not found')) {
                userFriendlyMessage = 'The requested item was not found.';
              } else if (error.message) {
                userFriendlyMessage = error.message;
              }
              
              console.error('User-friendly message:', userFriendlyMessage);
            }
            console.error('=== END MUTATION ERROR LOGGING ===');
            
            // You can add global error handling here
            // For example, show a toast notification
          },
        },
      },
    });
  }
  return queryClient;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const client = getQueryClient();

  return (
    <QueryClientProvider client={client}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          position={"bottom-right" as any}
        />
      )}
    </QueryClientProvider>
  );
}
