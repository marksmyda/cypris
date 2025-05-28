import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { Cypris } from './app/cypris.component';

bootstrapApplication(Cypris, appConfig).catch((err) =>
  console.error(err),
);
