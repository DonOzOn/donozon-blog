import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing values
 * @param value The value to debounce
 * @param delay The debounce delay in milliseconds (default: 500ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if value changes before delay completes
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for debounced search with additional features
 * @param initialValue Initial search value
 * @param delay Debounce delay in milliseconds (default: 300ms)
 * @returns Object containing current value, debounced value, setter, and loading state
 */
export function useDebouncedSearch(initialValue: string = '', delay: number = 300) {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const debouncedValue = useDebounce(searchValue, delay);

  useEffect(() => {
    // Set loading state when search value changes
    if (searchValue !== debouncedValue) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
      
      // Add to search history if it's a meaningful search
      if (debouncedValue.trim().length > 0) {
        setSearchHistory(prev => {
          const newHistory = [debouncedValue, ...prev.filter(item => item !== debouncedValue)];
          return newHistory.slice(0, 10); // Keep only last 10 searches
        });
      }
    }
  }, [searchValue, debouncedValue]);

  const clearSearch = () => {
    setSearchValue('');
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  return {
    searchValue,
    debouncedValue,
    setSearchValue,
    isSearching,
    hasValue: debouncedValue.trim().length > 0,
    hasActiveSearch: searchValue.trim().length > 0,
    searchHistory,
    clearSearch,
    clearHistory,
  };
}

/**
 * Custom hook for debounced value with cancel functionality
 * @param value The value to debounce
 * @param delay The debounce delay in milliseconds
 * @returns Object containing debounced value and cancel function
 */
export function useDebouncedValue<T>(value: T, delay: number = 500) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setIsPending(true);
    
    const timer = setTimeout(() => {
      setDebouncedValue(value);
      setIsPending(false);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  const cancel = () => {
    setDebouncedValue(value);
    setIsPending(false);
  };

  return {
    debouncedValue,
    isPending,
    cancel,
  };
}
