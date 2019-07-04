import { NgModuleRef } from '@angular/core';

export interface Environment {
  production: boolean;
  ENV_PROVIDERS: any;
  showDevModule: boolean;
  defaultLanguage: string,
  supportedLanguages: string[];
  googleProviderKey: string;
  facebookProviderKey: string;
  decorateModuleRef(modRef: NgModuleRef<any>): NgModuleRef<any>;
}
