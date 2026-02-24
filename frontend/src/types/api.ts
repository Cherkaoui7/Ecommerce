export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    errors?: Record<string, string[] | string>;
}

export type QueryParams = Record<string, string | number | boolean | null | undefined>;
