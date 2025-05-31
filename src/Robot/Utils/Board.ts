import { Coordinate } from './Coordinate';
import { Node } from './Node';
import { Tuple } from './Tuple';

/**
 * Clase del tablero
 */
export class Board {
  private readonly columns: number;
  private readonly rows: number;
  private readonly nodes: Array<Array<Node>>;
  private readonly nodesLenght: number;

  public constructor(columns: number, rows: number) {
    Board.validateColumnsAndRows(columns, rows);
    this.columns = columns;
    this.rows = rows;
    this.nodes = this.createNodes();
    this.nodesLenght = this.columns * this.rows;
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

  // public static fromJSON(data: string): Board {
  //   const content = JSON.parse(data);
  //   Board.validateUntypedObject(content);
  // }

  // private static validateUntypedObject(content: any): void {
  //   Board.validatePropAndType(content, 'columns', 'number');
  //   Board.validatePropAndType(content, 'columns', 'number');
  //   Board.validatePropAndType(content, 'rows', 'number');
  //   Board.validateColumnsAndRows(content['columns'], content['rows']);
  //   Board.validatePropAndType(content, 'nodes', 'array');
  //   // TODO:
  //   // for (const item of content['nodes']) {
  //   //   Board.validatePropAndType(item, 'nodes', 'array');
  //   // }
  // }

  private static validatePropAndType(
    object: { [key: string]: string | number | null },
    property: string,
    expectedType: 'number' | 'array' | 'string' | 'object',
  ): void {
    if (typeof object === 'undefined')
      throw new Error(`Validation failed: Object passed is undefined.`);

    if (typeof object !== 'object')
      throw new Error(`Validation failed: Object passed isn't an object.`);

    if (typeof object[property] === 'undefined')
      throw new Error(
        `Validation failed: Property ${property} in dynamic object is undefined.`,
      );

    const mainType = expectedType === 'array' ? 'object' : expectedType;
    if (typeof object[property] !== mainType)
      throw new Error(
        `Validation failed: Type of property ${property} in dynamic object isn't type ${expectedType}. Current type is ${typeof object[property]}.`,
      );

    if (expectedType === 'array' && !Array.isArray(object[property]))
      throw new Error(
        `Validation failed: Type of property ${property} in dynamic object isn't an array. Current type is object.`,
      );
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
