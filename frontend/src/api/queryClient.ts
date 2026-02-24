import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,      // 5 minutes — data is fresh for 5 min before re-fetching
            gcTime: 10 * 60 * 1000,        // 10 minutes — unused cache is kept for 10 min
            retry: 1,                       // retry once on failure
            refetchOnWindowFocus: false,    // don't refetch when switching browser tabs
        },
    },
});
