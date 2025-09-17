import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Criterion, Team } from "@/types/scoring";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function TeamsTable({
  criteria,
  teams,
  onChange,
}: {
  criteria: Criterion[];
  teams: Team[];
  onChange: (next: Team[]) => void;
}) {
  const addTeam = () => {
    onChange([
      ...teams,
      { id: uid(), name: `Team ${teams.length + 1}` , scores: {} },
    ]);
  };

  const renameTeam = (id: string, name: string) => {
    onChange(teams.map((t) => (t.id === id ? { ...t, name } : t)));
  };

  const removeTeam = (id: string) => {
    onChange(teams.filter((t) => t.id !== id));
  };

  const setScore = (teamId: string, criterionId: string, value: number) => {
    onChange(
      teams.map((t) =>
        t.id === teamId
          ? {
              ...t,
              scores: { ...t.scores, [criterionId]: value },
            }
          : t,
      ),
    );
  };

  const totals = teams.map((t) => {
    const total = criteria.reduce((sum, c) => {
      const score = Number(t.scores[c.id] ?? 0);
      return sum + (score / c.max) * c.weight;
    }, 0);
    return { id: t.id, total };
  });

  const ranks = [...totals]
    .sort((a, b) => b.total - a.total || 0)
    .map((t, idx) => ({ id: t.id, rank: idx + 1 }));

  const getRank = (teamId: string) => ranks.find((r) => r.id === teamId)?.rank ?? 0;
  const getTotal = (teamId: string) => totals.find((r) => r.id === teamId)?.total ?? 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Teams & Scores</CardTitle>
        <Button onClick={addTeam} size="sm">Add Team</Button>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-40">Team</TableHead>
              {criteria.map((c) => (
                <TableHead key={c.id} className="text-center min-w-32">
                  {c.name} <span className="text-xs text-muted-foreground">/ {c.max}</span>
                </TableHead>
              ))}
              <TableHead className="text-right min-w-28">Total %</TableHead>
              <TableHead className="text-right min-w-20">Rank</TableHead>
              <TableHead className="min-w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((t) => (
              <TableRow key={t.id} className={getRank(t.id) === 1 ? "bg-primary/5" : undefined}>
                <TableCell>
                  <Input value={t.name} onChange={(e) => renameTeam(t.id, e.target.value)} />
                </TableCell>
                {criteria.map((c) => (
                  <TableCell key={c.id} className="text-center">
                    <Input
                      type="number"
                      min={0}
                      max={c.max}
                      value={t.scores[c.id] ?? 0}
                      onChange={(e) =>
                        setScore(t.id, c.id, clamp(Number(e.target.value), 0, c.max))
                      }
                    />
                  </TableCell>
                ))}
                <TableCell className="text-right font-semibold">
                  {getTotal(t.id).toFixed(2)}%
                </TableCell>
                <TableCell className="text-right font-semibold">
                  #{getRank(t.id)}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" onClick={() => removeTeam(t.id)}>Remove</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
