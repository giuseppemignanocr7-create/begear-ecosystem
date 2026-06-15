"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { GearMark } from "@/components/core/gear-mark";
import { moduleIconMap } from "@/components/core/module-icon";
import { accentSoft, getModuleByPath, moduleGroups } from "@/lib/begear/modules";
import { useAppShellStore } from "@/lib/state/app-shell-store";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const isMobileNavOpen = useAppShellStore((state) => state.isMobileNavOpen);
  const setMobileNavOpen = useAppShellStore((state) => state.setMobileNavOpen);
  const pathname = usePathname();
  const activeKey = getModuleByPath(pathname)?.key;

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname, setMobileNavOpen]);

  return (
    <Dialog.Root open={isMobileNavOpen} onOpenChange={setMobileNavOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm lg:hidden" />
        <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-border bg-card lg:hidden">
          <Dialog.Title className="sr-only">Menu di navigazione BeGear</Dialog.Title>
          <div className="flex h-16 items-center justify-between gap-3 px-4">
            <div className="flex items-center gap-3">
              <GearMark className="shrink-0" />
              <div>
                <p className="text-sm font-semibold tracking-tight">BeGear</p>
                <p className="text-xs text-muted-foreground">Ecosystem</p>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Chiudi menu"
                className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-3">
            {moduleGroups.map((group) => (
              <div key={group.label} className="space-y-1">
                <p className="px-3 pb-1 text-[0.68rem] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </p>
                {group.modules.map((module) => {
                  const Icon = moduleIconMap[module.icon];
                  const isActive = module.key === activeKey;
                  return (
                    <Link
                      key={module.key}
                      href={module.path}
                      onClick={() => setMobileNavOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "font-medium text-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      )}
                      style={
                        isActive
                          ? { backgroundColor: accentSoft(module.accent) }
                          : undefined
                      }
                    >
                      <Icon
                        className="size-[18px] shrink-0"
                        style={isActive ? { color: module.accent } : undefined}
                        aria-hidden="true"
                      />
                      <span className="flex-1 truncate">{module.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
