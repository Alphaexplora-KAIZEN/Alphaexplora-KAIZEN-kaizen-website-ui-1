import { useAsyncData } from '../../../shared/hooks/useAsyncData';
import { fetchAboutUsData } from '../../../shared/models/apiService';
import type { AboutUsData } from '../../../shared/models/types';
import { useCleaningServicesViewModel } from '../../cleaning-services/viewModels/useCleaningServicesViewModel';
import { useSiteChromeViewModel } from '../../../shared/hooks/useSiteChromeViewModel';

/**
 * About Us blends its own page copy with the T.I.M.E. core values (owned by
 * the Cleaning Services dataset) and site-wide contact info for the on-page
 * contact card. It no longer needs Property Management data now that the
 * duplicated "Why Choose Us" panel has been removed from this page.
 */
export function useAboutUsViewModel() {
  const aboutUs = useAsyncData<AboutUsData>(fetchAboutUsData, 'Failed to load page content.');
  const cleaningServices = useCleaningServicesViewModel();
  const chrome = useSiteChromeViewModel();

  const isLoading = aboutUs.isLoading || cleaningServices.isLoading || chrome.isLoading;
  const error = aboutUs.error ?? cleaningServices.error ?? chrome.error;
  const data =
    aboutUs.data && cleaningServices.data && chrome.data
      ? { aboutUs: aboutUs.data, cleaningServices: cleaningServices.data, chrome: chrome.data }
      : null;

  return { data, isLoading, error };
}
