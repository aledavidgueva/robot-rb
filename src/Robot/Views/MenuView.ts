import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ROBOT_CONTROLLER, RobotController } from '../Controllers/RobotController';

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

  public constructor(@Inject(ROBOT_CONTROLLER) robotController: RobotController) {
    this.robotController = robotController;
  }

  public goToSettingsScreen(): void {
    this.robotController.goToSettingsScreen();
  }
}
