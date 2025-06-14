import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ROBOT_MODEL, RobotModel } from './Models/RobotModel';
import {
  ROBOT_CONTROLLER,
  RobotController,
} from './Controllers/RobotController';
import { config } from './config';
import { RobotView } from './Views/RobotView';
import { TestBedModule } from './TestBedModule';
import { MenuView } from './Views/MenuView';
import { SettingsView } from './Views/SettingsView';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEsExtra from '@angular/common/locales/extra/ar';
import { LOCALE_ID } from '@angular/core';

registerLocaleData(localeEs, 'es-AR', localeEsExtra);

@NgModule({
  declarations: [RobotView, MenuView, SettingsView],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TestBedModule,
  ],
  providers: [
    {
      provide: ROBOT_MODEL,
      useValue: new RobotModel(config),
    },
    {
      provide: ROBOT_CONTROLLER,
      useFactory: (robotModel: RobotModel) => {
        return new RobotController(robotModel);
      },
      deps: [ROBOT_MODEL],
    },
    { provide: LOCALE_ID, useValue: 'es-AR' },
  ],
  bootstrap: [RobotView],
})
export class RobotModule {}
