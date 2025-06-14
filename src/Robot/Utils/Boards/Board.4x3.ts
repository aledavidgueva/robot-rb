import { Board } from '../Board';
import { Node } from '../Node';

const nodes: Array<Array<Node>> = [
  [new Node(0, 0, 1), new Node(0, 1, -1), new Node(0, 2, 1)],
  [new Node(1, 0, -1), new Node(1, 1, 1), new Node(1, 2, 1)],
  [new Node(2, 0, -1), new Node(2, 1, 1), new Node(2, 2, 1)],
  [new Node(3, 0, -1), new Node(3, 1, -1), new Node(3, 2, -1)],
];

export const board4x3: Board = new Board(4, 3, nodes);
