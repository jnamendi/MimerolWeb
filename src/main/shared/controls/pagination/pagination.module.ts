import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders, Injectable } from '@angular/core';
import { PaginationConfig } from './pagination.config';

import { PaginationComponent } from './pagination.component';

@NgModule({
    imports: [CommonModule],
    declarations: [PaginationComponent],
    exports: [PaginationComponent],
    providers: [PaginationConfig],
    entryComponents: [PaginationComponent]
})

export class PaginationModule {
    public static forRoot(): ModuleWithProviders {
        return { ngModule: PaginationModule, providers: [PaginationConfig] };
    }
}
