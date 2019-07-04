export interface ApiResponse {
    status: number;
    content: Object;
    message: string;
}

export interface ApiListResponse {
    status: number;
    content: Array<any>;
    message: string;
}

export interface ApiResponsePaging {
    status: number;
    content: PagingModel;
    message: string;
}

export interface PagingModel {
    totalCount: number;
    pageSize: number;
    pageNumber: number;
    data: Array<any>;
}

export interface ApiError {
    status: number;
    message: string;
    errorType: string;
    content: PagingModel;
}