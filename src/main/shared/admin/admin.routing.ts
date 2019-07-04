import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  AdminHeaderComponent,
  AdminLayoutComponent,
  AdminSideBarComponent
} from "../_layouts";

import {
  AdminCategoryComponent,
  AdminCategoryCreationComponent,
  AdminCategoryDetailComponent,
  AdminRestaurantComponent,
  AdminRestaurantCreationComponent,
  AdminRestaurantDetailComponent,
  AdminMenuComponent,
  AdminMenuCreationComponent,
  AdminMenuDetailComponent,
  AdminCommentComponent,
  AdminCommentCreationComponent,
  AdminCommentDetailComponent,
  AdminFavouriteComponent,
  AdminRoleComponent,
  AdminRoleCreationComponent,
  AdminRoleDetailComponent,
  AdminAddressComponent,
  AdminRatingComponent,
  AdminRatingCreationComponent,
  AdminRatingDetailComponent,
  AdminUserComponent,
  AdminUserCreationComponent,
  AdminUserDetailComponent,
  AdminMenuItemComponent,
  AdminMenuItemCreationComponent,
  AdminMenuItemDetailComponent,
  AdminPromotionComponent,
  AdminPromotionCreationComponent,
  AdminPromotionDetailComponent
} from "./components";

import {
  AuthGuardService as AuthGuard,
  RoleGuardService as RoleGuard
} from '../services';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: 'admin'
    },
    children: [
      { path: 'restaurant', component: AdminRestaurantComponent },
      { path: 'restaurant/new', component: AdminRestaurantCreationComponent },
      { path: 'restaurant/:id', component: AdminRestaurantDetailComponent },
      { path: 'category', component: AdminCategoryComponent },
      { path: 'category/new', component: AdminCategoryCreationComponent },
      { path: 'category/:id', component: AdminCategoryDetailComponent },
      { path: 'menu', component: AdminMenuComponent },
      { path: 'menu/new', component: AdminMenuCreationComponent },
      { path: 'menu/:id', component: AdminMenuDetailComponent },
      { path: 'menu-item', component: AdminMenuItemComponent },
      { path: 'menu-item/new', component: AdminMenuItemCreationComponent },
      { path: 'menu-item/:id', component: AdminMenuItemDetailComponent },
      { path: 'comment', component: AdminCommentComponent },
      { path: 'comment/new', component: AdminCommentCreationComponent },
      { path: 'comment/:id', component: AdminCommentDetailComponent },
      { path: 'favourite', component: AdminFavouriteComponent },
      { path: 'role', component: AdminRoleComponent },
      { path: 'role/new', component: AdminRoleCreationComponent },
      { path: 'role/:id', component: AdminRoleDetailComponent },
      { path: 'address', component: AdminAddressComponent },
      { path: 'rating', component: AdminRatingComponent },
      { path: 'rating/new', component: AdminRatingCreationComponent, },
      { path: 'rating/:id', component: AdminRatingDetailComponent },
      { path: 'user', component: AdminUserComponent },
      { path: 'user/new', component: AdminUserCreationComponent, },
      { path: 'user/:id', component: AdminUserDetailComponent },
      { path: 'promotion', component: AdminPromotionComponent },
      { path: 'promotion/new', component: AdminPromotionCreationComponent },
      { path: 'promotion/:id', component: AdminPromotionDetailComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }