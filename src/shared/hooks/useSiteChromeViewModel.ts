import { useAsyncData } from './useAsyncData';
import { fetchSiteChrome } from '../models/apiService';
import type { SiteChrome } from '../models/types';

/**
 * Shared ViewModel for the Navbar/Footer chrome that appears on every page.
 * Lives in shared/ (not a single feature) because 3+ features consume it.
 */
export function useSiteChromeViewModel() {
  return useAsyncData<SiteChrome>(fetchSiteChrome, 'Failed to load site navigation.');
}
