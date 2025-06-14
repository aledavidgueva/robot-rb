import { Node } from './Node';

export class SolverResult {
  constructor(
    private readonly name: string,
    private readonly path: Set<Node> | null,
    private readonly timeElapsed: number,
    private readonly recursionCounter: number,
  ) {}

  getName(): string {
    return this.name;
  }

  hasSolution(): boolean {
    return this.path !== null;
  }

  getSolution(): Set<Node> | null {
    return this.path;
  }

  getTimeElapsed(): number {
    return this.timeElapsed;
  }

  getRecursionCounter(): number {
    return this.recursionCounter;
  }
}
