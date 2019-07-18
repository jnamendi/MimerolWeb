import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Language } from '../../../../models/langvm.model';
import { ClientState } from '../../../../state';
import { CategoryAdminModel, CategoryModule } from '../../../../models/category/admin-category.model';
import { CategoryAdminService } from '../../../../services/api/category/admin-category.service';
import { LanguageService } from '../../../../services/api/language/language.service';
import { ApiError } from '../../../../services/api-response/api-response';

@Component({
    selector: 'admin-category-creation',
    templateUrl: './category-creation.component.html'
})
export class AdminCategoryCreationComponent implements OnInit {
    private languageSupported: Language[] = [];
    private categoryAdminModel: CategoryAdminModel = new CategoryAdminModel();
    private message: string;
    private isError: boolean;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private clientState: ClientState,
        private languageService: LanguageService,
        private categoryAdminService: CategoryAdminService,
    ) {
    }

    ngOnInit(): void {
        this.onInitCategory();
    }

    onInitCategory = () => {
        this.languageService.getLanguagesFromService().subscribe(res => {
            this.languageSupported = res.content.data.map(lang => {
                return <Language>{ ...lang };
            });

            this.categoryAdminModel = <CategoryAdminModel>{
                categoryId: null,
                name: '',
                mediaId: null,
                sortOrder: null,
                status: 1,
                languageLst: this.languageSupported.map(lang => {
                    return CategoryModule.initTranslator(lang);
                })
            };
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
        });
    }

    onSubmit = (isValid: boolean) => {
        if (!isValid) {
            return;
        }
        this.clientState.isBusy = true;

        this.categoryAdminService.createCategory(this.categoryAdminModel).subscribe({
            complete: () => {
                this.clientState.isBusy = false;
                this.router.navigate(['admin/category']);
            },
            error: (err: ApiError) => {
                this.message = err.message;
                this.isError = true;
                this.clientState.isBusy = false;
            },
        });
    }
}
