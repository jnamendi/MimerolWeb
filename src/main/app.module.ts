import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app/app.component';
import { ApiService, SiteSettingService } from './shared/services';
import { AppRouting } from './app.routing';
import { SharedModule } from './shared/share.module';
import { NgwWowModule } from 'ngx-wow';
import { JwtModule } from '@auth0/angular-jwt';
import { AccordionModule } from "primeng/components/accordion/accordion";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import "../styles/app.scss";
import { GoogleLoginProvider, FacebookLoginProvider, SocialLoginModule, AuthServiceConfig } from "angular4-social-login";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';
import { StorageKey } from './shared/services/storage-key/storage-key';

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(environment.googleProviderKey)
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(environment.facebookProviderKey)
  }
]);

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRouting,
    SharedModule,
    AccordionModule,
    BrowserAnimationsModule,
    JwtModule.forRoot({
      config: {
        throwNoTokenError: false,
        tokenGetter: GetToken,
      }
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),

    NgwWowModule.forRoot(),
    SocialLoginModule.initialize(config),
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    environment.ENV_PROVIDERS,
    ApiService,
    SiteSettingService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public appRef: ApplicationRef) { }
  hmrOnDestroy(store) {
    let cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // remove styles
    removeNgStyles();
  }

  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

export function GetToken() {
  return localStorage.getItem(StorageKey.Token);
}