import { apiCall } from './api';
import { getToken } from './auth';

export interface Category {
  id: string;
  name: string;
}

// Hardcoded fallbacks (current values) — used if API fails
const FALLBACK_CATEGORIES: Category[] = [
  { id: '6687bccbc72c439123456789', name: 'Makeup' },
  { id: '698f1be2b8fd0dcd14a31025', name: 'Hair Styling' },
  { id: '698f1be2b8fd0dcd14a31026', name: 'Nail Art' },
  { id: '698f1be2b8fd0dcd14a31027', name: 'Mehendi' },
];

let cachedCategories: Category[] | null = null;

/**
 * Fetch categories from the API. Caches result in memory for the session.
 * Falls back to hardcoded values if the API call fails.
 */
export const fetchCategories = async (): Promise<Category[]> => {
  if (cachedCategories) {
    return cachedCategories;
  }

  try {
    const token = await getToken();
    const res = await apiCall('/categories/getAllCategoriesList', { token: token || undefined, silent: true });

    // Handle various response shapes
    const list: any[] = Array.isArray(res) ? res : (res?.categories || res?.data || []);

    if (list.length > 0) {
      cachedCategories = list.map((c: any) => ({
        id: c._id || c.id,
        name: c.name || c.title || c.label,
      }));
      console.log('[CategoryService] Fetched', cachedCategories.length, 'categories from API');
      return cachedCategories;
    }
  } catch (e) {
    console.warn('[CategoryService] API fetch failed, using fallback:', e);
  }

  cachedCategories = FALLBACK_CATEGORIES;
  return cachedCategories;
};

/** Returns category name strings for dropdown display. */
export const getCategoryNames = (): string[] => {
  return (cachedCategories || FALLBACK_CATEGORIES).map(c => c.name);
};

/** Map category label → ObjectID. */
export const getCategoryIdByName = (name: string): string => {
  const cats = cachedCategories || FALLBACK_CATEGORIES;
  const found = cats.find(c => c.name === name);
  return found?.id || name; // return raw value if not found (may already be an ID)
};

/** Map ObjectID → category label. */
export const getCategoryNameById = (id: string): string => {
  const cats = cachedCategories || FALLBACK_CATEGORIES;
  const found = cats.find(c => c.id === id);
  return found?.name || id; // return raw value if not found
};

/** Clear the cache (useful for testing or forced refresh). */
export const clearCategoryCache = () => {
  cachedCategories = null;
};
