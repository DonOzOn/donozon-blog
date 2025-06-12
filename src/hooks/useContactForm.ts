'use client';

import { useState } from 'react';
import { sendEmail, ContactFormData } from '@/services/emailService';

export const useContactForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitForm = async (formData: ContactFormData) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const success = await sendEmail(formData);
      
      if (success) {
        setIsSuccess(true);
        return true;
      } else {
        setError('Failed to send email. Please try again or contact me directly.');
        return false;
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setError(null);
  };

  return {
    submitForm,
    resetForm,
    isLoading,
    isSuccess,
    error,
  };
};
