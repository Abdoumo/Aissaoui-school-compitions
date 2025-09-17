export type Criterion = {
  id: string;
  name: string;
  weight: number; // percentage, should sum to 100 across criteria
  max: number; // maximum points for this criterion
};

export type Team = {
  id: string;
  name: string;
  scores: Record<string, number>; // key: criterionId
};

export type Project = {
  id: string;
  name: string;
  criteria: Criterion[];
  teams: Team[];
  createdAt: number;
};

export type AppState = {
  projects: Project[];
  selectedProjectId: string | null;
};
