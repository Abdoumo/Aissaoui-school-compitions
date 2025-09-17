import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function WinnerBanner({
  name,
  score,
}: {
  name: string | null;
  score: number | null;
}) {
  if (!name || score === null) return null;

  return (
    <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-primary/10 via-cyan-400/10 to-transparent p-5">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-white">
          <Trophy className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Current Leader</div>
          <div className="text-lg font-semibold">
            {name} <span className="text-muted-foreground font-normal">with</span> {score.toFixed(2)}%
          </div>
        </div>
        <Badge className="ml-auto" variant="secondary">Live</Badge>
      </div>
    </div>
  );
}
