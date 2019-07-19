/* tslint:disable */
import { enableProdMode, NgModuleRef } from '@angular/core';
import { disableDebugTools } from '@angular/platform-browser';
import { Environment } from './model';

enableProdMode();

// export const ENV_FIREBASE_CONFIG: any = FIREBASE_CONFIG;

export const environment: Environment = {
  production: true,
  showDevModule: false,
  defaultLanguage: 'es-ES',
  supportedLanguages: [
    'en-US',
    'es-ES'
  ],
  facebookProviderKey: '464417037685516',
  googleProviderKey: '981996347990-6jeg17tp3qcc5p2on8mhkr0voahiuf3f.apps.googleusercontent.com',
  /** Angular debug tools in the dev console
   * https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
   * @param modRef
   * @return {any}
   */
  decorateModuleRef(modRef: NgModuleRef<any>) {
    disableDebugTools();
    return modRef;
  },
  ENV_PROVIDERS: [

  ]
};
