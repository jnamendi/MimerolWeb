import { Component } from '@angular/core';
import { LoginService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../core';
import { StorageKey } from '../../services/storage-key/storage-key';

@Component({
    selector: 'page-user-left-menu',
    templateUrl: './user-left-menu.component.html'
})
export class UserLeftMenuComponent {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private loginService: LoginService,
        private storageService: StorageService,
    ) {

    }
    onLogout = () => {
        this.loginService.onLogout().then(res => {
            this.storageService.onRemoveToken(StorageKey.User);
            this.storageService.onRemoveToken(StorageKey.Token);
            this.router.navigate(['login']);
        });
    }
}
