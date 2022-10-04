import { lazy, Suspense } from 'react'
import {
	Route,
	Routes as ReactRouterRoutes,
	Navigate,
	Outlet,
} from 'react-router-dom'
import { useField } from 'formik'
import { ErrorBoundary } from '@sentry/react'

import Loading from 'modules/Loading'

const Configuration = lazy(() => import('containers/Configuration'))
const Preview = lazy(() => import('containers/Preview'))
const Upload = lazy(() => import('containers/Upload'))
const Settings = lazy(() => import('containers/Settings'))
const Error = lazy(() => import('containers/Error'))

function Routes() {
	const [{ value: projects }] = useField('projects')
	const projectIds = Object.keys(projects ?? {})
	const hasProjects = projectIds?.length > 0

	return (
		<ReactRouterRoutes>
			<Route path="upload" element={<Upload />} />
			<Route
				path=":projectId"
				element={
					<Suspense fallback={<Loading center />}>
						<ErrorBoundary fallback={<Error />}>
							<Outlet />
						</ErrorBoundary>
					</Suspense>
				}
			>
				<Route path="token" element={<Configuration />} />
				<Route path="preview" element={<Preview />} />
				<Route path="settings" element={<Settings />} />
				<Route index element={<Navigate to="token" replace={true} />} />
			</Route>
			<Route
				element={
					<Navigate
						to={hasProjects ? projectIds?.[0] : 'upload'}
						replace={true}
					/>
				}
				index
			/>
		</ReactRouterRoutes>
	)
}

export default Routes
