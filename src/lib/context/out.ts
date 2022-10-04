import { createContext, useContext } from 'react'

import type { UserConfig } from 'lib/types'

export type OutConfig = { [key: string]: string[][] }

export const OutContext = createContext<{
	out: OutConfig | null
	regenerate: (userConfig: UserConfig) => void
}>({
	out: null,
	regenerate: () => undefined,
})

export function useOut(
	projectId: string,
): [string[][] | null, (userConfig: UserConfig) => void] {
	const data = useContext(OutContext)
	return [data.out?.[projectId] ?? null, data.regenerate]
}
