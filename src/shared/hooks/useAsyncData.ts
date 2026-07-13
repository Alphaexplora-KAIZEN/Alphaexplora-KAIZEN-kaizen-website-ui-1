import { useEffect, useState } from 'react';

interface AsyncDataState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Generic "fetch on mount, own loading/error state" hook. Every page-level
 * ViewModel (property management, cleaning services, aircon care, site
 * chrome) follows this exact shape, so it's defined once here instead of
 * being copy-pasted per feature.
 *
 * Cancels state updates if the component unmounts before the request
 * resolves, avoiding "set state on an unmounted component" warnings.
 * Pass a stable `fetcher` reference (e.g. a module-level function) — a new
 * function identity on every render will re-trigger the fetch.
 */
export function useAsyncData<T>(fetcher: () => Promise<T>, fallbackErrorMessage: string): AsyncDataState<T> {
  const [state, setState] = useState<AsyncDataState<T>>({ data: null, isLoading: true, error: null });

  useEffect(() => {
    let cancelled = false;

    fetcher()
      .then((data) => {
        if (!cancelled) setState({ data, isLoading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) {
          setState({
            data: null,
            isLoading: false,
            error: err instanceof Error ? err.message : fallbackErrorMessage,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fetcher, fallbackErrorMessage]);

  return state;
}
