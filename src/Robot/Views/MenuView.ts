import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  ROBOT_CONTROLLER,
  RobotController,
} from '../Controllers/RobotController';
import { board4x3 } from '../Utils/Boards/Board.4x3';
import { board5x10 } from '../Utils/Boards/Board.5x10';
import { board12x15 } from '../Utils/Boards/Board.12x15';
import { Board } from '../Utils/Board';

@Component({
  selector: 'robot-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  template: `
    <div class="card animate__animated animate__pulse">
      <div class="card-body">
        <h5 class="card-title mb-3">Optimización de la ruta de un robot</h5>
        <p class="card-text mb-4">
          Para comenzar las simulaciones elija una opción.
        </p>
        <div class="d-grid gap-2 col-12 col-md-6 mx-auto">
          @for (testBed of testBeds; track testBed.name) {
            <button
              class="btn btn-secondary btn-lg animate__animated animate__tada"
              (click)="runTestBed(testBed.testBed)"
            >
              {{ testBed.name }}
            </button>
          }

          <button
            class="btn btn-primary btn-lg animate__animated animate__tada"
            (click)="goToSettingsScreen()"
          >
            Crear banco de pruebas
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
    `,
  ],
})
export class MenuView {
  private readonly robotController: RobotController;

  public testBeds: Array<{ name: string; testBed: Board }> = [
    {
      name: 'Banco de pruebas - 4x3',
      testBed: board4x3,
    },
    {
      name: 'Banco de pruebas - 5x10',
      testBed: board5x10,
    },
    {
      name: 'Banco de pruebas - 12x15',
      testBed: board12x15,
    },
  ];

  public constructor(
    @Inject(ROBOT_CONTROLLER) robotController: RobotController,
  ) {
    this.robotController = robotController;
  }

  public goToSettingsScreen(): void {
    this.robotController.goToSettingsScreen();
  }

  public runTestBed(board: Board) {
    this.robotController.runNewTestBed(
      board.getColumns(),
      board.getRows(),
      board,
    );
  }
}
