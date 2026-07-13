import { useAsyncData } from '../../../shared/hooks/useAsyncData';
import { fetchHomepageData } from '../../../shared/models/apiService';
import type { HomepageData } from '../../../shared/models/types';

export function useHomepageViewModel() {
  return useAsyncData<HomepageData>(fetchHomepageData, 'Failed to load page content.');
}
