import type { SearchParams } from '@/types/search-params'

export const params = useUrlSearchParams<SearchParams>('history')
