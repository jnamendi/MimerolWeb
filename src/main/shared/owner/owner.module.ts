import { NgModule } from '@angular/core';
import { OwnerSharedModule } from './owner-share.module';
import { OwnerComponent } from './owner.component';
import { OwnerRoutingModule } from './owner.routing';

@NgModule({
  imports: [
    OwnerRoutingModule,
    OwnerSharedModule,
  ],
  declarations: [OwnerComponent]
})
export class OwnerAppModule { }
