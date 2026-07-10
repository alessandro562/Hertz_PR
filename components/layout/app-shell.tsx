import { AppHeader } from "@/components/layout/app-header";
import { Sidebar } from "@/components/navigation/sidebar";
import { BottomTabs } from "@/components/navigation/bottom-tabs";

/**
 * Responsive shell: sidebar on desktop (md+), bottom-tab bar on mobile.
 * Content gets extra bottom padding on mobile so the fixed tab bar never
 * overlaps it.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh md:grid md:grid-cols-[16rem_1fr]">
      <Sidebar className="hidden md:flex" />
      <div className="flex min-h-svh flex-col">
        <AppHeader />
        <main className="flex-1 px-4 pt-4 pb-24 md:px-6 md:pt-6 md:pb-8">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
        <BottomTabs className="md:hidden" />
      </div>
    </div>
  );
}
