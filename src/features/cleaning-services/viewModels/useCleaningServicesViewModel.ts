import { useAsyncData } from '../../../shared/hooks/useAsyncData';
import { fetchCleaningServicesData } from '../../../shared/models/apiService';
import type { CleaningServicesData } from '../../../shared/models/types';

export function useCleaningServicesViewModel() {
  return useAsyncData<CleaningServicesData>(fetchCleaningServicesData, 'Failed to load page content.');
}
