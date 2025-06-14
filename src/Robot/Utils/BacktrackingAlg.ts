import { BruteForceAlg } from './BruteForceAlg';

export class BacktrackingAlg extends BruteForceAlg {
  protected override generateFrom(seqNum: number): void {
    if (seqNum === this.board.getNodesLenght()) {
      // Caso base
      if (this.isValidPath()) {
        this.solution = new Set(this.currentPath);
      }
    } else if (this.applyBranchPruning()) {
      return;
      //
    } else {
      // Caso recursivo
      if (seqNum) this.recursionCounter++;
      const node = this.board.getNodeBySequenceNumber(seqNum);
      this.generatePath(node);
    }
  }

  // Podas
  // Poda 1: Si el tamaño del tablero es impar
  // Poda 2: A partir de la mitad del recorrido revisar si se hace imposible llegar a cero
  private applyBranchPruning(): boolean {
    return this.minPathIsOdd() || this.checkSumFromHalf();
  }

  private minPathIsOdd(): boolean {
    return this.minPathSize % 2 !== 0;
  }

  private isFromHalfPath(): boolean {
    return this.currentPath.size >= this.minPathSize / 2;
  }

  private checkSumFromHalf(): boolean {
    return this.isFromHalfPath() && !this.canReachSumZero();
  }

  private canReachSumZero(): boolean {
    const reach: number = this.minPathSize;
    const attempts: number = reach - this.currentPath.size;
    const sum: number = this.getPathSum();
    const absSum = Math.abs(sum);
    if (attempts < absSum) return false;
    return (attempts - absSum) % 2 === 0;
  }
}
