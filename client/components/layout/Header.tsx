import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DesignSettingsTrigger } from "@/components/design/DesignSettings";

export function Header() {
  return (
    <header className={cn("sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur")}>
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="group inline-flex items-center gap-3">
          <div className="relative h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-cyan-500 shadow ring-1 ring-primary/30">
            <span className="absolute inset-0 flex items-center justify-center text-white text-lg">🤖</span>
          </div>
          <div className="leading-tight">
            <div className="text-xl font-extrabold tracking-tight">Aissaoui Robotics</div>
            <div className="text-xs text-muted-foreground">Scoring & Leaderboard</div>
          </div>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <a href="/" className="px-2 text-foreground/80 hover:text-foreground transition-colors">Home</a>
          <DesignSettingsTrigger />
        </nav>
      </div>
    </header>
  );
}
