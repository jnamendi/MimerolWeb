export interface AdminNavModel {
    items: AdminNavItem[];
}

export interface AdminNavItem {
    id: string;
    title: string;
    icon: string;
    subIcon?: string;
    translateKey?: string;
    type: string;
    url: string;
    isActive?: boolean;
    children?: AdminNavItem[]
}