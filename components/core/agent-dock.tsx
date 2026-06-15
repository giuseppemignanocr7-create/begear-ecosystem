"use client";

import { Bot, ChevronDown, SendHorizontal } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { p1CoreMindAnswers } from "@/lib/begear/foundation-data";
import { getModuleByKey } from "@/lib/begear/modules";
import { cn } from "@/lib/utils";

const agentCapabilities = ["Match", "Screening", "Advisor", "Insight"] as const;
const coreMind = getModuleByKey("coremind");

export function AgentDock() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answerIndex, setAnswerIndex] = useState(0);
  const activeAnswer = p1CoreMindAnswers[answerIndex] ?? p1CoreMindAnswers[0];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAnswerIndex((currentIndex) => (currentIndex + 1) % p1CoreMindAnswers.length);
    setQuestion("");
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div className="w-[min(22rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-border bg-card shadow-pop">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div className="flex items-center gap-3">
              <div
                className="grid size-9 place-items-center rounded-xl text-white"
                style={{ backgroundColor: coreMind.accent }}
              >
                <Bot aria-hidden="true" className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">CoreMind</p>
                <p className="text-xs text-muted-foreground">Assistente AI BeGear</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              aria-label="Chiudi CoreMind"
            >
              <ChevronDown aria-hidden="true" />
            </Button>
          </div>
          <div className="space-y-4 p-4">
            <div
              className="rounded-xl border border-border p-3"
              style={{ backgroundColor: `${coreMind.accent}0f` }}
            >
              <p className="text-sm leading-5 text-foreground">{activeAnswer}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {agentCapabilities.map((capability) => (
                <Badge key={capability} variant="outline">
                  {capability}
                </Badge>
              ))}
            </div>
            <form className="flex gap-2" onSubmit={handleSubmit}>
              <Input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Chiedi a CoreMind…"
                aria-label="Domanda per CoreMind"
              />
              <Button type="submit" size="icon" aria-label="Invia domanda">
                <SendHorizontal aria-hidden="true" />
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          onClick={() => setIsOpen(true)}
          className={cn("h-12 gap-2 rounded-full pl-3 pr-4 text-white shadow-pop")}
          style={{ backgroundColor: coreMind.accent }}
          aria-label="Apri CoreMind"
        >
          <Bot aria-hidden="true" className="size-5" />
          <span className="font-medium">CoreMind</span>
        </Button>
      )}
    </div>
  );
}
