import React from "react";
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-10 bg-red-950/20 border border-red-500/50 rounded-2xl backdrop-blur-md">
      <h2 className="text-2xl font-bold text-red-500 mb-4">Industrial Console Critical Error</h2>
      <pre className="text-xs font-mono text-red-300 bg-red-950 p-4 rounded-lg overflow-auto max-w-full mb-6">
        {error.message}
      </pre>
      <button
        onClick={resetErrorBoundary}
        className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-all font-bold"
      >
        Attempt Recovery
      </button>
    </div>
  );
}

export default function AppErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of your app so the error doesn't happen again
        window.location.reload();
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
