import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TimerReset, Timer, Pause } from "lucide-react";

function format(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s]
    .map((v) => v.toString().padStart(2, "0"))
    .join(":");
}

export function TimerCard({ projectId }: { projectId: string }) {
  const storageKey = `aissaoui-timer-${projectId}`;
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          running: boolean;
          elapsed: number;
          startAt: number | null;
        };
        setRunning(parsed.running);
        setElapsed(parsed.elapsed || 0);
        startRef.current = parsed.startAt;
      }
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    const id = running
      ? window.setInterval(() => {
          if (startRef.current != null) {
            setElapsed((prev) => Date.now() - startRef.current!);
          }
        }, 200)
      : null;
    return () => {
      if (id) window.clearInterval(id);
    };
  }, [running]);

  useEffect(() => {
    try {
      const data = {
        running,
        elapsed,
        startAt: startRef.current,
      };
      window.localStorage.setItem(storageKey, JSON.stringify(data));
    } catch {}
  }, [elapsed, running, storageKey]);

  const start = () => {
    if (running) return;
    const now = Date.now();
    startRef.current = now - elapsed;
    setRunning(true);
  };
  const pause = () => {
    if (!running) return;
    setRunning(false);
  };
  const reset = () => {
    setRunning(false);
    setElapsed(0);
    startRef.current = null;
  };

  const formatted = useMemo(() => format(elapsed), [elapsed]);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Event Timer</div>
            <div className="text-2xl font-semibold tabular-nums">{formatted}</div>
          </div>
          <div className="flex items-center gap-2">
            {!running ? (
              <Button onClick={start} size="sm"><Timer className="mr-2 h-4 w-4"/>Start</Button>
            ) : (
              <Button onClick={pause} size="sm" variant="secondary"><Pause className="mr-2 h-4 w-4"/>Pause</Button>
            )}
            <Button onClick={reset} size="sm" variant="ghost"><TimerReset className="mr-2 h-4 w-4"/>Reset</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
