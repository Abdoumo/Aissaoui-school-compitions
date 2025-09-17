import { useEffect, useMemo, useState } from "react";
import { Palette, RotateCcw } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function hexToHslString(hex: string): string {
  let c = hex.replace('#','');
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const r = parseInt(c.slice(0,2),16)/255;
  const g = parseInt(c.slice(2,4),16)/255;
  const b = parseInt(c.slice(4,6),16)/255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `${Math.round(h*360)} ${Math.round(s*100)}% ${Math.round(l*100)}%`;
}

function idealForeground(lPercent: number): string {
  // simple threshold for readability
  return lPercent < 55 ? '0 0% 100%' : '222.2 47.4% 11.2%';
}

const FONT_OPTIONS = ["Outfit","Inter","Sora","Space Grotesk","Poppins","Rubik"] as const;

const PRESETS = [
  { name: "Aissaoui Blue", primary: "#5B5BD6", secondary: "#06B6D4", accent: "#22D3EE" },
  { name: "Emerald", primary: "#10B981", secondary: "#059669", accent: "#34D399" },
  { name: "Royal Purple", primary: "#7C3AED", secondary: "#4C1D95", accent: "#A78BFA" },
  { name: "Crimson", primary: "#EF4444", secondary: "#DC2626", accent: "#F97316" },
] as const;

type ThemeSettings = {
  mode: 'light' | 'dark' | 'system';
  primary: string; // hex
  secondary: string; // hex
  accent: string; // hex
  radiusPx: number; // px
  font: typeof FONT_OPTIONS[number];
};

const DEFAULTS: ThemeSettings = {
  mode: 'light',
  primary: '#5B5BD6',
  secondary: '#06B6D4',
  accent: '#22D3EE',
  radiusPx: 12,
  font: 'Outfit',
};

function ensureGoogleFont(family: string) {
  const id = 'dynamic-font';
  const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@400;600;700;800&display=swap`;
  let link = document.getElementById(id) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'stylesheet';
    link.id = id;
    document.head.appendChild(link);
  }
  if (link.href !== href) link.href = href;
}

function applyTheme(settings: ThemeSettings) {
  const root = document.documentElement;
  const set = (k: string, v: string) => root.style.setProperty(k, v);

  const primaryH = hexToHslString(settings.primary);
  const secondaryH = hexToHslString(settings.secondary);
  const accentH = hexToHslString(settings.accent);

  const lFrom = (hsl: string) => Number(hsl.split(' ')[2].replace('%',''));

  set('--primary', primaryH);
  set('--primary-foreground', idealForeground(lFrom(primaryH)));

  set('--secondary', secondaryH);
  set('--secondary-foreground', idealForeground(lFrom(secondaryH)));

  set('--accent', accentH);
  set('--accent-foreground', idealForeground(lFrom(accentH)));

  set('--ring', primaryH);
  set('--radius', `${(settings.radiusPx/16).toFixed(3)}rem`);
  set('--font-sans', `${settings.font}, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"`);

  ensureGoogleFont(settings.font);

  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const enableDark = settings.mode === 'dark' || (settings.mode === 'system' && prefersDark);
  root.classList.toggle('dark', enableDark);
}

export function DesignSettingsTrigger() {
  const storageKey = 'aissaoui-design-settings';
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<ThemeSettings>(DEFAULTS);

  // load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setSettings({ ...DEFAULTS, ...(JSON.parse(raw) as ThemeSettings) });
    } catch {}
  }, []);

  // apply
  useEffect(() => {
    applyTheme(settings);
    try { localStorage.setItem(storageKey, JSON.stringify(settings)); } catch {}
  }, [settings]);

  const reset = () => setSettings(DEFAULTS);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2"><Palette className="h-4 w-4"/>Design</Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Design Settings</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Theme Mode</label>
            <Select value={settings.mode} onValueChange={(v: any) => setSettings((s) => ({...s, mode: v}))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Color Preset</label>
            <Select onValueChange={(v) => {
              const p = PRESETS.find((x) => x.name === v)!;
              setSettings((s) => ({...s, primary: p.primary, secondary: p.secondary, accent: p.accent}));
            }}>
              <SelectTrigger><SelectValue placeholder="Choose a preset" /></SelectTrigger>
              <SelectContent>
                {PRESETS.map((p) => (
                  <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Primary</label>
              <Input type="color" value={settings.primary} onChange={(e) => setSettings((s) => ({...s, primary: e.target.value}))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Secondary</label>
              <Input type="color" value={settings.secondary} onChange={(e) => setSettings((s) => ({...s, secondary: e.target.value}))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Accent</label>
              <Input type="color" value={settings.accent} onChange={(e) => setSettings((s) => ({...s, accent: e.target.value}))} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Typography</label>
            <Select value={settings.font} onValueChange={(v: any) => setSettings((s) => ({...s, font: v}))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Corner Radius</label>
              <span className="text-xs text-muted-foreground tabular-nums">{settings.radiusPx}px</span>
            </div>
            <Slider value={[settings.radiusPx]} min={4} max={20} step={1} onValueChange={(v) => setSettings((s) => ({...s, radiusPx: v[0]}))} />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Reset to defaults</div>
            <Button variant="secondary" size="sm" onClick={reset}><RotateCcw className="h-4 w-4 mr-2"/>Reset</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
