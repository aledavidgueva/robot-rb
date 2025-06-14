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
import { RobotScreen } from '../Models/RobotModel';
import { SolverResult } from '../Utils/SolverResult';

@Component({
  selector: 'robot-test-bed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  template: `
    <div class="mb-3">
      <small>Banco de prueba</small>
    </div>

    <div class="d-flex flex-row justify-content-center mb-3">
      <button
        class="btn btn-primary"
        (click)="resolveWithBruteForce()"
        [disabled]="isLoading"
      >
        Resolver con Fuerza Bruta
      </button>
      <button
        class="btn btn-primary ms-3"
        (click)="resolveWithBacktracking()"
        [disabled]="isLoading"
      >
        Resolver con Backtracking
      </button>
    </div>

    <div class="position-relative">
      <robot-board [style.opacity]="isLoading ? '0.5' : '1'"></robot-board>
    </div>

    <div class="mb-3 text-left">
      <small>Registros</small>

      @if (testBedLog.length) {
        <table class="table">
          <thead>
            <tr>
              <th>Alg.</th>
              <th>Recursiones</th>
              <th>Tiempo (ms.)</th>
            </tr>
          </thead>
          <tbody>
            @for (log of testBedLog; track log) {
              <tr>
                <td>{{ log.getName() }}</td>
                <td>{{ log.getRecursionCounter() }}</td>
                <td>{{ log.getTimeElapsed() | number: '1.2' }}</td>
              </tr>
            }
          </tbody>
        </table>
      } @else {
        <p>Aún no se intentó resolución.</p>
      }
    </div>

    <div class="mt-4 col-12 col-md-6 mx-auto">
      <div class="d-flex justify-content-around">
        <button
          class="btn btn-info"
          (click)="goToMenu()"
          [disabled]="isLoading"
        >
          Salir
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TestBedView implements IObserver, OnInit, OnDestroy {
  private readonly robotController: RobotController;

  private readonly cdRef: ChangeDetectorRef;

  public currentSolverResult: SolverResult | null = null;

  public testBedLog: Array<SolverResult> = new Array();

  public isLoading: boolean = false;

  public constructor(
    @Inject(ROBOT_CONTROLLER) robotController: RobotController,
    cdRef: ChangeDetectorRef,
  ) {
    this.cdRef = cdRef;
    this.robotController = robotController;
  }

  public ngOnInit(): void {
    this.robotController.addObserver(this);
  }

  public ngOnDestroy(): void {
    this.robotController.removeObserver(this);
  }

  public goToMenu(): void {
    this.robotController.goToMenuScreen();
  }

  public async resolveWithBruteForce(): Promise<void> {
    this.isLoading = true;
    this.cdRef.detectChanges();
    await this.sleep(1000);
    this.robotController.resolveWithBruteForce();
  }

  public async resolveWithBacktracking(): Promise<void> {
    this.isLoading = true;
    this.cdRef.detectChanges();
    await this.sleep(1000);
    this.robotController.resolveWithBacktracking();
  }

  public solverResultUpdated(currentSolverResult: SolverResult | null): void {
    this.currentSolverResult = currentSolverResult;
    if (currentSolverResult !== null) {
      if (!currentSolverResult.hasSolution()) {
        alert('No hay solución para este banco de pruebas.');
      }
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public notify(): void {
    if (!this.robotController.isRunningTestBed()) return;
    const currentSolverResult = this.robotController.getCurrentSolverResult();
    if (currentSolverResult !== this.currentSolverResult) {
      this.isLoading = false;
      this.solverResultUpdated(currentSolverResult);
    }
    this.testBedLog = this.robotController.getTestBedLog();

    this.cdRef.detectChanges();
    this.debug('Notified.');
  }

  private debug(...message: string[]): void {
    console.debug(`[${this.constructor.name}]`, ...message);
  }
}
