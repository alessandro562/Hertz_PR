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
        <img
          src="/brand/hertz-mark-white.png"
          alt="Caricamento hertz PR Hub"
          width="120"
          height="120"
          className="block"
        />
      </div>
    </div>
  );
}
