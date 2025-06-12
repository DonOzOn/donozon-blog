import React from 'react';
import { Tag } from 'antd';
import { ClockCircleOutlined, SearchOutlined, ClearOutlined } from '@ant-design/icons';

interface SearchSuggestionsProps {
  searchHistory: string[];
  popularSearches?: string[];
  onSelectSuggestion: (suggestion: string) => void;
  onClearHistory?: () => void;
  isVisible: boolean;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  searchHistory,
  popularSearches = [],
  onSelectSuggestion,
  onClearHistory,
  isVisible,
}) => {
  if (!isVisible) return null;

  const hasHistory = searchHistory.length > 0;
  const hasPopular = popularSearches.length > 0;

  if (!hasHistory && !hasPopular) return null;

  return (
    <div className="search-suggestions-dropdown absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
      {hasHistory && (
        <div className="p-3 border-b border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1 text-sm text-slate-300">
              <ClockCircleOutlined />
              <span>Recent searches</span>
            </div>
            {onClearHistory && (
              <button
                onClick={onClearHistory}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                <ClearOutlined />
              </button>
            )}
          </div>
          <div className="space-y-1">
            {searchHistory.slice(0, 5).map((search, index) => (
              <button
                key={index}
                onClick={() => onSelectSuggestion(search)}
                className="w-full text-left px-2 py-1 text-sm text-slate-300 hover:bg-slate-700 rounded transition-colors"
              >
                <SearchOutlined className="mr-2 text-slate-500" />
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {hasPopular && (
        <div className="p-3">
          <div className="text-sm text-white mb-2">Popular searches</div>
          <div className="flex flex-wrap gap-1">
            {popularSearches.slice(0, 8).map((search, index) => (
              <Tag
                key={index}
                className="search-suggestion-tag cursor-pointer transition-all"
                onClick={() => onSelectSuggestion(search)}
                style={{
                  backgroundColor: 'rgba(51, 65, 85, 0.5)',
                  borderColor: '#475569',
                  color: '#f8fafc',
                  fontSize: '12px',
                  padding: '2px 8px',
                  margin: '2px'
                }}
              >
                {search}
              </Tag>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
