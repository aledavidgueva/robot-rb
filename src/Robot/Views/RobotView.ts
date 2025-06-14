import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { IObserver } from '../Utils/IObserver';
import {
  ROBOT_CONTROLLER,
  RobotController,
} from '../Controllers/RobotController';
import { RobotScreen } from '../Models/RobotModel';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  template: `
    <div class="container">
      <div class="row">
        <div class="col text-center">
          <h3 class="fw-bold text-body-emphasis my-3">
            {{ appTitle }}
          </h3>

          <div class="card">
            <div class="card-body">
              @if (screenIsMenu()) {
                <robot-menu></robot-menu>
              }

              @if (screenIsSettings()) {
                <robot-settings></robot-settings>
              }

              @if (screenIsRunning()) {
                <robot-test-bed></robot-test-bed>
              }
            </div>
          </div>
        </div>
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
export class RobotView implements IObserver, OnInit, OnDestroy {
  private readonly robotController: RobotController;
  private readonly cdRef: ChangeDetectorRef;

  public appTitle: string;

  public currentScreen: RobotScreen;

  constructor(
    @Inject(ROBOT_CONTROLLER)
    robotController: RobotController,
    cdRef: ChangeDetectorRef,
    titleService: Title,
  ) {
    this.robotController = robotController;
    this.cdRef = cdRef;
    this.currentScreen = RobotScreen.MENU;
    this.appTitle = this.robotController.getAppTitle();
    titleService.setTitle(this.appTitle);
  }

  public ngOnInit(): void {
    this.robotController.addObserver(this);
  }

  public ngOnDestroy(): void {
    this.robotController.removeObserver(this);
  }

  public screenIsMenu(): boolean {
    return this.screenIs(RobotScreen.MENU);
  }

  public screenIsSettings(): boolean {
    return this.screenIs(RobotScreen.SETTINGS);
  }

  public screenIsRunning(): boolean {
    return this.screenIs(RobotScreen.RUNNING);
  }

  public screenIs(screen: RobotScreen): boolean {
    return this.currentScreen.localeCompare(screen) === 0;
  }

  public notify(): void {
    const currentScreen: RobotScreen = this.robotController.getCurrentScreen();
    if (this.currentScreen.localeCompare(currentScreen) !== 0) {
      this.currentScreen = currentScreen;
      this.cdRef.detectChanges();
      this.debug('Notified.');
    }
  }

  private debug(...message: string[]): void {
    console.debug(`[${this.constructor.name}]`, ...message);
  }
}
