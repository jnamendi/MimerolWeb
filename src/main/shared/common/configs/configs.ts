export module Configs {
    export const PageIndex = 1;
    export const PageSize = 10;
    export const VAT = 10;


    export const AccountTypes = [
        { value: 1, text: 'Private' },
        { value: 2, text: 'Company' },
    ];

    export const UserRoles = [
        { value: "admin", label: 'Admin' },
        { value: "owner", label: 'Owner' },
        { value: "guest", label: 'Guest' },

    ];

    export const SpainCurrency = {
        symbol: "C$", code: "NIO"
    }
}