/**
 * Angular bootstrapping
 */
import { platformBrowser } from '@angular/platform-browser';
import { environment } from 'environments/environment';

/**
 * App Module
 * our top level module that holds all of our components.
 */
import { AppModuleNgFactory } from '../compiled/src/app/app.module.ngfactory';
/**
 * Bootstrap our Angular app with a top level NgModule.
 */
export function main(): Promise<any> {
  return platformBrowser()
    .bootstrapModuleFactory(AppModuleNgFactory)
    .then(environment.decorateModuleRef)
    .catch((err) => console.error(err));
}

switch (document.readyState) {
  case 'loading':
    document.addEventListener('DOMContentLoaded', _domReadyHandler, false);
    break;
  case 'interactive':
  case 'complete':
  default:
    main();
}

function _domReadyHandler() {
  document.removeEventListener('DOMContentLoaded', _domReadyHandler, false);
  main();
}
