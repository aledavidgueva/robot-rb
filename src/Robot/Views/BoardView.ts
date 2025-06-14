import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ROBOT_CONTROLLER,
  RobotController,
} from '../Controllers/RobotController';
import { IObserver } from '../Utils/IObserver';

export type ViewportOrientation = 'LANDSCAPE' | 'PORTRAIT';

@Component({
  selector: 'robot-board',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  template: `
    <div class="board">
      <div class="columns">
        <ng-container *ngxRepeat="columns; let column = index">
          <div class="rows">
            <ng-container *ngxRepeat="rows; let row = index">
              <robot-board-square
                class="square"
                [column]="column"
                [row]="row"
                [style.width]="
                  columns > rows
                    ? orientation === 'PORTRAIT'
                      ? 'calc(50vw / ' + columns + ')'
                      : 'calc(50vh / ' + columns + ')'
                    : orientation === 'LANDSCAPE'
                      ? 'calc(50vh / ' + rows + ')'
                      : 'calc(50vw / ' + rows + ')'
                "
              >
              </robot-board-square>
            </ng-container>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .board {
        width: auto;
        margin: 0 auto;
        padding: 10px;
      }

      .columns {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }

      .rows {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .square {
        aspect-ratio: 1;
        outline: 1px solid black;
        border: 1px solid black;
        box-sizing: border-box;
      }
    `,
  ],
})
export class BoardView implements IObserver, OnInit, OnDestroy {
  private readonly robotController: RobotController;
  private readonly cdRef: ChangeDetectorRef;

  public columns: number;
  public rows: number;

  public orientation: ViewportOrientation;

  public constructor(
    @Inject(ROBOT_CONTROLLER) robotController: RobotController,
    cdRef: ChangeDetectorRef,
  ) {
    this.cdRef = cdRef;
    this.robotController = robotController;
    this.columns = 0;
    this.rows = 0;

    this.orientation = this.getOrientation(window); // window es global en este contexto
  }

  public ngOnInit(): void {
    this.robotController.addObserver(this);
  }

  public ngOnDestroy(): void {
    this.robotController.removeObserver(this);
  }

  public notify(): void {
    this.columns = this.robotController.getBoardColumns();
    this.rows = this.robotController.getBoardRows();
    this.cdRef.detectChanges();
    this.debug('Notified.');
  }

  @HostListener('window:resize', ['$event'])
  protected onResize(event: Event): void {
    const orientation = this.getOrientation(event.target as Window);
    if (orientation !== this.orientation) {
      this.orientation = orientation;
      this.cdRef.detectChanges();
    }
  }

  private getOrientation(window: Window): ViewportOrientation {
    const orientation: ViewportOrientation =
      window.innerWidth < window.innerHeight ? 'PORTRAIT' : 'LANDSCAPE';
    return orientation;
  }

  private debug(...message: string[]): void {
    console.debug(`[${this.constructor.name}]`, ...message);
  }
}
