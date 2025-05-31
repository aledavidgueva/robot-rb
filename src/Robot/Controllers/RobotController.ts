import { InjectionToken } from '@angular/core';
import { RobotModel, RobotScreen } from '../Models/RobotModel';
import { IObservable } from '../Utils/IObservable';
import { IObserver } from '../Utils/IObserver';
import { TestBed } from '@angular/core/testing';
import { Tuple } from '../Utils/Tuple';

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
    return this.robotModel.getConfig().minRows;
  }

  public getMaxRows(): number {
    return this.robotModel.getConfig().maxRows;
  }

  public getMinColumns(): number {
    return this.robotModel.getConfig().minColumns;
  }

  public getMaxColumns(): number {
    return this.robotModel.getConfig().maxColumns;
  }

  public getCurrentScreen(): RobotScreen {
    return this.robotModel.getCurrentScreen();
  }

  public runNewTestBed(inputColumns: number, inputRows: number): void {
    const columns = inputColumns;
    const rows = inputRows;
    const config = this.robotModel.getConfig();

    if (
      columns < config.minColumns ||
      columns > config.maxColumns ||
      rows < config.minRows ||
      rows > config.maxRows
    )
      throw new RobotControllerException(
        'Los valores de configuración no son válidos',
      );

    this.robotModel.runNewTestBed(columns, rows);
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
}

export class RobotControllerException extends Error {}
