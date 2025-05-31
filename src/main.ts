import { RobotModule } from './Robot/RobotModule';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

platformBrowserDynamic()
  .bootstrapModule(RobotModule)
  .catch((err) => console.error(err));





