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

@Component({
  selector: 'robot-test-bed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  template: `
    <div class="mb-3">
      <small>Banco de prueba</small>
    </div>

    <div class="d-flex flex-row justify-content-center mb-3">
      <button class="btn btn-warning" (click)="resolveWithBruteForce()">
        Resolver con Fuerza Bruta
      </button>
    </div>

    <div class="position-relative">
      <robot-board></robot-board>
    </div>

    <div class="mt-4 col-12 col-md-6 mx-auto">
      <div class="d-flex justify-content-around">
        <button
          class="btn btn-secondary"
          (click)="goToMenu()"
          [disabled]="!isPlaying()"
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

  public currentScreen: RobotScreen;

  public constructor(
    @Inject(ROBOT_CONTROLLER) robotController: RobotController,
    cdRef: ChangeDetectorRef,
  ) {
    this.cdRef = cdRef;
    this.robotController = robotController;
    this.currentScreen = RobotScreen.MENU;
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

  public isPlaying(): boolean {
    return this.currentScreen === RobotScreen.RUNNING;
  }

  public resolveWithBruteForce(): void {
    this.robotController.resolveWithBruteForce();
  }

  public notify(): void {
    if (!this.robotController.isRunningTestBed()) return;
    this.currentScreen = this.robotController.getCurrentScreen();
    this.cdRef.detectChanges();
    this.debug('Notified.');
  }

  private debug(...message: string[]): void {
    console.debug(`[${this.constructor.name}]`, ...message);
  }
}
