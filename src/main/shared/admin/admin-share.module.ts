import { NgModule } from '@angular/core';
import { AdminSharedComponents } from "./admin-share-components";
import { CoreModule } from '../core/core.module';
import { AgmCoreModule } from '../../../../node_modules/@agm/core';
import { environment } from 'environments/environment';

@NgModule({
    declarations: [
        AdminSharedComponents,
    ],
    imports: [
        CoreModule,
        AgmCoreModule.forRoot({
            apiKey: environment.googleProviderKey,
        }),
    ],
    exports: [
        CoreModule,
        AdminSharedComponents,
    ],
    providers: [
    ]
})
export class AdminSharedModule { }
