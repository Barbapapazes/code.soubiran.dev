import type { SearchParams } from '@/app/types/search-params'

export const params = useUrlSearchParams<SearchParams>('history')
