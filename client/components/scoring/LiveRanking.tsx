import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Criterion, Team } from "@/types/scoring";
import { Trophy } from "lucide-react";

export function LiveRanking({
  criteria,
  teams,
}: {
  criteria: Criterion[];
  teams: Team[];
}) {
  const totals = teams.map((t) => ({
    id: t.id,
    name: t.name,
    score: criteria.reduce((sum, c) => sum + ((Number(t.scores[c.id] ?? 0) / c.max) * c.weight), 0),
  }));

  const top = totals.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)).slice(0, 3);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-cyan-500 text-white flex items-center justify-center">
            <Trophy className="h-4 w-4" />
          </div>
          <h3 className="font-semibold">Live Top 3</h3>
        </div>
        <div className="space-y-4">
          {top.length === 0 && (
            <p className="text-sm text-muted-foreground">No teams yet.</p>
          )}
          {top.map((t, idx) => (
            <div key={t.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{background: idx===0?"linear-gradient(135deg,#f59e0b,#fbbf24)": idx===1?"linear-gradient(135deg,#9ca3af,#d1d5db)":"linear-gradient(135deg,#b45309,#f59e0b)"}}>
                    {idx+1}
                  </span>
                  <span className="font-medium">{t.name}</span>
                </div>
                <span className="tabular-nums font-semibold">{t.score.toFixed(2)}%</span>
              </div>
              <Progress value={Math.max(0, Math.min(100, t.score))} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
