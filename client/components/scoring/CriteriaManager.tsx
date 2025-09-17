import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Criterion } from "@/types/scoring";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function CriteriaManager({
  criteria,
  onChange,
}: {
  criteria: Criterion[];
  onChange: (next: Criterion[]) => void;
}) {
  const totalWeight = useMemo(
    () => criteria.reduce((sum, c) => sum + (Number(c.weight) || 0), 0),
    [criteria],
  );

  const addCriterion = () => {
    const next = [
      ...criteria,
      { id: uid(), name: "Criterion", weight: 10, max: 10 },
    ];
    onChange(next);
  };

  const remove = (id: string) => {
    onChange(criteria.filter((c) => c.id !== id));
  };

  const update = (id: string, patch: Partial<Criterion>) => {
    onChange(criteria.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Criteria & Weights</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant={totalWeight === 100 ? "secondary" : "destructive"}>
            Total Weight: {totalWeight}%
          </Badge>
          <Button onClick={addCriterion} size="sm">Add Criterion</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="w-40">Weight %</TableHead>
              <TableHead className="w-40">Max Points</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {criteria.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <Input
                    value={c.name}
                    onChange={(e) => update(c.id, { name: e.target.value })}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={c.weight}
                    onChange={(e) =>
                      update(c.id, { weight: Number(e.target.value) })
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={c.max}
                    onChange={(e) => update(c.id, { max: Number(e.target.value) })}
                  />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" onClick={() => remove(c.id)}>Remove</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
