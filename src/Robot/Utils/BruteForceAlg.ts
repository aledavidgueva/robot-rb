import { Board } from './Board';
import { Node } from './Node';
import { TestBed } from './TestBed';

export class BruteForceAlg {
  private readonly testBed: TestBed;
  private readonly board: Board;

  private currentPath: Set<Node> = new Set();

  private solutions: Array<Set<Node>> = new Array();

  private firstNode: Node;
  private lastNode: Node;
  private minPathSize: number;

  private timeElapsed: number = Infinity;

  private pathCounter: number = 0;

  constructor(testBed: TestBed) {
    this.testBed = testBed;
    this.board = this.testBed.getBoard();
    this.validateBoard();
    this.minPathSize = this.board.getColumns() + this.board.getRows() - 1;
    this.firstNode = this.board.getNode(0, 0);
    this.lastNode = this.board.getNode(
      this.board.getColumns() - 1,
      this.board.getRows() - 1,
    );
    this.run();
  }

  private validateBoard(): void {
    const board = this.testBed.getBoard();
    if (board.getColumns() < 1 || board.getRows() < 1)
      throw new Error('La matriz es vacía.');
  }

  private run(): void {
    // performance es global
    const start: number = performance.now();
    this.generateFrom(0);
    const end: number = performance.now();
    this.timeElapsed = end - start;
    console.log('Time elapsed:', this.timeElapsed);
  }

  private generateFrom(seqNum: number) {
    const board = this.testBed.getBoard();
    if (seqNum === board.getNodesLenght()) {
      // Caso base
      this.pathCounter++;
      console.log('Caso base:', this.currentPath);
      if (this.isValidPath()) {
        // Solución encontrada
        this.solutions.push(new Set(this.currentPath));
        console.log('Solución encontrada:', this.currentPath);
      } else {
        console.log('RAYOS!');
      }
    } else {
      // Caso recursivo
      const node = board.getNodeBySequenceNumber(seqNum);
      this.currentPath.add(node);
      this.generateFrom(seqNum + 1);
      this.currentPath.delete(node);
      this.generateFrom(seqNum + 1);
    }
  }

  private isValidPath(): boolean {
    return (
      this.pathIsMin() &&
      this.pathIncludeFirstNode() &&
      this.pathIncludeLastNode() &&
      this.pathIsSumZero() &&
      this.pathHasValidSequence()
    );
  }

  private pathIsMin(): boolean {
    return this.currentPath.size === this.minPathSize;
  }

  private pathIncludeFirstNode(): boolean {
    return this.currentPath.has(this.firstNode);
  }

  private pathIncludeLastNode(): boolean {
    return this.currentPath.has(this.lastNode);
  }

  private pathIsSumZero(): boolean {
    let sum = 0;
    for (const node of this.currentPath) sum += node.getCharge();

    return sum === 0;
  }

  private pathHasValidSequence(): boolean {
    const nodes = Array.from(this.currentPath.values()).sort((a, b) =>
      a.getCoordinate().compareTo(b.getCoordinate()),
    );
    let previousNode: Node = nodes[0]!;
    for (let i = 1; i < nodes.length; i++) {
      const node = nodes[i];
      const rightNodeOfPrev = this.board.getRightNodeOf(previousNode);
      const bottomNodeOfPrev = this.board.getBottomNodeOf(previousNode);
      if (node !== rightNodeOfPrev && node !== bottomNodeOfPrev) return false;
    }
    return true;
  }

  public getSolutions(): Array<Set<Node>> {
    return this.solutions;
  }

  public getTimeElapsed(): number {
    return this.timeElapsed;
  }

  public getPathCounter(): number {
    return this.pathCounter;
  }
}
