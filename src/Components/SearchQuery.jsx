import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, Tag, Folder, User, Calendar, TrendingUp, Star, Zap, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdvancedSearchEngine } from '@/lib/advancedSearchEngine';

const SearchQuery = ({
  searchData = [],
  onSearchSelect,
  placeholder = "Search...",
  className = "",
  resultLimit = 10,
  iconOnly = false
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedFilters] = useState({
    type: 'all',
    category: 'all',
    tags: [],
    dateRange: 'all',
    author: 'all'
  });
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  const [searchEngine, setSearchEngine] = useState(null);

  useEffect(() => {
    if (!searchData || searchData.length === 0) {
      setSearchEngine(null);
      return;
    }

    try {
      const engine = new AdvancedSearchEngine(searchData, {
        debounceMs: 150,
        maxResults: resultLimit,
        fuzzyThreshold: 0.6,
        enableHighlighting: true,
        enableAnalytics: true
      });
      setSearchEngine(engine);
    } catch (error) {
      console.error('SearchQuery: Failed to initialize search engine:', error);
      setSearchEngine(null);
    }
  }, [searchData, resultLimit]);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const popular = JSON.parse(localStorage.getItem('popularSearches') || '{}');

    const recentStrings = recent
      .filter(item => typeof item === 'string')
      .slice(0, 5);

    setRecentSearches(recentStrings);
    setPopularSearches(
      Object.entries(popular)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([term]) => term)
    );
  }, []);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setFilteredResults([]);
      setIsSearching(false);
      return;
    }

    if (!searchEngine) {
      console.warn('Search engine not initialized');
      setFilteredResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    try {
      const results = await searchEngine.search(searchQuery, selectedFilters);
      setFilteredResults(results);

      const suggestions = searchEngine.getSuggestions(searchQuery, 8);
      setSearchSuggestions(suggestions);

    } catch (error) {
      console.error('Search error:', error);
      setFilteredResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim()) {
      performSearch(value);
    } else {
      setFilteredResults([]);
      setSearchSuggestions([]);
    }
  };

  const handleResultSelect = (result) => {
    if (searchEngine) {
      searchEngine.trackResultClick(result.id, query);
    }

    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const updatedRecent = [query, ...recent.filter(s => s !== query && typeof s === 'string')].slice(0, 10);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));

    const popular = JSON.parse(localStorage.getItem('popularSearches') || '{}');
    popular[query] = (popular[query] || 0) + 1;
    localStorage.setItem('popularSearches', JSON.stringify(popular));

    if (onSearchSelect) {
      onSearchSelect(result);
    }

    setIsOpen(false);
    setQuery('');
    setFilteredResults([]);
    setSearchSuggestions([]);
  };

  const handleSuggestionSelect = (suggestion) => {
    const searchTerm = typeof suggestion === 'string' ? suggestion : suggestion.title || suggestion.name || '';
    setQuery(searchTerm);
    performSearch(searchTerm);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (filteredResults.length > 0) {
      handleResultSelect(filteredResults[0]);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setFilteredResults([]);
    setSearchSuggestions([]);
    if (iconOnly) {
      handleCollapse();
    } else {
      inputRef.current?.focus();
    }
  };

  const handleIconClick = () => {
    setIsExpanded(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    setIsOpen(false);
    setQuery('');
    setFilteredResults([]);
    setSearchSuggestions([]);
  };

  const getResultIcon = (result) => {
    const iconProps = { size: 16, className: "text-gray-400" };

    switch (result.type) {
      case 'product':
        return <Star {...iconProps} className="text-yellow-500" />;
      case 'category':
        return <Folder {...iconProps} className="text-blue-500" />;
      case 'page':
        return <Tag {...iconProps} className="text-green-500" />;
      case 'blog':
        return <Calendar {...iconProps} className="text-purple-500" />;
      default:
        return <Search {...iconProps} />;
    }
  };

  const getResultColor = (result) => {
    switch (result.type) {
      case 'product':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'category':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'page':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'blog':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const highlightText = (text, query) => {
    if (!query || !text) return text;

    if (!searchEngine) {
      const queryWords = query.split(' ').filter(word => word.length > 1);
      let highlightedText = text;

      queryWords.forEach(word => {
        const regex = new RegExp(`(${word})`, 'gi');
        highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
      });

      return highlightedText;
    }

    return searchEngine.highlightText(text, query);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        if (iconOnly) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [iconOnly]);

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        {iconOnly && !isExpanded ? (
          <motion.button
            key="icon"
            onClick={handleIconClick}
            className="nav-primary-icon"
            aria-label="Search"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search size={22} className="sm:w-6 sm:h-6" />
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            className="relative"
            initial={iconOnly ? { width: 0, opacity: 0 } : false}
            animate={{ width: "auto", opacity: 1 }}
            exit={iconOnly ? { width: 0, opacity: 0 } : false}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={handleSearchChange}
                  onFocus={() => setIsOpen(true)}
                  placeholder={placeholder}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                  autoComplete="off"
                />
                {query && !iconOnly && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                {iconOnly && (
                  <button
                    type="button"
                    aria-label="Close search"
                    onClick={handleCollapse}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                {isSearching && (
                  <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  </div>
                )}
              </div>
            </form>

            <AnimatePresence>
              {isOpen && (query || recentSearches.length > 0 || popularSearches.length > 0) && (
                <motion.div
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {query && searchSuggestions.length > 0 && (
                    <div className="p-2 border-b border-gray-200 bg-gray-50">
                      <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center space-x-2">
                        <Zap className="w-3 h-3" />
                        <span>Suggestions</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {searchSuggestions.slice(0, 6).map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionSelect(suggestion)}
                            className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full hover:bg-teal-200 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {query && filteredResults.length > 0 && (
                    <div className="p-2">
                      <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center space-x-2">
                        <Search className="w-3 h-3" />
                        <span>Search Results ({filteredResults.length})</span>
                      </div>
                      {filteredResults.map((result, index) => (
                        <motion.button
                          key={`${result.id}-${index}`}
                          onClick={() => handleResultSelect(result)}
                          className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                          <div className="flex items-start space-x-3">
                            {getResultIcon(result)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4
                                  className="text-sm font-medium text-gray-900 truncate"
                                  dangerouslySetInnerHTML={{
                                    __html: highlightText(result.title, query)
                                  }}
                                />
                                <span className={`text-xs px-2 py-1 rounded-full border ${getResultColor(result)}`}>
                                  {result.type || 'content'}
                                </span>
                                {result.relevanceScore > 80 && (
                                  <Star className="w-3 h-3 text-yellow-500" />
                                )}
                              </div>
                              <p
                                className="text-xs text-gray-600 line-clamp-2 mb-2"
                                dangerouslySetInnerHTML={{
                                  __html: highlightText(result.excerpt || result.description || result.content?.substring(0, 100) + '...', query)
                                }}
                              />
                              <div className="flex items-center space-x-3 text-xs text-gray-500">
                                {result.category && (
                                  <span className="flex items-center space-x-1">
                                    <Folder className="w-3 h-3" />
                                    <span>{result.category}</span>
                                  </span>
                                )}
                                {result.author && (
                                  <span className="flex items-center space-x-1">
                                    <User className="w-3 h-3" />
                                    <span>{result.author}</span>
                                  </span>
                                )}
                                {result.date && (
                                  <span className="flex items-center space-x-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{formatDate(result.date)}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {query && filteredResults.length === 0 && !isSearching && (
                    <div className="p-4 text-center text-gray-500">
                      <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No results found for "{query}"</p>
                      <p className="text-xs mt-1">Try different keywords or check your spelling</p>
                    </div>
                  )}

                  {!query && recentSearches.length > 0 && (
                    <div className="p-2 border-b border-gray-200">
                      <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center space-x-2">
                        <Clock className="w-3 h-3" />
                        <span>Recent Searches</span>
                      </div>
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionSelect(search)}
                          className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                        >
                          {typeof search === 'string' ? search : search.title || search.name || 'Invalid search'}
                        </button>
                      ))}
                    </div>
                  )}

                  {!query && popularSearches.length > 0 && (
                    <div className="p-2">
                      <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center space-x-2">
                        <TrendingUp className="w-3 h-3" />
                        <span>Popular Searches</span>
                      </div>
                      {popularSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionSelect(search)}
                          className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                        >
                          {typeof search === 'string' ? search : search.title || search.name || 'Invalid search'}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchQuery;
