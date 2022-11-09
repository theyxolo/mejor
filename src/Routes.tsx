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
import { useTranslation } from 'react-i18next'

import Loading from 'modules/Loading'

import Button from 'components/Button'

import { configAtom, numberOfProjectsSelector } from 'lib/recoil'
import { Grid } from 'components/system'
import { Main } from 'GlobalStyled'

const Configuration = lazy(() => import('containers/Configuration'))
const Preview = lazy(() => import('containers/Preview'))
const Upload = lazy(() => import('containers/Upload'))
const Settings = lazy(() => import('containers/Settings'))
const Error = lazy(() => import('containers/Error'))
const Deploy = lazy(() => import('containers/Deploy'))

function SelectProject() {
	const config = useRecoilValue(configAtom)
	const { t } = useTranslation()

	return (
		<Main withPadding>
			<h1>{t('screens.projects.title')}</h1>
			<Grid
				marginTop="var(--space--medium)"
				gridTemplateColumns="repeat(auto-fit, minmax(200px,1fr))"
				gap="var(--space--medium)"
			>
				{Object.entries(config?.projects ?? {}).map(([projectId, project]) => (
					<Button as={Link} key={projectId} to={projectId}>
						{project.name}
					</Button>
				))}
			</Grid>
		</Main>
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
	const projectIdsCount = useRecoilValue(numberOfProjectsSelector)
	const hasProjects = projectIdsCount > 0

	if (projectIdsCount === undefined) {
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
