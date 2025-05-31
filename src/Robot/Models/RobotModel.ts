import { InjectionToken } from '@angular/core';
import { Config } from '../Utils/Config';
import { IObservable } from '../Utils/IObservable';
import { IObserver } from '../Utils/IObserver';
import { TestBed } from '../Utils/TestBed';
import { Board } from '../Utils/Board';
import { Node } from '../Utils/Node';
import { BruteForceAlg } from '../Utils/BruteForceAlg';
import { BacktrackingAlg } from '../Utils/BacktrackingAlg';

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
  }

  public runNewTestBed(columns: number, rows: number): void {
    if (this.testBed !== null)
      throw new RobotModelRuntimeException(
        'Ya hay un banco de pruebas en ejecución.',
      );

    const board = new Board(columns, rows);
    const testBed = new TestBed(board);
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
    if (!node)
      throw new RobotModelRuntimeException(
        'Las coordenadas no apuntan a ninguna casilla válida.',
      );

    return node;
  }

  public resolveWithBruteForce(): void {
    if (!this.testBed)
      throw new RobotModelRuntimeException('No hay banco de prueba en curso.');

    const resolver = new BruteForceAlg(this.testBed);
    const solution = resolver.getSolution();
    console.log('Solution:', solution);
    if (solution) {
      for (const node of solution.values()) {
        node.select();
      }
    }

    this.notifyObservers();
  }

  public resolveWithBacktracking(): void {
    if (!this.testBed)
      throw new RobotModelRuntimeException('No hay banco de prueba en curso.');

    const resolver = new BacktrackingAlg(this.testBed);
    const solution = resolver.getSolution();
    console.log('Solution:', solution);
    if (solution) {
      for (const node of solution.values()) {
        node.select();
      }
    }

    this.notifyObservers();
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
