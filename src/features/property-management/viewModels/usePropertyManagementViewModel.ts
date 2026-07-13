import { useAsyncData } from '../../../shared/hooks/useAsyncData';
import { fetchPropertyManagementData } from '../../../shared/models/apiService';
import type { PropertyManagementData } from '../../../shared/models/types';

/**
 * VIEWMODEL — calls the Model layer, owns loading/error state, exposes a
 * plain { data, isLoading, error } contract. Views never call apiService
 * directly.
 */
export function usePropertyManagementViewModel() {
  return useAsyncData<PropertyManagementData>(fetchPropertyManagementData, 'Failed to load page content.');
}
