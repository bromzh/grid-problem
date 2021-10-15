import { Pair, ZOGrid, ZORow } from './types';

export const emptyFunc = () => {
};
export const generateRow = (n: number): ZORow => Array.from({ length: n }, () => Math.round(Math.random())) as ZORow;
export const generateGrid = (n: number) => Array.from({ length: n }, () => generateRow(n));

export const calculateCellSize = (gridSize: number, cellsCount: number): number => Math.ceil(gridSize / cellsCount);


export const getBoundedCells = (grid: ZOGrid, x0: number, y0: number) => {
  const stack: Pair[] = [];
  const result: Pair[] = [];

  const checkCell = (p: Pair) => {
    const [xx, yy] = p;
    if (xx < 0 || yy < 0 || xx >= grid.length || yy >= grid.length) {
      return false;
    }
    if (result.find(([x, y]) => xx === x && yy === y)) {
      return false;
    }
    return grid[yy][xx] !== 0;

  };

  const tryToPushCell = (p: Pair) => {
    if (checkCell(p)) {
      stack.push(p);
    }
  };

  if (grid[y0][x0] === 1) {
    stack.push([x0, y0]);
    while (stack.length > 0) {
      const cur = stack.pop();
      if (cur) {
        const [x, y] = cur;
        result.push(cur);
        tryToPushCell([x - 1, y]); // leftCell
        tryToPushCell([x + 1, y]); // rightCell
        tryToPushCell([x, y - 1]); // topCell
        tryToPushCell([x, y + 1]); // botCell
      }
    }
  }
  return result;
};
