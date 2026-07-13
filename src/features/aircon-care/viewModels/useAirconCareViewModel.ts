import { useAsyncData } from '../../../shared/hooks/useAsyncData';
import { fetchAirconCareData } from '../../../shared/models/apiService';
import type { AirconCareData } from '../../../shared/models/types';

export function useAirconCareViewModel() {
  return useAsyncData<AirconCareData>(fetchAirconCareData, 'Failed to load page content.');
}
