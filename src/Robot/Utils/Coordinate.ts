export class Coordinate {
  private column: number;
  private row: number;

  constructor(column: number, row: number) {
    this.column = column;
    this.row = row;
  }

  public getColumn() {
    return this.column;
  }

  public getRow() {
    return this.row;
  }

  public compareTo(coordinate: Coordinate): number {
    if (this.row < coordinate.getRow()) return -1;
    if (this.row > coordinate.getRow()) return 1;
    if (this.column < coordinate.getColumn()) return -1;
    if (this.column > coordinate.getColumn()) return 1;
    return 0;
  }

  public isEquals(coordinate: Coordinate): boolean {
    return (
      coordinate.getColumn() === this.getColumn() &&
      coordinate.getRow() === this.getRow()
    );
  }
}
