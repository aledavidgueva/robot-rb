import { Board } from './Board';
import { ISolver } from './ISolver';
import { SolverResult } from './SolverResult';

export class TestBed {
  private readonly board: Board;

  private readonly log: Array<SolverResult> = new Array();

  public constructor(board: Board) {
    this.board = board;
  }

  run(solver: (board: Board) => ISolver): SolverResult {
    const solverObj: ISolver = solver(this.board);
    const solution: SolverResult = solverObj.getResult();
    this.log.push(solution);
    return solution;
  }

  getBoard(): Board {
    return this.board;
  }

  getLog(): Array<SolverResult> {
    return this.log;
  }

  toString(): string {
    return `Board: ${this.board.toString()}`;
  }
}
