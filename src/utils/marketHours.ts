/**
 * Utility functions for checking market hours and managing API fetch policies
 */

/**
 * Checks if the US market is open based on New York time
 * Includes pre-market (4:00 AM - 9:30 AM) and after-hours (4:00 PM - 8:00 PM)
 */
export const isMarketOpen = (): boolean => {
  // Get current time in New York timezone
  const now = new Date();
  const options = { timeZone: 'America/New_York' };
  const nyTime = new Date(now.toLocaleString('en-US', options));
  
  // Extract day of week, hours, and minutes
  const day = nyTime.getDay();
  const hours = nyTime.getHours();
  const minutes = nyTime.getMinutes();
  const currentTimeInMinutes = hours * 60 + minutes;
  
  // Market is open on weekdays (1 = Monday, 5 = Friday)
  if (day >= 1 && day <= 5) {
    // Pre-market: 4:00 AM - 9:30 AM and regular+after-hours: 9:30 AM - 8:00 PM
    const preMarketOpenTime = 4 * 60; // 4:00 AM
    const afterHoursCloseTime = 20 * 60; // 8:00 PM
    
    // Check if within extended trading hours
    if (currentTimeInMinutes >= preMarketOpenTime && currentTimeInMinutes <= afterHoursCloseTime) {
      return true;
    }
  }
  
  return false;
};

/**
 * Determines if we should fetch data based on market hours and last update time
 * @param lastUpdateTime - timestamp of the last update
 * @param forceFirstLoad - whether to force loading on first visit
 * @param existingData - whether we already have data to display
 */
export const shouldFetchMarketData = (
  lastUpdateTime: number | null, 
  forceFirstLoad: boolean = true,
  existingData: boolean = false
): boolean => {
  // Always fetch if we are forcing first load and have no data yet
  if (forceFirstLoad && !existingData) {
    return true;
  }
  
  // Check if market is open
  const marketOpen = isMarketOpen();
  
  // If market is closed and we have data, don't fetch
  if (!marketOpen && existingData) {
    return false;
  }
  
  // If market is open, check when we last updated
  if (lastUpdateTime) {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateTime;
    
    // If market is open, update every 5 minutes (300000 ms)
    return timeSinceLastUpdate > 300000;
  }
  
  return true;
};

/**
 * Returns appropriate refresh interval based on market status
 */
export const getRefreshInterval = (): number => {
  // 5 minutes in milliseconds
  return 5 * 60 * 1000;
}; 