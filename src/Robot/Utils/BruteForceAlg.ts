import { Board } from './Board';
import { ISolver } from './ISolver';
import { Node } from './Node';
import { SolverResult } from './SolverResult';

export class BruteForceAlg implements ISolver {
  protected readonly board: Board;

  protected currentPath: Set<Node> = new Set();

  protected solution: Set<Node> | null = null;

  protected firstNode: Node;
  protected lastNode: Node;
  protected minPathSize: number;

  protected timeElapsed: number = Infinity;

  protected recursionCounter: number = 0;

  constructor(board: Board) {
    this.board = board;
    this.validateBoard();
    this.minPathSize = this.board.getColumns() + this.board.getRows() - 1;
    this.firstNode = this.board.getNode(0, 0);
    this.lastNode = this.board.getNode(
      this.board.getColumns() - 1,
      this.board.getRows() - 1,
    );
    this.run();
  }

  protected validateBoard(): void {
    if (this.board.getColumns() < 1 || this.board.getRows() < 1)
      throw new Error('La matriz es vacía.');
  }

  protected run(): void {
    const start: number = performance.now();
    this.generateFrom(0);
    const end: number = performance.now();
    this.timeElapsed = end - start;
  }

  protected generateFrom(seqNum: number): void {
    if (seqNum === this.board.getNodesLenght()) {
      // Caso base
      if (this.isValidPath()) {
        this.solution = new Set(this.currentPath);
      }
    } else if (this.solution !== null) {
      // Caso recursivo
      if (seqNum) this.recursionCounter++;
      const node = this.board.getNodeBySequenceNumber(seqNum);
      this.generatePath(node);
    }
  }

  protected generatePath(node: Node) {
    this.currentPath.add(node);

    const bottomNodeOfPrev = this.board.getBottomNodeOf(node);
    if (bottomNodeOfPrev)
      this.generateFrom(this.board.getSequenceNumberOfNode(bottomNodeOfPrev));

    const rightNodeOfPrev = this.board.getRightNodeOf(node);
    if (rightNodeOfPrev)
      this.generateFrom(this.board.getSequenceNumberOfNode(rightNodeOfPrev));

    if (!rightNodeOfPrev && !bottomNodeOfPrev)
      this.generateFrom(this.board.getNodesLenght());

    this.currentPath.delete(node);
  }

  protected isValidPath(): boolean {
    return (
      this.pathIsMin() && this.pathIsSumZero() && this.pathHasValidSequence()
    );
  }

  protected pathIsMin(): boolean {
    return this.currentPath.size === this.minPathSize;
  }

  protected getPathSum(): number {
    let sum = 0;
    for (const node of this.currentPath) sum += node.getCharge();
    return sum;
  }

  protected pathIsSumZero(): boolean {
    return this.getPathSum() === 0;
  }

  protected pathHasValidSequence(): boolean {
    const nodes = Array.from(this.currentPath.values()).sort((a, b) =>
      a.getCoordinate().compareTo(b.getCoordinate()),
    );
    let previousNode: Node = nodes[0]!;
    if (previousNode !== this.firstNode) return false;
    for (let i = 1; i < nodes.length; i++) {
      const node = nodes[i];
      const rightNodeOfPrev = this.board.getRightNodeOf(previousNode);
      const bottomNodeOfPrev = this.board.getBottomNodeOf(previousNode);
      if (node === rightNodeOfPrev || node === bottomNodeOfPrev) {
        previousNode = node;
      } else return false;
    }
    return nodes[nodes.length - 1] === this.lastNode;
  }

  public getResult(): SolverResult {
    return new SolverResult(
      this.constructor.name,
      this.solution,
      this.timeElapsed,
      this.recursionCounter,
    );
  }
}
