import {
    //--App
    HttpService,
    ApiService,
    SiteSettingService,
    AuthGuardService,
    AppAuthService,
    RoleGuardService,
    LoginService,
    GoogleApiService,
    LanguageService,
    CommentService,
    UserService,
    ContactService,
    AddressService,
    RestaurantAppService,
    CategoryAppService,
    UploadService,
    AttributeService,
    FavouriteService,
    RestaurantCommentService,
    RestaurantMenuService,
    OrderService,
    VoucherService,
    CityService,
    DistrictService,
    //--Admin
    CategoryAdminService,
    MenuAdminService,
    FavouriteAdminService,
    RoleAdminService,
    AddressAdminService,
    UserAdminService,
    CommentAdminService,
    RestaurantAdminService,
    RatingAdminService,
    MenuItemAdminService,
    PromotionAdminService,
    OrderAdminService,
    //--Owner
    MenuOwnerService,
    MenuItemOwnerService,
    UserOwnerService,
    RestaurantCommentOwnerService,
    RestaurantOwnerService,
    OrderOwnerService,
    PromotionOwnerService
} from './services';

import { ClientState } from "./state";

import { I18nService, StorageService } from "./core";

// tslint:disable-next-line:variable-name
export const SharedServices = [
    //---App
    I18nService,
    StorageService,
    ClientState,
    HttpService,
    ApiService,
    SiteSettingService,
    AuthGuardService,
    AppAuthService,
    RoleGuardService,
    LoginService,
    GoogleApiService,
    LanguageService,
    CommentService,
    UserService,
    ContactService,
    AddressService,
    RestaurantAppService,
    CategoryAppService,
    UploadService,
    AttributeService,
    FavouriteService,
    RestaurantCommentService,
    RestaurantMenuService,
    OrderService,
    VoucherService,
    CityService,
    DistrictService,
    //---Admin
    CategoryAdminService,
    MenuAdminService,
    FavouriteAdminService,
    RoleAdminService,
    AddressAdminService,
    UserAdminService,
    CommentAdminService,
    RestaurantAdminService,
    RatingAdminService,
    MenuItemAdminService,
    PromotionAdminService,
    OrderAdminService,
    //---Owner
    MenuOwnerService,
    MenuItemOwnerService,
    UserOwnerService,
    RestaurantCommentOwnerService,
    RestaurantOwnerService,
    OrderOwnerService,
    PromotionOwnerService
];