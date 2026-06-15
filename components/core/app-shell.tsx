import type { ReactNode } from "react";

import { AgentDock } from "@/components/core/agent-dock";
import { AppSidebar } from "@/components/core/app-sidebar";
import { CommandPalette } from "@/components/core/command-palette";
import { MobileNav } from "@/components/core/mobile-nav";
import { Topbar } from "@/components/core/topbar";

export interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen lg:flex">
      <AppSidebar />
      <div className="min-w-0 flex-1">
        <Topbar />
        <main className="mx-auto w-full max-w-6xl px-5 py-7 lg:px-8 lg:py-9">
          {children}
        </main>
      </div>
      <MobileNav />
      <CommandPalette />
      <AgentDock />
    </div>
  );
}
