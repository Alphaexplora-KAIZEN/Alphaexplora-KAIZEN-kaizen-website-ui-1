import type { ReactNode } from 'react';
import { LoadingState, ErrorState } from './LoadingState';

interface AsyncStateProps<T> {
  isLoading: boolean;
  error: string | null;
  data: T | null | undefined;
  children: (data: T) => ReactNode;
}

/**
 * Renders a spinner while loading, an error message on failure, and otherwise
 * hands the resolved data to `children`. Used by every page-level view so the
 * loading/error markup only needs to be defined once.
 */
export default function AsyncState<T>({ isLoading, error, data, children }: AsyncStateProps<T>) {
  if (isLoading || !data) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  return <>{children(data)}</>;
}
