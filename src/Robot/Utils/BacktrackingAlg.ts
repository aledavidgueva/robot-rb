import { BruteForceAlg } from './BruteForceAlg';

export class BacktrackingAlg extends BruteForceAlg {
  /**
   * Para el backtracking
   * Si minPathSize no es par entonces no tiene solución.
   * hago otra clase?
   * en el caso de la recursion, evito las diagonales?
   * incluso, directamente podría intentar que el siguiente nodo a incluir sea solamente el que está a la derecha o abajo.
   * o tambien, que siempre incluya el primero dado que es condicion necesaria para la solucion, osea que el primero
   * no lo remueva de los conjuntos solucion
   * En fuerza bruta devuelvo solo el primero??? o solo hago eso en backtracking?
   * Lo que hice de nunca eliminar el anterior, sería correcto aca? Ej, el (0,0) no se quita nunca
   *
   */
  protected override generateFrom(seqNum: number): void {
    if (seqNum === 0 && this.minPathSize % 2 !== 0) return;

    const board = this.testBed.getBoard();
    if (seqNum === board.getNodesLenght()) {
      // Caso base
      this.pathCounter++;
      if (this.isValidPath()) {
        this.solution = new Set(this.currentPath);
        console.log('Nueva solución:', new Set(this.currentPath));
      }
    } else if (this.solution === null) {
      // Caso recursivo
      const node = this.board.getNodeBySequenceNumber(seqNum);
      this.currentPath.add(node);

      const bottomNodeOfPrev = this.board.getBottomNodeOf(node);
      if (bottomNodeOfPrev)
        this.generateFrom(this.board.getSequenceNumberOfNode(bottomNodeOfPrev));

      const rightNodeOfPrev = this.board.getRightNodeOf(node);
      if (rightNodeOfPrev)
        this.generateFrom(this.board.getSequenceNumberOfNode(rightNodeOfPrev));

      if (!rightNodeOfPrev && !bottomNodeOfPrev)
        this.generateFrom(board.getNodesLenght());

      this.currentPath.delete(node);
    }
  }
}
