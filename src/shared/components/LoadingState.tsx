import KaizenMark from './KaizenMark';

interface LoadingStateProps {
  /** Fills the whole viewport (route-level) vs. a section within a page. */
  fullScreen?: boolean;
}

export function LoadingState({ fullScreen = false }: LoadingStateProps) {
  return (
    <div
      className={`flex items-center justify-center text-teal ${
        fullScreen ? 'min-h-screen bg-background' : 'min-h-[60vh]'
      }`}
    >
      <KaizenMark size={fullScreen ? 44 : 40} />
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  fullScreen?: boolean;
}

export function ErrorState({ message, fullScreen = false }: ErrorStateProps) {
  return (
    <div
      className={`flex items-center justify-center px-6 text-center ${
        fullScreen ? 'min-h-screen bg-background' : 'min-h-[60vh]'
      }`}
    >
      <p className="text-on-surface-variant">{message}</p>
    </div>
  );
}
