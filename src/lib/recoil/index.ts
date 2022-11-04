import lodashGet from 'lodash.get'
import { useCallback, useMemo } from 'react'
import { useParams } from 'react-router'
import {
	selectorFamily,
	atom,
	AtomEffect,
	RecoilLoadable,
	useRecoilValue,
	useSetRecoilState,
} from 'recoil'
import { setIn } from 'formik'
import debounce from 'lodash.debounce'

import { Project, ProjectExport, UserConfig } from 'lib/types'
import { NestedPaths, TypeFromPath } from '.d'
import { getUserConfig, setUserConfig } from 'lib/api'
import { getOut } from 'lib/combinationsEngine'
import { SIGNED_MESSAGE_KEY } from 'lib/constants'

const localStorageEffect: (key: string) => AtomEffect<string | null> =
	(key) =>
	({ setSelf, onSet }) => {
		const savedValue = localStorage.getItem(key)
		if (savedValue != null) {
			if (typeof savedValue === 'string') {
				setSelf(savedValue)
			} else {
				setSelf(JSON.parse(savedValue))
			}
		}

		onSet((newValue, _, isReset) =>
			isReset
				? localStorage.removeItem(key)
				: localStorage.setItem(
						key,
						typeof newValue !== 'string' ? JSON.stringify(newValue) : newValue,
				  ),
		)
	}

const syncStorageEffect: AtomEffect<UserConfig | null> = ({
	setSelf,
	onSet,
	trigger,
}) => {
	async function loadConfig() {
		try {
			const config = await getUserConfig()
			setSelf(config)
		} catch {
			setSelf(null)
		}
	}

	if (trigger === 'get') {
		loadConfig()
	}

	onSet(
		debounce((config: any) => {
			setUserConfig(config)
			// eslint-disable-next-line no-magic-numbers
		}, 3000),
	)
}

export const ConfigLoadable = RecoilLoadable.of(getUserConfig())

export const signedMessageAtom = atom<string | null>({
	key: 'signed-message',
	default: null,
	effects: [localStorageEffect(SIGNED_MESSAGE_KEY)],
})

export const configAtom = atom<UserConfig | null>({
	key: 'config',
	default: undefined,
	effects: [syncStorageEffect],
})

export const projectSelector = selectorFamily<
	Omit<Project, 'export'> | undefined,
	string
>({
	key: 'current-project',
	get:
		(id) =>
		({ get }) => {
			const config = get(configAtom)
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { export: _, ...project } = config?.projects?.[id] ?? {}
			return project
		},
})

export const projectGeneratedSelector = selectorFamily<ProjectExport, string>({
	key: 'current-project-export',
	get:
		(id: string) =>
		({ get }) => {
			const config = get(configAtom)
			return config.projects?.[id]?.export
		},
})

export function useRegenerate() {
	const { projectId } = useParams()

	const project = useRecoilValue(projectSelector(projectId!))
	const setExport = useSetFieldValue('export')

	return useCallback(() => {
		const combinations = getOut(project!)

		setExport({ regeneratedAt: new Date(), combinations })
	}, [project, setExport])
}

// Hooks

export function useField<T>(subpath: NestedPaths<Project>) {
	const { projectId } = useParams()

	const path = `projects.${projectId}.${subpath!}` as const

	const value = useRecoilValue(fieldSelector(path))
	const setValue = useSetFieldValue<T>(subpath)

	return [value, setValue] as [
		T,
		(valOrUpdater: T | ((currVal: T) => T)) => void,
	]
}

export const fieldSelector = selectorFamily<
	TypeFromPath<UserConfig, any>,
	NestedPaths<UserConfig>
>({
	key: 'nested-field',
	get:
		(path) =>
		({ get }) =>
			lodashGet(get(configAtom), path!),
})

export function useSetFieldValue<T>(
	subpath: NestedPaths<Project>,
	isFullPath?: boolean,
) {
	const { projectId } = useParams()
	const path = isFullPath
		? (subpath as string)
		: (`projects.${projectId}.${subpath!}` as const)

	const setConfig = useSetRecoilState(configAtom)

	const setValue = useCallback(
		(value: T | ((prev: T) => T)) => {
			return setConfig((config: any) =>
				setIn(
					config,
					path,
					value instanceof Function ? value(lodashGet(config, path)) : value,
				),
			)
		},
		[setConfig, path],
	)

	return setValue
}

export function useFieldValue<T>(subpath: NestedPaths<Project>) {
	const { projectId } = useParams()

	const path = `projects.${projectId}.${subpath!}` as const

	return useRecoilValue<T>(fieldSelector(path))
}

export function useSetFieldsValue() {
	const { projectId } = useParams()

	const setConfig = useSetRecoilState(configAtom)

	return useCallback(
		(path: NestedPaths<Project>, value: any) => {
			setConfig((config: any) =>
				setIn(config, `projects.${projectId}.${path!}`, value),
			)
		},
		[setConfig, projectId],
	)
}

export function useFieldProps<T>(path: NestedPaths<Project>) {
	const [value, setValue] = useField<T>(path)

	const onChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
			setValue(event.target.value as T),
		[setValue],
	)

	const props = useMemo(
		() => ({
			value,
			onChange,
			name: path,
		}),
		[onChange, path, value],
	)

	return props
}
