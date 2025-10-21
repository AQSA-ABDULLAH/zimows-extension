import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { fetchClickCount } from '../store/features/shortUrlSlice';

/**
 * Custom hook to fetch click count every 3 seconds
 * @param {string} alias - The URL alias to fetch count for
 * @param {boolean} isActive - Whether to actively fetch updates
 */
export const useClickCountUpdater = (alias, isActive = true) => {
  const dispatch = useDispatch();
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!alias || !isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Extract alias from full URL if needed
    const extractedAlias = alias.includes('/') ? alias.split('/').pop() : alias;
    
    console.log('🔄 Starting click count updates for alias:', extractedAlias);
    
    // Fetch immediately
    dispatch(fetchClickCount(extractedAlias));
    
    // Set up interval for every 3 seconds
    intervalRef.current = setInterval(() => {
      console.log('🔄 Fetching click count for:', extractedAlias);
      dispatch(fetchClickCount(extractedAlias));
    }, 3000);

    // Cleanup on unmount or dependency change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [alias, isActive, dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
};