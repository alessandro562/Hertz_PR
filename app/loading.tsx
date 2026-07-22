/**
 * Root-level loading screen shown during app startup.
 * Displays the Hertz logo with a subtle animation while the initial load happens.
 */
export default function RootLoading() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
      <style>{`
        @keyframes hertz-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .hertz-load { animation: hertz-pulse 1.5s ease-in-out infinite; }
      `}</style>
      <div className="hertz-load">
        <svg
          viewBox="0 0 200 200"
          width="120"
          height="120"
          className="text-primary"
          fill="currentColor"
          aria-label="Caricamento"
        >
          {/* Hertz waveform mark — simplified circular version */}
          <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.2" />
          <path
            d="M 70 100 Q 80 80 100 100 Q 120 120 130 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 60 100 Q 75 70 100 100 Q 125 130 140 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.5"
          />
        </svg>
      </div>
    </div>
  );
}
