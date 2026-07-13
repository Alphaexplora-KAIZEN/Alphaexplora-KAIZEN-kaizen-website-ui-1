import { usePropertyManagementViewModel } from '../../property-management/viewModels/usePropertyManagementViewModel';
import { useCleaningServicesViewModel } from '../../cleaning-services/viewModels/useCleaningServicesViewModel';
import { useAirconCareViewModel } from '../../aircon-care/viewModels/useAirconCareViewModel';

/**
 * "What We Do" combines all three service pages into one long page, so it
 * needs all three datasets. Each keeps its own loading/error state from its
 * existing ViewModel; this hook just aggregates them for the view.
 */
export function useWhatWeDoViewModel() {
  const propertyManagement = usePropertyManagementViewModel();
  const cleaningServices = useCleaningServicesViewModel();
  const airconCare = useAirconCareViewModel();

  const isLoading = propertyManagement.isLoading || cleaningServices.isLoading || airconCare.isLoading;
  const error = propertyManagement.error ?? cleaningServices.error ?? airconCare.error;
  const data =
    propertyManagement.data && cleaningServices.data && airconCare.data
      ? { propertyManagement: propertyManagement.data, cleaningServices: cleaningServices.data, airconCare: airconCare.data }
      : null;

  return { data, isLoading, error };
}
