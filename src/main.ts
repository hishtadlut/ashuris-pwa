/// <reference path="global.d.ts" />
import 'node_modules/vconsole/dist/vconsole.min.js';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import 'hammerjs';
import VConsole from 'vconsole';

if (environment.production) {
  enableProdMode();
}


const vConsole = new VConsole();
console.log('version 0.1.16');


document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
});
