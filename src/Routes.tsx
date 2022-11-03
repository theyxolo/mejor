import { lazy, Suspense } from 'react'
import {
	Route,
	Routes as ReactRouterRoutes,
	Navigate,
	Outlet,
	Link,
} from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { ErrorBoundary } from '@sentry/react'

import Loading from 'modules/Loading'

import Button from 'components/Button'

import { configAtom } from 'lib/recoil'

const Configuration = lazy(() => import('containers/Configuration'))
const Preview = lazy(() => import('containers/Preview'))
const Upload = lazy(() => import('containers/Upload'))
const Settings = lazy(() => import('containers/Settings'))
const Error = lazy(() => import('containers/Error'))
const Deploy = lazy(() => import('containers/Deploy'))

function SelectProject() {
	const config = useRecoilValue(configAtom)

	return (
		<>
			{Object.entries(config?.projects ?? {}).map(([projectId, project]) => (
				<Button as={Link} key={projectId} to={projectId}>
					{project.name}
				</Button>
			))}
		</>
	)
}

function ProjectOutlet() {
	return (
		<Suspense fallback={<Loading center />}>
			<ErrorBoundary fallback={<Error />}>
				<Outlet />
			</ErrorBoundary>
		</Suspense>
	)
}

function Routes() {
	const config = useRecoilValue(configAtom)

	const projectIds = Object.keys(config?.projects ?? {})
	const hasProjects = projectIds.length > 0

	if (config === undefined) {
		return <Loading center />
	}

	return (
		<ReactRouterRoutes>
			<Route path="upload" element={<Upload />} />
			<Route path=":projectId" element={<ProjectOutlet />}>
				<Route path="token" element={<Configuration />} />
				<Route path="preview" element={<Preview />} />
				<Route path="deploy" element={<Deploy />} />
				<Route path="settings" element={<Settings />} />
				<Route index element={<Navigate to="token" replace={true} />} />
			</Route>
			<Route
				path=""
				element={
					hasProjects ? (
						<SelectProject />
					) : (
						<Navigate to="upload" replace={true} />
					)
				}
			/>
		</ReactRouterRoutes>
	)
}

export default Routes
