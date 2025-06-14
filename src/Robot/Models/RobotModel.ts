import { InjectionToken } from '@angular/core';
import { Config } from '../Utils/Config';
import { IObservable } from '../Utils/IObservable';
import { IObserver } from '../Utils/IObserver';
import { TestBed } from '../Utils/TestBed';
import { Board } from '../Utils/Board';
import { Node } from '../Utils/Node';
import { BruteForceAlg } from '../Utils/BruteForceAlg';
import { BacktrackingAlg } from '../Utils/BacktrackingAlg';
import { SolverResult } from '../Utils/SolverResult';

export const ROBOT_MODEL = new InjectionToken<RobotModel>('RobotModel');

export enum RobotScreen {
  MENU = 'MENU',
  SETTINGS = 'SETTINGS',
  RUNNING = 'RUNNING',
}

export class RobotModel implements IObservable {
  private config: Config;

  private observers: Array<IObserver>;

  private testBed: TestBed | null;

  private currentScreen: RobotScreen;

  private currentSolverResult: SolverResult | null = null;

  constructor(config: Config) {
    this.observers = new Array<IObserver>();
    this.config = config;
    this.testBed = null;
    this.currentScreen = RobotScreen.MENU;
  }

  public getConfig(): Config {
    return this.config;
  }

  public getCurrentScreen() {
    return this.currentScreen;
  }

  public goToMenuScreen(): void {
    this.leaveTestBed();
    this.setCurrentScreen(RobotScreen.MENU);
  }

  public goToSettingsScreen(): void {
    this.leaveTestBed();
    this.setCurrentScreen(RobotScreen.SETTINGS);
  }

  private setCurrentScreen(screen: RobotScreen) {
    this.currentScreen = screen;
    this.notifyObservers();
  }

  /**
   * Abandonar partida en curso, si es que la hay
   */
  private leaveTestBed(): void {
    if (this.testBed) {
      this.testBed = null;
    }
    if (this.currentSolverResult) {
      this.currentSolverResult = null;
    }
    this.notifyObservers();
  }

  public runNewTestBed(
    columns: number,
    rows: number,
    board: Board | null = null,
  ): void {
    if (this.testBed !== null)
      throw new RobotModelRuntimeException(
        'Ya hay un banco de pruebas en ejecución.',
      );

    if (
      columns < this.config.getMinColumns() ||
      columns > this.config.getMaxColumns() ||
      rows < this.config.getMinRows() ||
      rows > this.config.getMaxRows()
    )
      throw new RobotModelRuntimeException('Fila o columna fuera de rango');

    const testBed = new TestBed(
      board === null ? new Board(columns, rows) : board,
    );
    this.debug('Ejecutando nuevo banco de pruebas', testBed.toString());
    this.testBed = testBed;
    this.currentScreen = RobotScreen.RUNNING;
    this.notifyObservers();
  }

  public isRunningTestBed(): boolean {
    return this.testBed !== null;
  }

  public getTestBed(): TestBed {
    if (!this.testBed)
      throw new RobotModelRuntimeException('No hay banco de prueba en curso.');

    return this.testBed;
  }

  public getNode(column: number, row: number): Node {
    const testbed: TestBed = this.getTestBed();
    const node = testbed.getBoard().getNode(column, row);
    return node;
  }

  public resolveWithBruteForce(): void {
    if (!this.testBed)
      throw new RobotModelRuntimeException('No hay banco de prueba en curso.');

    this.resetSolverResult();
    const solution: SolverResult = this.testBed.run(
      (board: Board) => new BruteForceAlg(board),
    );
    this.showSolverResult(solution);
  }

  public resolveWithBacktracking(): void {
    if (!this.testBed)
      throw new RobotModelRuntimeException('No hay banco de prueba en curso.');

    this.resetSolverResult();
    const solverResult: SolverResult = this.testBed.run(
      (board: Board) => new BacktrackingAlg(board),
    );
    this.showSolverResult(solverResult);
  }

  private resetSolverResult(): void {
    this.currentSolverResult = null;
    this.resetNodes();
    this.notifyObservers();
  }

  private showSolverResult(solverResult: SolverResult): void {
    this.currentSolverResult = solverResult;
    this.resetNodes();
    const solution = solverResult.getSolution();
    if (solution) for (const node of solution.values()) node.select();
    this.notifyObservers();
  }

  private resetNodes(): void {
    if (!this.testBed)
      throw new RobotModelRuntimeException('No hay banco de prueba en curso.');

    const board = this.testBed.getBoard();
    const total = board.getNodesLenght();
    for (let i = 0; i < total; i++) {
      const node = board.getNodeBySequenceNumber(i);
      node.reset();
    }
    this.notifyObservers();
  }

  public getCurrentSolverResult(): SolverResult | null {
    return this.currentSolverResult;
  }

  public addObserver(observer: IObserver): void {
    this.observers.push(observer);
    observer.notify();
    this.debug(`Observer ${observer.constructor.name} agregado.`);
  }

  public removeObserver(observer: IObserver): void {
    this.observers = this.observers.filter(
      (current: IObserver) => current !== observer,
    );
    this.debug(`Observer ${observer.constructor.name} removido.`);
  }

  private notifyObservers(): void {
    for (const observer of this.observers) {
      observer.notify();
      this.debug(`Observer ${observer.constructor.name} notificado.`);
    }
  }

  private debug(...message: string[]): void {
    console.debug(`[${this.constructor.name}]`, ...message);
  }
}

export class RobotModelException extends Error {}
export class RobotModelRuntimeException extends RobotModelException {}
