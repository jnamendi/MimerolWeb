export class ApiUrl {
    static BaseUrl = "https://bmbsoft.com.vn:8440/ofodev/";

    // IP APi
    public static IPApi = "https://ipinfo.io/json";

    // User
    public static UserLogin = ApiUrl.BaseUrl + "api/user/login";
    public static UserResgister = ApiUrl.BaseUrl + "admin/user/register";
    public static UserForgotPassword = ApiUrl.BaseUrl + "api/user/forgot-password";
    public static UserActivateAccount = ApiUrl.BaseUrl + "admin/user/verify";
    public static UserResendEmail = ApiUrl.BaseUrl + "admin/user/resend-email";
    public static UserGetById = ApiUrl.BaseUrl + "api/user/getById";
    public static UserChangePassword = ApiUrl.BaseUrl + "admin/user/change-pass";
    public static UserUpdate = ApiUrl.BaseUrl + "admin/user/save";
    public static UserCreate = ApiUrl.BaseUrl + "admin/user/save";
    public static UserDelete = ApiUrl.BaseUrl + "admin/user/delete";
    public static UserGetList = ApiUrl.BaseUrl + "api/user/getUser";
    public static UserDeleteMany = ApiUrl.BaseUrl + "admin/user/deleteMany";
    public static UserGetAllSortByName = ApiUrl.BaseUrl + "api/user/get-all-user-sort-by-name";

    // Language
    public static LanguageGetAll = ApiUrl.BaseUrl + "api/language/getAll";
    public static LanguageSaving = ApiUrl.BaseUrl + "admin/language/save";

    // Comment
    public static CommentCreate = ApiUrl.BaseUrl + "admin/restaurant-comment/save";
    public static CommentDelete = ApiUrl.BaseUrl + "admin/restaurant-comment/delete";
    public static CommentGetList = ApiUrl.BaseUrl + "api/restaurant-comment/getAll";
    public static CommentGetBySize = ApiUrl.BaseUrl + "api/restaurant-comment/getBySize";
    public static CommentGetById = ApiUrl.BaseUrl + "api/restaurant-comment/getById";
    public static CommentDeleteMany = ApiUrl.BaseUrl + "admin/restaurant-comment/deleteMany";

    // Category
    public static CategoryCreate = ApiUrl.BaseUrl + "admin/category/save";
    public static CategoryUpdate = ApiUrl.BaseUrl + "admin/category/save";
    public static CategoryGetById = ApiUrl.BaseUrl + "api/category/getById";
    public static CategoryGetList = ApiUrl.BaseUrl + "api/category/getAllByLanguage";
    public static CategoryGetAllByLanguageCode = ApiUrl.BaseUrl + "api/category/getAll";
    public static CategoryDelete = ApiUrl.BaseUrl + "admin/category/delete";
    public static CategoryDeleteMany = ApiUrl.BaseUrl + "admin/category/deleteMany";
    public static CategoryGetByDistrict = ApiUrl.BaseUrl + "admin/category/get-by-district";
    public static CategoryGetAllSortByName = ApiUrl.BaseUrl + "api/category/get-all-sort-by-name";

    // Restaurant
    public static RestaurantEdit = ApiUrl.BaseUrl + "admin/restaurant/edit";
    public static RestaurantInsert = ApiUrl.BaseUrl + "admin/restaurant/insert";
    public static RestaurantCreate = ApiUrl.BaseUrl + "admin/restaurant/save";
    public static RestaurantGetById = ApiUrl.BaseUrl + "admin/restaurant/getById";
    public static RestaurantGetByName = ApiUrl.BaseUrl + "api/restaurant/getByName";
    public static RestaurantGetByDistrict = ApiUrl.BaseUrl + "admin/restaurant/get-by-district";
    public static RestaurantGetDetails = ApiUrl.BaseUrl + "api/restaurant/get-restaurant-by";
    public static RestaurantGetList = ApiUrl.BaseUrl + "api/restaurant/getAll";
    public static RestaurantDelete = ApiUrl.BaseUrl + "admin/restaurant/delete";
    public static RestaurantDeleteMany = ApiUrl.BaseUrl + "admin/restaurant/deleteMany";
    public static RestaurantGetRegisteredRestaurantsByCity = ApiUrl.BaseUrl + "api/restaurant/get-all-registered-city";
    public static RestaurantGetAllSortByName = ApiUrl.BaseUrl + "api/restaurant/get-all-restaurant-sort-by-name";

    // Contact
    public static ContactCreate = ApiUrl.BaseUrl + "admin/contact-us/save";

    // Address
    public static AddressCreate = ApiUrl.BaseUrl + "admin/address/save";
    public static AddressUpdate = ApiUrl.BaseUrl + "admin/address/save";
    public static AddressGetByUser = ApiUrl.BaseUrl + "api/address/getByUserId";
    public static AddressGetById = ApiUrl.BaseUrl + "api/address/getById";
    public static AddressDelete = ApiUrl.BaseUrl + "admin/address/delete";
    public static AddressGetList = ApiUrl.BaseUrl + "api/address/getAll";

    // Role
    public static RoleCreate = ApiUrl.BaseUrl + "admin/role/save";
    public static RoleGetList = ApiUrl.BaseUrl + "api/role/getAll";
    public static RoleDelete = ApiUrl.BaseUrl + "admin/role/delete";
    public static RoleUpdate = ApiUrl.BaseUrl + "admin/role/save";
    public static RoleGetById = ApiUrl.BaseUrl + "api/role/getById";
    public static RoleDeleteMany = ApiUrl.BaseUrl + "admin/role/deleteMany";

    // Menu
    public static MenuCreate = ApiUrl.BaseUrl + "admin/menu/save";
    public static MenuUpdate = ApiUrl.BaseUrl + "admin/menu/save";
    public static MenuGetList = ApiUrl.BaseUrl + "api/menu/getAll";
    public static MenuDelete = ApiUrl.BaseUrl + "admin/menu/delete";
    public static MenuGetById = ApiUrl.BaseUrl + "api/menu/getById";
    public static MenuDeleteMany = ApiUrl.BaseUrl + "admin/menu/deleteMany";
    public static MenuGetByOwner = ApiUrl.BaseUrl + "api/menu/getByOwner";
    public static RestaurantMenuGetGetByLanguageCode = ApiUrl.BaseUrl + "api/menu/get-by-restaurant";
    public static MenuGetByRestaurantId = ApiUrl.BaseUrl + "api/menu/get-menu-by-restaurant-id";

    // Menu item
    public static MenuItemGetList = ApiUrl.BaseUrl + "api/menu-item/getAll";
    public static MenuItemGetById = ApiUrl.BaseUrl + "admin/menu-item/get-by-id";
    public static MenuItemInsert = ApiUrl.BaseUrl + "admin/menu-item/insert";
    public static MenuItemEdit = ApiUrl.BaseUrl + "admin/menu-item/edit";
    public static MenuItemCreate = ApiUrl.BaseUrl + "admin/menu-item/save";
    public static MenuItemUpdate = ApiUrl.BaseUrl + "admin/menu-item/save";
    public static MenuItemDelete = ApiUrl.BaseUrl + "admin/menu-item/delete";
    public static MenuItemDeleteMany = ApiUrl.BaseUrl + "admin/menu-item/delete";
    public static MenuItemGetByOwner = ApiUrl.BaseUrl + "api/menu-item/get-by-owner";

    // Favourite
    public static FavouriteCreate = ApiUrl.BaseUrl + "admin/favourite/save";
    public static FavouriteUpdate = ApiUrl.BaseUrl + "admin/favourite/save";
    public static FavouriteGetList = ApiUrl.BaseUrl + "api/favourite/getAll";
    public static FavouriteGetById = ApiUrl.BaseUrl + "api/favourite/getById";
    public static FavouriteGetByUserId = ApiUrl.BaseUrl + "api/favourite/getByUserId";
    public static FavouriteGetByRestaurantIdAndUserId = ApiUrl.BaseUrl + "api/favourite/get-by-restaurant-and-user";

    // Rating
    public static RatingGetList = ApiUrl.BaseUrl + "api/rating/getAll";
    public static RatingCreate = ApiUrl.BaseUrl + "admin/rating/save";
    public static RatingUpdate = ApiUrl.BaseUrl + "admin/rating/save";
    public static RatingDelete = ApiUrl.BaseUrl + "admin/rating/delete";
    public static RatingGetById = ApiUrl.BaseUrl + "api/rating/getById";
    public static RatingDeleteMany = ApiUrl.BaseUrl + "admin/rating/deleteMany";

    // Upload
    public static TestUploadImage = ApiUrl.BaseUrl + "admin/testUploadImage";
    public static UploadSave = ApiUrl.BaseUrl + "admin/upload";
    public static UploadGetFile = ApiUrl.BaseUrl + "api/upload/image";

    // Attribute
    public static AttributeGetAllByLanguageCode = ApiUrl.BaseUrl + "api/attribute-group/getAll";

    // Restaurant comment
    public static RestaurantCommentGetBySize = ApiUrl.BaseUrl + "api/restaurant-comment/getBySize";
    public static RestaurantCommentCreate = ApiUrl.BaseUrl + "admin/restaurant-comment/save";
    public static RestaurantCommentGetByOwner = ApiUrl.BaseUrl + "api/restaurant-comment/get-by-owner";

    // Order
    public static OrderGetByUserId = ApiUrl.BaseUrl + "api/order/getByUser";
    public static OrderGetPayment = ApiUrl.BaseUrl + "api/order/get-order-payment";
    public static OrderPayment = ApiUrl.BaseUrl + "admin/order/payment";
    public static OrderFullInfo = ApiUrl.BaseUrl + "api/order/get-full-info-by-id";
    public static OrderGetByRestaurantAndStatus = ApiUrl.BaseUrl + "api/order/get-by-restaurant";
    public static OrderUpdate = ApiUrl.BaseUrl + "admin/order/update-order-to";
    public static OrderGetByOwner = ApiUrl.BaseUrl + "api/order/get-by-owner";
    public static OrderGetAllOrder = ApiUrl.BaseUrl + "admin/order/get-all-order";

    // User Info
    public static UserInfoCreate = ApiUrl.BaseUrl + "admin/user-info/save";
    public static UserInfoUpdate = ApiUrl.BaseUrl + "admin/user-info/save";
    public static UserInfoGetByUserId = ApiUrl.BaseUrl + "api/user-info/get-all";

    // Voucher
    public static VoucherGetByCode = ApiUrl.BaseUrl + "api/voucher/getByCode";
    public static PromotionGetByCode = ApiUrl.BaseUrl + "api/promotion/getByCode";

    // Promotion
    public static PromotionCreate = ApiUrl.BaseUrl + "admin/promotion/save";
    public static PromotionUpdate = ApiUrl.BaseUrl + "admin/promotion/save";
    public static PromotionDelete = ApiUrl.BaseUrl + "admin/promotion/delete";
    public static PromotionGetList = ApiUrl.BaseUrl + "api/promotion/getAll";
    public static PromotionGetById = ApiUrl.BaseUrl + "api/promotion/getById";
    public static PromotionDeleteMany = ApiUrl.BaseUrl + "admin/promotion/deleteMany";
    public static PromotionGetAllByOwner = ApiUrl.BaseUrl + "api/promotion/get-all-by-owner";

    // City
    public static CityGetAll = ApiUrl.BaseUrl + "api/city/getAll";
    public static CityGetById = ApiUrl.BaseUrl + "api/city/getById";
    public static CityGetByRestaurantId = ApiUrl.BaseUrl + "api/city/getByRestaurantId";

    // District
    public static DistrictGetByCity = ApiUrl.BaseUrl + "api/district/get-district-by-city";
    public static DistrictGetByRestaurantCity = ApiUrl.BaseUrl + "api/district/get-district-by-restaurant-city";

    //Zone
    public static ZoneGetAll = ApiUrl.BaseUrl + "api/zone/getAll";
    public static ZoneGetByDistrictId = ApiUrl.BaseUrl + "api/zone/getByDistrict";
    public static ZoneGetBayDistrictRestaurant = ApiUrl.BaseUrl + "api/zone/getZoneByDistrict";

    //Payment
    public static PaymentGetAll = ApiUrl.BaseUrl + "api/PaymentProvider/getAll";
}