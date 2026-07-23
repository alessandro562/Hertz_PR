import { AppHeader } from "@/components/layout/app-header";
import { Sidebar } from "@/components/navigation/sidebar";
import { BottomTabs } from "@/components/navigation/bottom-tabs";

/**
 * Responsive shell: sidebar on desktop (md+), bottom-tab bar on mobile.
 *
 * Mobile: the shell is locked to the REAL device viewport height via the
 * `--app-height` CSS variable (set from visualViewport by an inline script in
 * layout.tsx, before first paint and on every resize/rotate). ONLY <main>
 * scrolls internally; the bottom tab bar is a normal flex child pinned at the
 * end of the column, so it sits at the true bottom of whatever phone opens the
 * app — no first-paint bounce (which raw `100dvh` causes) and no gap (which a
 * static `100svh` leaves). Desktop uses normal document flow.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:grid md:min-h-svh md:grid-cols-[16rem_1fr]">
      <a
        href="#main"
        className="sr-only rounded-sm bg-primary px-3 py-2 text-sm text-primary-foreground focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50"
      >
        Salta al contenuto
      </a>
      <Sidebar className="hidden md:flex" />
      <div className="flex h-[var(--app-height)] flex-col md:h-auto md:min-h-svh">
        <AppHeader />
        <main
          id="main"
          className="flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-8 md:overflow-visible md:px-6 md:pt-6"
        >
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
        <BottomTabs className="md:hidden" />
      </div>
    </div>
  );
}
