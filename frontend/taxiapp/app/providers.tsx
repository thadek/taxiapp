// In Next.js, this file would be called: app/providers.tsx
'use client'
import { getQueryClient } from './get-query-client'
import {NextUIProvider} from '@nextui-org/react'


// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined



export default function Providers({ children}: Readonly<{ children: React.ReactNode }>) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient()

  return (
    <NextUIProvider>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
    </NextUIProvider>
  )
}