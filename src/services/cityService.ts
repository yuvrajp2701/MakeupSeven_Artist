import { apiCall } from './api';
import { getToken } from './auth';

// Hardcoded fallbacks — used if API fails
const FALLBACK_CITIES: string[] = ['Mumbai', 'Delhi', 'Bangalore', 'Pune'];

let cachedCities: string[] | null = null;

/**
 * Fetch cities from the API. Caches result in memory for the session.
 * Falls back to hardcoded values if the API call fails.
 */
export const fetchCities = async (): Promise<string[]> => {
  if (cachedCities) {
    return cachedCities;
  }

  try {
    const token = await getToken();
    const res = await apiCall('/service-zones/getAllMasterCities', { token: token || undefined, silent: true });

    // Handle various response shapes
    const list: any[] = Array.isArray(res) ? res : (res?.cities || res?.data || []);

    if (list.length > 0) {
      // Cities could be strings or objects with a name field
      cachedCities = list.map((c: any) => (typeof c === 'string' ? c : c.name || c.city || c.label));
      console.log('[CityService] Fetched', cachedCities.length, 'cities from API');
      return cachedCities;
    }
  } catch (e) {
    console.warn('[CityService] API fetch failed, using fallback:', e);
  }

  cachedCities = FALLBACK_CITIES;
  return cachedCities;
};

/** Returns cached city names for dropdown display. */
export const getCityNames = (): string[] => {
  return cachedCities || FALLBACK_CITIES;
};

/** Clear the cache (useful for testing or forced refresh). */
export const clearCityCache = () => {
  cachedCities = null;
};
