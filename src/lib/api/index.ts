import {
	useMutation,
	useQuery,
	useQueryClient,
	UseQueryOptions,
} from '@tanstack/react-query'

import ky from 'ky'

import type { UserConfig } from 'lib/types'
import { API_HOST, SIGNED_MESSAGE_KEY } from 'lib/constants'

export function getUserConfig() {
	return ky
		.get(
			`${API_HOST}/project?signature=${localStorage.getItem(
				SIGNED_MESSAGE_KEY,
			)}`,
		)
		.json<UserConfig>()
}

export function setUserConfig(config: UserConfig) {
	return ky
		.post(
			`${API_HOST}/project?signature=${localStorage.getItem(
				SIGNED_MESSAGE_KEY,
			)}`,
			{ json: config },
		)
		.json()
}

export function useGetConfig(
	signature?: string | null,
	options?: UseQueryOptions<any, Error, UserConfig, ['config', string]>,
) {
	return useQuery({
		queryKey: ['config', signature as string],
		queryFn: () => ky.get(`${API_HOST}/project?signature=${signature}`).json(),
		networkMode: options?.networkMode ?? 'always',
		...options,
	})
}

export function useUpdateConfig() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (config: UserConfig) =>
			ky
				.post(
					`${API_HOST}/project?signature=${localStorage.getItem(
						SIGNED_MESSAGE_KEY,
					)}`,
					{ json: config },
				)
				.json(),
		onSuccess(data) {
			queryClient.setQueryData(
				['config', localStorage.getItem(SIGNED_MESSAGE_KEY)],
				JSON.parse(data as any),
			)
		},
	})
}
