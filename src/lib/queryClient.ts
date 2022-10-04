import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient({
	defaultOptions: { queries: { retryDelay: 5000 } },
})

export default queryClient
