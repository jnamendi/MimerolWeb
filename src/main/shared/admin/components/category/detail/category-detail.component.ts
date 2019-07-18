import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientState } from '../../../../state';
import { Language } from '../../../../models/langvm.model';
import { ApiError } from '../../../../services/api-response/api-response';
import { CategoryAdminModel, CategoryModule } from '../../../../models/category/admin-category.model';
import { CategoryAdminService } from '../../../../services/api/category/admin-category.service';
import { LanguageService } from '../../../../services/api/language/language.service';

@Component({
    selector: 'admin-category-detail',
    templateUrl: './category-detail.component.html'
})
export class AdminCategoryDetailComponent implements OnInit, OnDestroy {
    private sub: any;
    private categoryId: number;
    private categoryAdminModel: CategoryAdminModel = new CategoryAdminModel();
    private message: string;
    private isError: boolean;
    private languageSupported: Language[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private clientState: ClientState,
        private categoryAdminService: CategoryAdminService,
        private languageService: LanguageService,
    ) {
        this.sub = this.route.params.subscribe(params => {
            this.categoryId = +params['id'];
            if (this.categoryId >= 0) {
                this.languageService.getLanguagesFromService().subscribe(res => {
                    this.languageSupported = res.content.data.map(lang => {
                        return <Language>{ ...lang };
                    });
                    this.onGetCategory(this.categoryId);
                }, (err: ApiError) => {
                    this.message = err.message;
                    this.isError = true;
                });
            }
        });
    }

    ngOnInit(): void {
    }

    onGetCategory = (categoryId: number) => {
        this.categoryAdminService.getCategory(categoryId).subscribe(res => {
            let categoryModelFromRes = <CategoryAdminModel>{ ...res.content };
            this.categoryAdminModel = {
                ...categoryModelFromRes,
                languageLst: categoryModelFromRes.languageLst || this.languageSupported.map(lang => {
                    return CategoryModule.initTranslator(lang);
                })
            };
        }, (err: ApiError) => {
            this.message = err.message;
            this.isError = true;
        })
    }

    onUpdateCategory = (isValid: boolean) => {
        if (!isValid) {
            return;
        }
        this.clientState.isBusy = true;
        this.categoryAdminService.updateCategory(this.categoryAdminModel).subscribe({
            complete: () => {
                this.clientState.isBusy = false;
                this.router.navigate(['admin/category']);
            },
            error: (err: ApiError) => {
                this.clientState.isBusy = false;
                this.message = err.message;
                this.isError = true;
            },
        });
    }

    onDeleteCategory = () => {
        this.clientState.isBusy = true;
        this.categoryAdminService.deleteCategory(+this.categoryAdminModel.categoryId).subscribe({
            complete: () => {
                this.clientState.isBusy = false;
                this.router.navigate(['admin/category']);
            },
            error: (err: ApiError) => {
                this.clientState.isBusy = false;
                this.message = err.message;
                this.isError = true;
            },
        });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}
