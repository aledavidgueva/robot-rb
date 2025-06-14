import { SolverResult } from './SolverResult';

export interface ISolver {
  getResult(): SolverResult;
}
