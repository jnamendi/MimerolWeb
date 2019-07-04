import { NgModule } from '@angular/core';
import { AdminSharedModule } from './admin-share.module';
import { AdminComponent } from "./admin.component";
import { AdminRoutingModule } from './admin.routing';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AgmCoreModule } from '../../../../node_modules/@agm/core';
import { environment } from 'environments/environment';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    AdminSharedModule,
    TranslateModule.forChild({})
  ],
  declarations: [AdminComponent]
})
export class AdminAppModule { }
