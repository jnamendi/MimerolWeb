import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { OwnerSharedComponents } from './owner-share-components';
import { CoreModule } from '../core/core.module';

@NgModule({
    declarations: [
        OwnerSharedComponents
    ],
    imports: [
        CoreModule,
    ],
    exports: [
        CoreModule,
        OwnerSharedComponents,
    ],
    providers: [
    ]
})
export class OwnerSharedModule { }
