import { Injectable } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { includes } from 'lodash';
import { Logger } from './logger.service';
import * as enUS from '../../../translations/en-US.json';
import * as esES from '../../../translations/es-ES.json';
import { ApiError } from '../services/api-response/api-response';

const log = new Logger('I18nService');
const languageKey = 'language';

/**
 * Pass-through function to mark a string for translation extraction.
 * Running `npm translations:extract` will include the given string by using this.
 * @param {string} s The string to extract for translation.
 * @return {string} The same string.
 */
export function extract(s: string) {
  return s;
}

@Injectable()
export class I18nService {

  defaultLanguage: string;
  supportedLanguages: string[];

  constructor(
    private translateService: TranslateService,
  ) {
    // Embed languages to avoid extra HTTP requests
    translateService.setTranslation('en-US', enUS);
    translateService.setTranslation('es-ES', esES);
  }

  /**
   * Initializes i18n for the application.
   * Loads language from local storage if present, or sets default language.
   * @param {!string} defaultLanguage The default language to use.
   * @param {Array.<String>} supportedLanguages The list of supported languages.
   */
  init(defaultLanguage: string, supportedLanguages: string[]) {
    this.defaultLanguage = defaultLanguage;
    this.supportedLanguages = supportedLanguages;
    this.language = '';

    this.translateService.onLangChange
      .subscribe((event: LangChangeEvent) => { localStorage.setItem(languageKey, event.lang); });
  }

  /**
   * Sets the current language.
   * Note: The current language is saved to the local storage.
   * If no parameter is specified, the language is loaded from local storage (if present).
   * @param {string} language The IETF language code to set.
   */
  set language(language: string) {
    language = language || localStorage.getItem(languageKey) || this.defaultLanguage || this.translateService.getBrowserCultureLang();
    let isSupportedLanguage = includes(this.supportedLanguages, language);

    // If no exact match is found, search without the region
    if (language && !isSupportedLanguage) {
      language = language.split('-')[0];
      language = this.supportedLanguages.find(supportedLanguage => supportedLanguage.startsWith(language)) || '';
      isSupportedLanguage = Boolean(language);
    }

    // Fallback if language is not supported
    if (!isSupportedLanguage) {
      language = this.defaultLanguage;
    }

    log.debug(`Language set to ${language}`);
    this.translateService.use(language);
  }

  /**
   * Gets the current language.
   * @return {string} The current language code.
   */
  get language(): string {
    // console.log(this.translateService.currentLang)
    return this.translateService.currentLang;
  }

  getTransError = (error: ApiError) => {
    if (!error) {
      return;
    }
    let key = 'Commons.HttpStatus.' + error.status;
    let translated = this.translateService.instant(key);
    if (translated == key) {
      return this.translateService.instant('Commons.HttpStatus.Default');
    } else {
      return translated;
    }
  }

  getTransByKey = (key: string) => {
    let translated = this.translateService.instant(key);
    if (translated == key) {
      return this.translateService.instant('Commons.Texts.Unknown');
    } else {
      return translated;
    }
  }

  getTransEnum = (enumName: string) => {
    let key = 'Commons.Enums.' + enumName;
    let translated = this.translateService.instant(key);
    if (translated == key) {
      return this.translateService.instant('Commons.Texts.Unknown');
    } else {
      return translated;
    }
  }

  getCurrentLanguageCode = (): string => {
    return this.language.split('-')[0].toLocaleLowerCase();
  }
}
