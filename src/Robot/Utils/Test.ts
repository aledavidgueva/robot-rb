import { Tuple } from './Tuple';
import { Config } from './Config';
import { Board } from './Board';
import { Node } from './Node';

export function getValidRandomColRow(): Tuple<number, number> {
  const columns = Math.floor(
    Math.random() * (Config.maxColumns - Config.minColumns + 1) +
      Config.minColumns,
  );
  const rows = Math.floor(
    Math.random() * (Config.maxRows - Config.minRows + 1) + Config.minRows,
  );

  return [columns, rows];
}

export const TestNodes: Array<Array<Node>> = [
  [new Node(0, 0, 1, true), new Node(0, 1, -1), new Node(0, 2, 1)],
  [new Node(1, 0, -1, true), new Node(1, 1, 1), new Node(1, 2, 1)],
  [new Node(2, 0, -1, true), new Node(2, 1, 1, true), new Node(2, 2, 1, true)],
  [new Node(3, 0, -1), new Node(3, 1, -1), new Node(3, 2, -1, true)],
];

export const TestSolution: Set<Node> = new Set(
  TestNodes.flat().filter((node) => node.isSelected()),
);

export const TestBedBoard: Board = new Board(4, 3, TestNodes);
