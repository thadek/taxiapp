import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
    useQuery,
} from '@tanstack/react-query'
import  Settings  from './settings'

import { getQueryClient } from '../get-query-client'

import { getSettings } from '@/app/queries/settings'


export default function PostsRoute({}) {

    const queryClient = getQueryClient()

    queryClient.prefetchQuery({
        queryKey: ['settings'],
        queryFn: getSettings
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
           <Settings/>
        </HydrationBoundary>
    )
}