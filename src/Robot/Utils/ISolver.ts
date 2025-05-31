import { TestBed } from './TestBed';
import { Node } from './Node';

export interface ISolver {
  getSolution(): Set<Node> | null;
  getTimeElapsed(): number;
  getPathCounter(): number;
}
