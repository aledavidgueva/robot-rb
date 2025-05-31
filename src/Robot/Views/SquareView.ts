import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ROBOT_CONTROLLER,
  RobotController,
} from '../Controllers/RobotController';
import { IObserver } from '../Utils/IObserver';

@Component({
  selector: 'robot-board-square',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  template: `
    @if (column !== null && row !== null) {
      <div [class.selected]="isSelected">
        {{ text }}
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }

      div {
        position: relative;
        width: 100%;
        height: 100%;
        aspect-ratio: 1;
        background-color: white;
        transition: all ease-out 0.1s;
        color: black;
        font-weight: bold;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        &.selected {
          background-color: orange;
        }
      }
    `,
  ],
})
export class SquareView implements IObserver, OnInit, OnDestroy {
  private readonly robotController: RobotController;
  private readonly cdRef: ChangeDetectorRef;

  public isSelected: boolean;

  public text: string;

  @Input()
  public column: number | null;

  @Input()
  public row: number | null;

  public constructor(
    @Inject(ROBOT_CONTROLLER)
    robotController: RobotController,
    cdRef: ChangeDetectorRef,
  ) {
    this.cdRef = cdRef;
    this.robotController = robotController;
    this.column = null;
    this.row = null;
    this.isSelected = false;
    this.text = '';
  }

  public ngOnInit(): void {
    this.robotController.addObserver(this);
  }

  public ngOnDestroy(): void {
    this.robotController.removeObserver(this);
  }

  public notify(): void {
    if (!this.robotController.isRunningTestBed()) return;
    if (this.column === null || this.row === null) return;
    const squareTraits = this.robotController.getSquareTraits(
      this.column,
      this.row,
    );
    this.text = squareTraits[0];
    this.isSelected = squareTraits[1];
    this.cdRef.detectChanges();
    this.debug('Notified.');
  }

  private debug(...message: string[]): void {
    console.debug(
      `[${this.constructor.name}]`,
      `[C${this.column}F${this.row}]`,
      ...message,
    );
  }
}
