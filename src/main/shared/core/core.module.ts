import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProgressBarModule } from 'primeng/progressbar';
import { PaginationModule } from '../controls';
import { TabViewModule } from 'primeng/components/tabview/tabview';
import { RatingModule } from 'primeng/rating';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { GooglePlaceModule } from 'ng2-google-place-autocomplete';
import { TranslateModule } from '@ngx-translate/core';
import { MomentModule } from "angular2-moment";
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { SharedDirectives } from '../share-directives';
import { SharedControls } from '../share-controls';
import { SliderModule } from 'primeng/slider';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { StickyModule } from 'ng2-sticky-kit';
import { CoreService } from "./core.service";
import { DataTablesModule } from "angular-datatables";
import { NgSelectModule } from '@ng-select/ng-select';
import { MyDatePickerModule } from 'mydatepicker';

@NgModule({
    declarations: [
        SharedDirectives,
        SharedControls,
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        MomentModule,
        PaginationModule,
        ProgressBarModule,
        TabViewModule,
        RatingModule,
        AutoCompleteModule,
        GooglePlaceModule,
        TranslateModule,
        MultiSelectModule,
        CalendarModule,
        AmazingTimePickerModule,
        SliderModule,
        CheckboxModule,
        DropdownModule,
        StickyModule,
        DataTablesModule,
        NgSelectModule,
        MyDatePickerModule
    ],
    exports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        SharedDirectives,
        SharedControls,
        MomentModule,
        PaginationModule,
        ProgressBarModule,
        TabViewModule,
        RatingModule,
        AutoCompleteModule,
        GooglePlaceModule,
        TranslateModule,
        MultiSelectModule,
        CalendarModule,
        AmazingTimePickerModule,
        SliderModule,
        CheckboxModule,
        DropdownModule,
        StickyModule,
        DataTablesModule,
        NgSelectModule,
        MyDatePickerModule
    ],
    providers: [
        HttpModule,
        CoreService
    ]
})
export class CoreModule { }
