"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { GearMark } from "@/components/core/gear-mark";
import { moduleIconMap } from "@/components/core/module-icon";
import { accentSoft, getModuleByPath, moduleGroups } from "@/lib/begear/modules";
import { useAppShellStore } from "@/lib/state/app-shell-store";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const isSidebarCollapsed = useAppShellStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useAppShellStore((state) => state.toggleSidebar);
  const pathname = usePathname();
  const activeKey = getModuleByPath(pathname)?.key;

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 border-r border-border bg-card transition-all lg:flex lg:flex-col",
        isSidebarCollapsed ? "w-[76px]" : "w-72",
      )}
    >
      <div className="flex h-16 items-center gap-3 px-4">
        <GearMark className="shrink-0" />
        <div className={cn("min-w-0", isSidebarCollapsed && "sr-only")}>
          <p className="truncate text-sm font-semibold tracking-tight">BeGear</p>
          <p className="truncate text-xs text-muted-foreground">Ecosystem</p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {moduleGroups.map((group) => (
          <div key={group.label} className="space-y-0.5">
            <p
              className={cn(
                "mb-1.5 px-3 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground/80",
                isSidebarCollapsed && "sr-only",
              )}
            >
              {group.label}
            </p>
            {group.modules.map((module) => {
              const Icon = moduleIconMap[module.icon];
              const isActive = module.key === activeKey;
              return (
                <Link
                  key={module.key}
                  href={module.path}
                  title={module.label}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "font-medium text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    isSidebarCollapsed && "justify-center px-0",
                  )}
                  style={
                    isActive ? { backgroundColor: accentSoft(module.accent) } : undefined
                  }
                >
                  {isActive ? (
                    <span
                      className="absolute inset-y-1.5 left-0 w-1 rounded-r-full"
                      style={{ backgroundColor: module.accent }}
                      aria-hidden="true"
                    />
                  ) : null}
                  <Icon
                    className="size-[18px] shrink-0"
                    style={isActive ? { color: module.accent } : undefined}
                    aria-hidden="true"
                  />
                  <span
                    className={cn("flex-1 truncate", isSidebarCollapsed && "sr-only")}
                  >
                    {module.label}
                  </span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
            isSidebarCollapsed && "justify-center px-0",
          )}
          aria-label={isSidebarCollapsed ? "Espandi menu" : "Comprimi menu"}
        >
          <ChevronLeft
            className={cn(
              "size-4 transition-transform",
              isSidebarCollapsed && "rotate-180",
            )}
            aria-hidden="true"
          />
          <span className={cn(isSidebarCollapsed && "sr-only")}>Comprimi</span>
        </button>
      </div>
    </aside>
  );
}
