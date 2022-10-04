import {
	useMutation,
	useQuery,
	useQueryClient,
	UseQueryOptions,
} from '@tanstack/react-query'

import ky from 'ky'

import type { UserConfig } from 'lib/types'
import { API_HOST } from 'lib/constants'

export function useGetConfig(
	signature?: string | null,
	options?: UseQueryOptions<any, Error, any, ['config']>,
) {
	return useQuery(
		['config'],
		() => ky.get(`${API_HOST}/project?signature=${signature}`).json(),
		options,
	)
}

export function useUpdateConfig() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (
			config: UserConfig & { out: { [projectId: string]: string[][] } },
		) =>
			ky
				.post(
					`${API_HOST}/project?signature=${localStorage.getItem(
						'@mejor/signedMessage',
					)}`,
					{ json: config },
				)
				.json(),
		onSuccess(data) {
			queryClient.setQueryData(['config'], JSON.parse(data as any))
		},
	})
}
