import { ISolver } from './ISolver';
import { Node } from './Node';

// TODO

export class GeneticAlg implements ISolver {
  getSolution(): Set<Node> | null {
    throw new Error('Method not implemented.');
  }
  getTimeElapsed(): number {
    throw new Error('Method not implemented.');
  }
  getPathCounter(): number {
    throw new Error('Method not implemented.');
  }
}
