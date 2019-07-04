import { NgModule } from '@angular/core';
import { SharedServices } from './share-services';
import { SharedComponents } from './share-components';
import { SharedDirectives } from './share-directives';
import { SharedPipes } from './share-pipes';
import { CoreModule } from './core/core.module';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'environments/environment';

@NgModule({
    declarations: [
        SharedComponents,
        SharedPipes,
    ],
    imports: [
        CoreModule,
        AgmCoreModule.forRoot({
            apiKey: environment.googleProviderKey
        }),
    ],
    exports: [
        SharedComponents,
        SharedPipes,
    ],
    providers: [
        SharedServices,
    ]
})
export class SharedModule { }
