import { AppHeader } from "@/components/layout/app-header";
import { Sidebar } from "@/components/navigation/sidebar";
import { BottomTabs } from "@/components/navigation/bottom-tabs";

/**
 * Responsive shell: sidebar on desktop (md+), bottom-tab bar on mobile.
 *
 * Mobile: the shell is `fixed inset-0`, so it covers exactly the device viewport
 * box — no `vh/svh/dvh` height math to under/overshoot and leave a gap. The
 * bottom tab bar is the last flex child, so it lands on the true bottom edge of
 * the screen. ONLY <main> scrolls internally, so the browser chrome never
 * auto-hides mid-scroll and the bar cannot drift or bounce. Desktop (md+) drops
 * back to normal grid flow with the sidebar.
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
      <div className="fixed inset-0 flex flex-col overflow-hidden md:static md:min-h-svh md:overflow-visible">
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
