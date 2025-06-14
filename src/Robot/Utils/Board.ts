import { Coordinate } from './Coordinate';
import { Node } from './Node';

/**
 * Clase del tablero
 */
export class Board {
  private readonly columns: number;
  private readonly rows: number;
  private readonly nodes: Array<Array<Node>>;
  private readonly nodesLenght: number;

  public constructor(
    columns: number,
    rows: number,
    nodes: Array<Array<Node>> | null = null,
  ) {
    Board.validateColumnsAndRows(columns, rows);
    this.columns = columns;
    this.rows = rows;
    this.nodesLenght = this.columns * this.rows;
    if (nodes) {
      this.validateNodes(nodes);
      this.nodes = nodes;
    } else {
      this.nodes = this.createNodes();
    }
  }

  private static validateColumnsAndRows(columns: number, rows: number): void {
    if (
      !Number.isInteger(columns) ||
      !Number.isInteger(rows) ||
      columns < 0 ||
      rows < 0
    )
      throw new BoardException(`Filas o columnas no válidas.`);
  }

  private validateNodes(nodes: Array<Array<Node>>) {
    for (let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
      const nodesColumn = nodes[columnIndex];
      if (!nodesColumn || !Array.isArray(nodesColumn)) {
        throw new Error(
          `Error de validación de nodos: no existe columna ${columnIndex}`,
        );
      }
      for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
        const node = nodesColumn[rowIndex];
        if (!node) {
          throw new Error(
            `Error de validación de nodos: no existe nodo fila ${rowIndex} col ${columnIndex}`,
          );
        }
        const coordinate = node.getCoordinate();
        if (
          coordinate.getRow() !== rowIndex ||
          coordinate.getColumn() !== columnIndex
        ) {
          throw new Error(
            `Error de validación de nodos: nodo con posición inválida.`,
          );
        }
        node.reset();
      }
    }
  }

  private createNodes(): Array<Array<Node>> {
    const nodes: Array<Array<Node>> = new Array();
    for (let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
      const column: Array<Node> = new Array();
      for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
        const node: Node = new Node(
          columnIndex,
          rowIndex,
          this.getRandomCharge(),
        );
        column.push(node);
      }
      nodes.push(column);
    }
    return nodes;
  }

  private getRandomCharge(): 1 | -1 {
    return Math.random() > 0.5 ? 1 : -1;
  }

  public getRows(): number {
    return this.rows;
  }

  public getColumns(): number {
    return this.columns;
  }

  public getNodes(): Array<Array<Node>> {
    return this.nodes;
  }

  public getNodesLenght(): number {
    return this.nodesLenght;
  }

  public getNode(column: number, row: number): Node {
    if (column < 0 || column >= this.columns || row < 0 || row >= this.rows)
      throw new BoardException('Se solicitó un nodo fuera de rango.');

    return this.nodes[column]![row]!;
  }

  public getRightNodeOf(node: Node): Node | null {
    const coordinate = node.getCoordinate();
    const nextColumn = coordinate.getColumn() + 1;
    const nextRow = coordinate.getRow();
    return nextColumn < this.columns && nextRow < this.rows
      ? this.getNode(nextColumn, nextRow)
      : null;
  }

  public getBottomNodeOf(node: Node): Node | null {
    const coordinate = node.getCoordinate();
    const nextColumn = coordinate.getColumn();
    const nextRow = coordinate.getRow() + 1;
    return nextColumn < this.columns && nextRow < this.rows
      ? this.getNode(nextColumn, nextRow)
      : null;
  }

  public getNodeBySequenceNumber(num: number): Node {
    if (num < 0 || num >= this.columns * this.rows)
      throw new BoardException('Se solicitó un nodo fuera de rango.');

    const row = Math.floor(num / this.columns);
    const column = num % this.columns;

    return this.getNode(column, row);
  }

  public getPositionBySequenceNumber(num: number): Coordinate {
    if (num < 0 || num >= this.columns * this.rows)
      throw new BoardException('Se solicitó un nodo fuera de rango.');

    const row = Math.floor(num / this.columns);
    const column = num % this.columns;
    return new Coordinate(column, row);
  }

  public getSequenceNumberOfNode(node: Node): number {
    const coordinate = node.getCoordinate();
    return this.getSequenceNumberByPosition(
      coordinate.getColumn(),
      coordinate.getRow(),
    );
  }

  public getSequenceNumberByPosition(column: number, row: number): number {
    if (column < 0 || column >= this.columns || row < 0 || row >= this.rows)
      throw new BoardException('Se solicitó una posición fuera de rango.');

    return row * this.columns + column;
  }

  public toString(): string {
    return `Tablero: ${this.rows}x${this.columns}`;
  }
}

export class BoardException extends Error {}
