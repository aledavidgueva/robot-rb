import { Coordinate } from './Coordinate';

export class Node {
  private coordinate: Coordinate;

  private selected: boolean;

  private charge: 1 | -1;

  public constructor(
    column: number,
    row: number,
    charge: 1 | -1,
    selected: boolean = false,
  ) {
    if (!this.isValid(column, row))
      throw new NodeException(`Coordenadas no válidas.`);

    this.coordinate = new Coordinate(column, row);
    this.selected = selected;
    this.charge = charge;
  }

  private isValid(column: number, row: number): boolean {
    return (
      Number.isInteger(column) &&
      Number.isInteger(row) &&
      column >= 0 &&
      row >= 0
    );
  }

  reset(): void {
    this.selected = false;
  }

  select(): void {
    this.selected = true;
  }

  getCharge(): 1 | -1 {
    return this.charge;
  }

  getCoordinate(): Coordinate {
    return this.coordinate;
  }

  isSelected(): boolean {
    return this.selected;
  }

  toString(): string {
    return `Casilla [C${this.coordinate.getColumn()}F${this.coordinate.getRow()} - Selected: ${this.selected}]`;
  }
}

export class NodeException extends Error {}
