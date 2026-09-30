export interface Puzzle {
  id: string;
  label: string;
  moduli: [number, number, number];
  remainders: [number, number, number];
  solution: number;
  wheelRange: [number, number];
}

export const puzzles: Puzzle[] = [
  {
    id: "main-avenue",
    label: "Main Avenue Signals (3m, 5m, 7m)",
    moduli: [3, 5, 7],
    remainders: [2, 3, 2],
    solution: 23,
    wheelRange: [15, 30],
  },
  {
    id: "cross-town",
    label: "Cross-Town Corridor (3m, 5m, 7m)",
    moduli: [3, 5, 7],
    remainders: [1, 4, 6],
    solution: 34,
    wheelRange: [25, 45],
  },
  {
    id: "downtown-express",
    label: "Downtown Express (3m, 5m, 7m)",
    moduli: [3, 5, 7],
    remainders: [0, 0, 5],
    solution: 75,
    wheelRange: [65, 85],
  },
];

export const defaultPuzzle = puzzles[0];
