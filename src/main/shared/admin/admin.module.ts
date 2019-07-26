import { NgModule } from '@angular/core';
import { AdminSharedModule } from './admin-share.module';
import { AdminComponent } from "./admin.component";
import { AdminRoutingModule } from './admin.routing';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

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
