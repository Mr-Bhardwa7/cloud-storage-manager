/**
 * Simple GeoIP utility that gracefully handles missing database files
 */
export const getCountryFromIP = (ip: string): string => {
  try {
    // If you want to add actual GeoIP functionality later, you can implement it here
    // For now, just return a default value to avoid errors
    console.warn('GeoIP lookup not implemented', ip);
    return 'Unknown';
  } catch (error) {
    console.warn('GeoIP lookup failed:', error);
    return 'Unknown';
  }
};