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
    id: "example",
    label: "The Original Lock",
    moduli: [3, 5, 7],
    remainders: [2, 3, 2],
    solution: 23,
    wheelRange: [19, 29],
  },
  {
    id: "challenge-1",
    moduli: [3, 5, 7],
    label: "Second Try",
    remainders: [1, 4, 6],
    solution: 34,
    wheelRange: [30, 40],
  },
  {
    id: "challenge-2",
    label: "The Long Way Round",
    moduli: [3, 5, 7],
    remainders: [0, 0, 5],
    solution: 75,
    wheelRange: [70, 80],
  },
];

export const defaultPuzzle = puzzles[0];
