"use client";

import { Bell, Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";

import { GearMark } from "@/components/core/gear-mark";
import { Button } from "@/components/ui/button";
import { getModuleByKey, getModuleByPath } from "@/lib/begear/modules";
import { useAppShellStore } from "@/lib/state/app-shell-store";

export function Topbar() {
  const setCommandOpen = useAppShellStore((state) => state.setCommandOpen);
  const setMobileNavOpen = useAppShellStore((state) => state.setMobileNavOpen);
  const pathname = usePathname();
  const activeModule = getModuleByPath(pathname) ?? getModuleByKey("dashboard");
  const isDashboard = activeModule.key === "dashboard";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/85 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-5 lg:px-8">
        <div className="flex items-center gap-2 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Apri menu di navigazione"
          >
            <Menu aria-hidden="true" />
          </Button>
          <GearMark />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>BeGear</span>
            {!isDashboard ? (
              <>
                <span aria-hidden="true">/</span>
                <span>{activeModule.label}</span>
              </>
            ) : null}
          </div>
          <p className="truncate text-base font-semibold tracking-tight">
            {activeModule.label}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          className="hidden min-w-64 items-center gap-3 rounded-xl border border-input bg-background px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-accent md:flex"
        >
          <Search className="size-4" aria-hidden="true" />
          <span className="flex-1">Cerca moduli…</span>
          <kbd className="rounded-md border border-border px-1.5 py-0.5 text-[0.7rem]">
            Ctrl K
          </kbd>
        </button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCommandOpen(true)}
            className="md:hidden"
            aria-label="Cerca"
          >
            <Search aria-hidden="true" />
          </Button>
          <Button variant="outline" size="icon" aria-label="Notifiche">
            <Bell aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  );
}
