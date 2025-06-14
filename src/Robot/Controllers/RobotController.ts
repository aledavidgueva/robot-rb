import { InjectionToken } from '@angular/core';
import { RobotModel, RobotScreen } from '../Models/RobotModel';
import { IObservable } from '../Utils/IObservable';
import { IObserver } from '../Utils/IObserver';
import { Tuple } from '../Utils/Tuple';
import { SolverResult } from '../Utils/SolverResult';
import { Board } from '../Utils/Board';

export const ROBOT_CONTROLLER = new InjectionToken<RobotController>(
  'RobotController',
);

export class RobotController implements IObservable {
  private robotModel: RobotModel;

  public constructor(robotModel: RobotModel) {
    this.robotModel = robotModel;
  }

  public addObserver(observer: IObserver): void {
    this.robotModel.addObserver(observer);
  }

  public removeObserver(observer: IObserver): void {
    this.robotModel.removeObserver(observer);
  }

  public getAppTitle(): string {
    return this.robotModel.getConfig().name;
  }

  public getMinRows(): number {
    return this.robotModel.getConfig().getMinRows();
  }

  public getMaxRows(): number {
    return this.robotModel.getConfig().getMaxRows();
  }

  public getMinColumns(): number {
    return this.robotModel.getConfig().getMinColumns();
  }

  public getMaxColumns(): number {
    return this.robotModel.getConfig().getMaxColumns();
  }

  public getCurrentScreen(): RobotScreen {
    return this.robotModel.getCurrentScreen();
  }

  public runNewTestBed(
    inputColumns: number,
    inputRows: number,
    board: Board | null = null,
  ): void {
    this.robotModel.runNewTestBed(inputColumns, inputRows, board);
  }

  public getBoardColumns(): number {
    return this.robotModel.isRunningTestBed()
      ? this.robotModel.getTestBed().getBoard().getColumns()
      : 0;
  }

  public getBoardRows(): number {
    return this.robotModel.isRunningTestBed()
      ? this.robotModel.getTestBed().getBoard().getRows()
      : 0;
  }

  public getSquareTraits(column: number, row: number): Tuple<string, boolean> {
    const square = this.robotModel.getNode(column, row);
    return [square.getCharge().toString(), square.isSelected()];
  }

  public isRunningTestBed(): boolean {
    return this.robotModel.isRunningTestBed();
  }

  public goToMenuScreen(): void {
    this.robotModel.goToMenuScreen();
  }

  public goToSettingsScreen(): void {
    this.robotModel.goToSettingsScreen();
  }

  public resolveWithBruteForce(): void {
    this.robotModel.resolveWithBruteForce();
  }

  public resolveWithBacktracking(): void {
    this.robotModel.resolveWithBacktracking();
  }

  public getCurrentSolverResult(): SolverResult | null {
    return this.robotModel.getCurrentSolverResult();
  }

  public getTestBedLog(): Array<SolverResult> {
    return this.robotModel.getTestBed().getLog();
  }
}

export class RobotControllerException extends Error {}
