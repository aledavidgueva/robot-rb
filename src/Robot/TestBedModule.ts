import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxRepeatDirective } from 'ngx-repeat';
import { TestBedView } from './Views/TestBedView';
import { BoardView } from './Views/BoardView';
import { SquareView } from './Views/SquareView';
import { ROBOT_CONTROLLER, RobotController } from './Controllers/RobotController';

@NgModule({
  declarations: [TestBedView, BoardView, SquareView],
  imports: [CommonModule, NgxRepeatDirective],
  providers: [
    {
      provide: ROBOT_CONTROLLER,
      useExisting: RobotController,
    },
  ],
  exports: [TestBedView],
})
export class TestBedModule {}