"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { moduleGroups } from "@/lib/begear/modules";
import { useAppShellStore } from "@/lib/state/app-shell-store";

export function CommandPalette() {
  const isCommandOpen = useAppShellStore((state) => state.isCommandOpen);
  const setCommandOpen = useAppShellStore((state) => state.setCommandOpen);
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(!isCommandOpen);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandOpen, setCommandOpen]);

  return (
    <Dialog.Root open={isCommandOpen} onOpenChange={setCommandOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-24 z-50 w-[min(40rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-card shadow-pop">
          <Dialog.Title className="sr-only">Cerca moduli</Dialog.Title>
          <Command className="bg-transparent">
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search className="size-4 text-muted-foreground" aria-hidden="true" />
              <Command.Input
                autoFocus
                placeholder="Cerca un modulo…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <Command.List className="max-h-96 overflow-y-auto p-2">
              <Command.Empty className="px-4 py-6 text-sm text-muted-foreground">
                Nessun modulo trovato.
              </Command.Empty>
              {moduleGroups.map((group) => (
                <Command.Group
                  key={group.label}
                  heading={group.label}
                  className="px-1 text-xs text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5"
                >
                  {group.modules.map((module) => (
                    <Command.Item
                      key={module.key}
                      value={`${module.label} ${module.tagline}`}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground aria-selected:bg-accent"
                      onSelect={() => {
                        setCommandOpen(false);
                        router.push(module.path);
                      }}
                    >
                      <span
                        className="size-2 shrink-0 rounded-full"
                        style={{ backgroundColor: module.accent }}
                        aria-hidden="true"
                      />
                      <span className="flex-1">{module.label}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {module.tagline}
                      </span>
                    </Command.Item>
                  ))}
                </Command.Group>
              ))}
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
