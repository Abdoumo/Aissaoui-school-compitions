import { useEffect, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { AppState, Project } from "@/types/scoring";
import { CriteriaManager } from "@/components/scoring/CriteriaManager";
import { TeamsTable } from "@/components/scoring/TeamsTable";
import { ProjectSelector } from "@/components/scoring/ProjectSelector";
import { WinnerBanner } from "@/components/scoring/WinnerBanner";
import { TimerCard } from "@/components/scoring/TimerCard";
import { LiveRanking } from "@/components/scoring/LiveRanking";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const DEFAULT_PROJECT: Project = {
  id: "proj-" + uid(),
  name: "Aissaoui Robotics 2025",
  createdAt: Date.now(),
  criteria: [
    { id: uid(), name: "Impact", weight: 20, max: 10 },
    { id: uid(), name: "Creativity", weight: 20, max: 10 },
    { id: uid(), name: "Innovation", weight: 15, max: 10 },
    { id: uid(), name: "Technical", weight: 20, max: 10 },
    { id: uid(), name: "Teamwork", weight: 15, max: 10 },
    { id: uid(), name: "Presentation", weight: 10, max: 10 },
  ],
  teams: [
    { id: uid(), name: "Team Alpha", scores: {} },
    { id: uid(), name: "Team Beta", scores: {} },
  ],
};

export default function Index() {
  const [state, setState] = useLocalStorage<AppState>("aissaoui-scoring", {
    projects: [DEFAULT_PROJECT],
    selectedProjectId: DEFAULT_PROJECT.id,
  });

  const current = useMemo(
    () => state.projects.find((p) => p.id === state.selectedProjectId) || null,
    [state.projects, state.selectedProjectId],
  );

  useEffect(() => {
    if (!current && state.projects.length) {
      setState((s) => ({ ...s, selectedProjectId: s.projects[0].id }));
    }
  }, [current, setState, state.projects.length]);

  const setCurrent = (patch: Partial<Project>) => {
    if (!current) return;
    setState((s) => ({
      ...s,
      projects: s.projects.map((p) => (p.id === current.id ? { ...p, ...patch } : p)),
    }));
  };

  const computeWinner = () => {
    if (!current) return { name: null as string | null, score: null as number | null };
    const totals = current.teams.map((t) => ({
      name: t.name,
      score: current.criteria.reduce((sum, c) => sum + ((Number(t.scores[c.id] ?? 0) / c.max) * c.weight), 0),
    }));
    totals.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
    return totals[0] ? { name: totals[0].name, score: totals[0].score } : { name: null, score: null };
  };

  const winner = computeWinner();

  const exportCSV = () => {
    if (!current) return;
    const headers = ["Team", ...current.criteria.map((c) => c.name), "Total %", "Rank"];
    const rows = current.teams
      .map((t) => {
        const per = current.criteria.map((c) => String(t.scores[c.id] ?? 0));
        const total = current.criteria.reduce((sum, c) => sum + ((Number(t.scores[c.id] ?? 0) / c.max) * c.weight), 0);
        return { team: t.name, per, total };
      })
      .sort((a, b) => b.total - a.total || a.team.localeCompare(b.team))
      .map((row, idx) => [row.team, ...row.per, row.total.toFixed(2), String(idx + 1)]);

    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${current.name.replace(/\s+/g, "-").toLowerCase()}-scores.csv`;
    a.click();
  };

  const createProject = () => {
    const p: Project = {
      id: "proj-" + uid(),
      name: "New Robotics Event",
      createdAt: Date.now(),
      criteria: [
        { id: uid(), name: "Impact", weight: 20, max: 10 },
        { id: uid(), name: "Creativity", weight: 20, max: 10 },
        { id: uid(), name: "Innovation", weight: 15, max: 10 },
        { id: uid(), name: "Technical", weight: 20, max: 10 },
        { id: uid(), name: "Teamwork", weight: 15, max: 10 },
        { id: uid(), name: "Presentation", weight: 10, max: 10 },
      ],
      teams: [],
    };
    setState((s) => ({
      projects: [p, ...s.projects],
      selectedProjectId: p.id,
    }));
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.12),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(34,211,238,0.16),transparent_55%)]">
      <Header />

      <main className="container py-8">
        <section className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Aissaoui School Robotics Scoring
              </h1>
              <p className="text-muted-foreground mt-1">
                Score projects across criteria like Impact, Creativity, Innovation, Technical skill, and more. Get a live leaderboard and announce the winner.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={exportCSV}>Export CSV</Button>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <ProjectSelector
            projects={state.projects.map((p) => ({ id: p.id, name: p.name }))}
            selectedId={state.selectedProjectId}
            onSelect={(id) => setState((s) => ({ ...s, selectedProjectId: id }))}
            onCreate={createProject}
            onRename={(id, name) =>
              setState((s) => ({
                ...s,
                projects: s.projects.map((p) => (p.id === id ? { ...p, name } : p)),
              }))
            }
          />
        </section>

        {current && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <WinnerBanner name={winner.name} score={winner.score} />

              <CriteriaManager
                criteria={current.criteria}
                onChange={(next) => setCurrent({ criteria: next })}
              />

              <TeamsTable
                criteria={current.criteria}
                teams={current.teams}
                onChange={(next) => setCurrent({ teams: next })}
              />
            </div>
            <aside className="space-y-6">
              {current && (
                <>
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">Judging Progress</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Percentage of scoring fields filled by judges.
                      </p>
                      {(() => {
                        const totalCells = current.teams.length * current.criteria.length;
                        const filled = current.teams.reduce((acc, t) => acc + current.criteria.filter(c => Object.prototype.hasOwnProperty.call(t.scores, c.id)).length, 0);
                        const pct = totalCells === 0 ? 0 : Math.round((filled / totalCells) * 100);
                        return (
                          <div className="space-y-2">
                            <div className="h-4 w-full overflow-hidden rounded-full bg-secondary">
                              <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <div className="text-sm tabular-nums text-muted-foreground">{filled}/{totalCells} fields • {pct}%</div>
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                  <TimerCard projectId={current.id} />
                </>
              )}

              {current && (
                <LiveRanking criteria={current.criteria} teams={current.teams} />
              )}

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">How scoring works</h3>
                  <p className="text-sm text-muted-foreground">
                    Each criterion has a weight. Team totals are computed as the sum of (score / max) × weight, producing a final percentage out of 100. Adjust weights to match your event rubric.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Tips</h3>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Keep total weight at 100% for fair comparison.</li>
                    <li>Export CSV after judging for records.</li>
                    <li>Use clear team names to avoid confusion.</li>
                  </ul>
                </CardContent>
              </Card>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
