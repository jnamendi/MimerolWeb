import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import {
  AppLayoutComponent
} from "./shared/_layouts";

import {
  NotFoundComponent,
  AboutComponent,
  HomeComponent,
  CareerComponent,
  ChildComponent,
  LoginComponent,
  MobileAppsComponent,
  OrderComponent,
  TermComponent,
  MenuComponent,
  ContactUsComponent,
  VerifyComponent,
  UserStartComponent,
  UserOrdersComponent,
  UserOrdersDetailComponent,
  UserAddressesComponent,
  UserFavouriteComponent,
  UserDetailsComponent,
  UserChangePassComponent,
  OrderCheckoutComponent,
} from './shared/components';

import {
  AuthGuardService as AuthGuard,
  RoleGuardService as RoleGuard
} from './shared/services';

const routes: Routes = [

  //App routes go here 
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'about', component: AboutComponent },
      { path: 'career', component: CareerComponent },
      { path: 'child', component: ChildComponent },
      { path: 'login', component: LoginComponent },
      { path: 'login/:state', component: LoginComponent },
      { path: 'apps', component: MobileAppsComponent },
      { path: 'order/:restaurantId', component: OrderComponent },
      { path: 'order-checkout/:invoiceId', component: OrderCheckoutComponent },
      { path: 'menu/:id', component: MenuComponent },
      { path: 'term', component: TermComponent },
      { path: 'contact-us', component: ContactUsComponent },
      { path: 'verify', component: VerifyComponent },
      { path: 'user-start', component: UserStartComponent, canActivate: [AuthGuard] },
      { path: 'user-orders', component: UserOrdersComponent, canActivate: [AuthGuard] },
      { path: 'user-orders/:id/:orderCode', component: UserOrdersDetailComponent, canActivate: [AuthGuard] },
      { path: 'user-addresses', component: UserAddressesComponent, canActivate: [AuthGuard] },
      { path: 'user-favourite', component: UserFavouriteComponent, canActivate: [AuthGuard] },
      { path: 'user-details', component: UserDetailsComponent, canActivate: [AuthGuard] },
      { path: 'user-change-pass', component: UserChangePassComponent, canActivate: [AuthGuard] },
    ]
  },

  // Admin routes
  {
    path: 'admin',
    loadChildren: './shared/admin/admin.module#AdminAppModule'
  },

  // Owner routes
  {
    path: 'owner',
    loadChildren: './shared/owner/owner.module#OwnerAppModule'
  },

  {
    path: '**',
    component: NotFoundComponent
  }
];

export const AppRouting = RouterModule.forRoot(routes, {
  useHash: false,
  preloadingStrategy: PreloadAllModules
});
