import { Board } from "./Board";
import { Coordinate } from "./Coordinate";

export class TestBed {
  private readonly board: Board;

  private readonly log: Array<Array<Coordinate>> = new Array();

  public constructor(board: Board) {
    this.board = board;
  }

  getBoard(): Board {
    return this.board;
  }

  getLog(): Array<Array<Coordinate>> {
    return this.log;
  }

  toString(): string {
    return `Board: ${this.board.toString()}`;
  }
}
