import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ROBOT_CONTROLLER,
  RobotController,
} from '../Controllers/RobotController';
import { IObserver } from '../Utils/IObserver';

@Component({
  selector: 'robot-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  template: `
    <div>
      <div class="mb-3 col-12 col-md-6 mx-auto">
        <label class="form-label">Configurá el tamaño del tablero</label>
      </div>

      <div class="mb-2 col-12 col-md-6 mx-auto">
        <div class="row">
          <div class="col-4 col-md-3 text-start">
            <label class="form-label">Columnas</label>
          </div>
          <div class="col-6 col-md-7">
            <input
              type="range"
              class="form-range"
              [attr.min]="minColumns"
              [attr.max]="maxColumns"
              [(ngModel)]="columns"
            />
          </div>
          <div class="col-2 text-end">{{ columns }}</div>
        </div>
      </div>

      <div class="mb-2 col-12 col-md-6 mx-auto">
        <div class="row">
          <div class="col-4 col-md-3 text-start">
            <label class="form-label">Filas</label>
          </div>
          <div class="col-6 col-md-7">
            <input
              type="range"
              class="form-range"
              [attr.min]="minRows"
              [attr.max]="maxRows"
              [(ngModel)]="rows"
            />
          </div>
          <div class="col-2 text-end">{{ rows }}</div>
        </div>
      </div>

      <div class="col-12 col-md-6 mx-auto"></div>

      <div class="col-12 col-md-6 mx-auto">
        <hr />
        <div class="d-flex justify-content-between">
          <button class="btn btn-secondary" (click)="goToMenuScreen()">
            Atrás
          </button>
          <button class="btn btn-primary" (click)="runTestBed()">
            Comenzar
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      input {
        text-align: center;
      }
    `,
  ],
})
export class SettingsView implements IObserver, OnInit, OnDestroy {
  private readonly robotController: RobotController;
  private readonly cdRef: ChangeDetectorRef;

  public rows: number;
  public columns: number;

  public minRows: number;
  public maxRows: number;
  public minColumns: number;
  public maxColumns: number;

  public constructor(
    @Inject(ROBOT_CONTROLLER) robotController: RobotController,
    cdRef: ChangeDetectorRef,
  ) {
    this.cdRef = cdRef;
    this.robotController = robotController;
    this.rows = 0;
    this.columns = 0;
    this.minRows = 0;
    this.maxRows = 0;
    this.minColumns = 0;
    this.maxColumns = 0;
  }

  public goToMenuScreen(): void {
    this.robotController.goToMenuScreen();
  }

  public ngOnInit(): void {
    this.robotController.addObserver(this);
    this.notify();
  }

  public ngOnDestroy(): void {
    this.robotController.removeObserver(this);
  }

  public runTestBed(): void {
    this.debug(`Ejecutar ${this.columns} x ${this.rows}`);
    this.robotController.runNewTestBed(this.columns, this.rows);
  }

  public notify(): void {
    this.minRows = this.robotController.getMinRows();
    this.maxRows = this.robotController.getMaxRows();
    this.minColumns = this.robotController.getMinColumns();
    this.maxColumns = this.robotController.getMaxColumns();
    this.rows = this.minRows;
    this.columns = this.minColumns;
    this.cdRef.detectChanges();
    this.debug('Notified.');
  }

  private debug(...message: string[]): void {
    console.debug(`[${this.constructor.name}]`, ...message);
  }
}
