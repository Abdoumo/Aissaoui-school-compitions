import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ProjectSelector({
  projects,
  selectedId,
  onSelect,
  onCreate,
  onRename,
}: {
  projects: { id: string; name: string }[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onRename: (id: string, name: string) => void;
}) {
  const selected = projects.find((p) => p.id === selectedId) || null;

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
      <div className="w-full md:w-72">
        <Select value={selectedId ?? undefined} onValueChange={onSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selected && (
        <div className="flex w-full items-center gap-2">
          <Input
            value={selected.name}
            onChange={(e) => onRename(selected.id, e.target.value)}
          />
          <Button variant="secondary" onClick={onCreate}>New Project</Button>
        </div>
      )}
      {!selected && (
        <Button onClick={onCreate}>Create Project</Button>
      )}
    </div>
  );
}
