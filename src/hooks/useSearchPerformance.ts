/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef } from 'react';

interface SearchPerformanceMetrics {
  searchDuration: number;
  resultCount: number;
  timestamp: number;
  query: string;
}

export function useSearchPerformance() {
  const [metrics, setMetrics] = useState<SearchPerformanceMetrics[]>([]);
  const searchStartTime = useRef<number>(0);

  const startSearch = (query: string) => {
    searchStartTime.current = performance.now();
  };

  const endSearch = (query: string, resultCount: number) => {
    const duration = performance.now() - searchStartTime.current;
    const newMetric: SearchPerformanceMetrics = {
      searchDuration: duration,
      resultCount,
      timestamp: Date.now(),
      query,
    };

    setMetrics(prev => {
      const updated = [newMetric, ...prev.slice(0, 9)]; // Keep last 10 searches
      return updated;
    });

    // Log performance in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 Search Performance: "${query}" took ${duration.toFixed(2)}ms, found ${resultCount} results`);
    }
  };

  const getAverageSearchTime = () => {
    if (metrics.length === 0) return 0;
    const total = metrics.reduce((sum, metric) => sum + metric.searchDuration, 0);
    return total / metrics.length;
  };

  const getSearchStats = () => ({
    totalSearches: metrics.length,
    averageTime: getAverageSearchTime(),
    fastestSearch: Math.min(...metrics.map(m => m.searchDuration)),
    slowestSearch: Math.max(...metrics.map(m => m.searchDuration)),
    recentSearches: metrics.slice(0, 5),
  });

  return {
    startSearch,
    endSearch,
    metrics,
    getSearchStats,
  };
}
