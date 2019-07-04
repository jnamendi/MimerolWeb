import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { merge } from 'rxjs/observable/merge';
import { filter, map, mergeMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Logger, I18nService } from "../shared/core";
import { LanguageService, LanguageCode } from '../shared/services/api/language/language.service';

const log = new Logger('App');

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  language: LanguageCode;
  isToggleNav: boolean;
  isToggleSearch: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private i18nService: I18nService,
  ) {
  }

  ngOnInit(): void {
    // Setup logger
    if (environment.production) {
      Logger.enableProductionMode();
    }

    log.debug('init');

    // Setup translations
    this.i18nService.init(environment.defaultLanguage, environment.supportedLanguages);

    const onNavigationEnd = this.router.events.pipe(filter(event => event instanceof NavigationEnd));

    // Change page title on navigation or language change, based on route data
    merge(this.translateService.onLangChange, onNavigationEnd)
      .pipe(
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data)
      )
      .subscribe(event => {
        const title = event['title'];
        if (title) {
          this.titleService.setTitle(this.translateService.instant(title));
        }
      });
  }

  onToggleNav = (isToggle: boolean) => {
    this.isToggleNav = isToggle ? false : !this.isToggleNav;
  }

  onToggleSearch = () => {
    this.isToggleSearch = !this.isToggleSearch;
  }

  onInitLanguage = () => {
    if (!this.languageService.getCurrentLanguage()) {
      this.languageService.setLanguage(LanguageCode.EN)
    }
  }
}
