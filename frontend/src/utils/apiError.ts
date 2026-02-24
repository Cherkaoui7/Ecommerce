import { isAxiosError } from 'axios';

interface ApiErrorResponse {
    message?: string;
    error?: string;
    errors?: Record<string, string[] | string>;
}

const toAxiosApiError = (error: unknown) => {
    if (!isAxiosError<ApiErrorResponse>(error)) {
        return null;
    }
    return error;
};

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
    const axiosError = toAxiosApiError(error);
    const message = axiosError?.response?.data?.message;

    if (typeof message === 'string' && message.trim().length > 0) {
        return message;
    }

    return fallback;
};

export const getApiErrorDetail = (error: unknown): string | null => {
    const axiosError = toAxiosApiError(error);
    const detail = axiosError?.response?.data?.error;

    return typeof detail === 'string' && detail.trim().length > 0 ? detail : null;
};

export const getApiValidationDetails = (error: unknown): string => {
    const axiosError = toAxiosApiError(error);
    const fieldErrors = axiosError?.response?.data?.errors;

    if (!fieldErrors || typeof fieldErrors !== 'object') {
        return '';
    }

    return Object.values(fieldErrors)
        .flatMap((value) => (Array.isArray(value) ? value : [value]))
        .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
        .join(', ');
};
