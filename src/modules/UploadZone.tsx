/* eslint-disable react/no-unknown-property */
import { useState } from 'react'
import { nanoid } from 'nanoid'
import { useTranslation } from 'react-i18next'
import ky from 'ky'

import Loading from 'modules/Loading'

import { API_HOST } from 'lib/constants'

function getFilesFromWebkitDataTransferItems(dataTransferItems: any) {
	function traverseFileTreePromise(item: any, path = '') {
		return new Promise((resolve) => {
			if (item.isFile) {
				item.file((file: any) => {
					file.filepath = path + file.name //save full path
					files.push(file)
					resolve(file)
				})
			} else if (item.isDirectory) {
				const dirReader = item.createReader()
				dirReader.readEntries((entries: any) => {
					const entriesPromises = []
					for (const entr of entries)
						entriesPromises.push(
							traverseFileTreePromise(entr, path + item.name + '/'),
						)
					resolve(Promise.all(entriesPromises))
				})
			}
		})
	}

	const files = [] as any[]
	return new Promise((resolve) => {
		const entriesPromises = []
		for (const it of dataTransferItems)
			entriesPromises.push(traverseFileTreePromise(it.webkitGetAsEntry()))
		Promise.all(entriesPromises).then(() => {
			resolve(files)
		})
	})
}

function UploadZone({
	projectId,
	onUpload,
	files = false,
}: {
	projectId: string
	onUpload: (files: any[]) => void
	files?: boolean
}) {
	const { t } = useTranslation()

	const [isDragging, setIsDragging] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	async function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
		event.stopPropagation()
		event.preventDefault()

		setIsLoading(true)

		const files = await getFilesFromWebkitDataTransferItems(
			event.dataTransfer.items,
		)

		uploadFiles(files as any)
	}

	async function uploadFiles(files: FileList) {
		const mappedFiles = Array.from(files)
			.filter(
				({ name, type }) => name !== '.DS_Store' && type.includes('image'),
			)
			.map((file) => {
				const path = file.webkitRelativePath?.split('/')
				// eslint-disable-next-line no-magic-numbers
				const attribute = path.length ? `${path[path.length - 2]}` : ''
				const extension = file.name.split('.').pop()
				const [name] = file.name.split('.').slice(0, -1)

				const id = nanoid()
				const fileName = `${id}.${extension}`

				return {
					id,
					file,
					name,
					fileName,
					attribute,
					assetKey: fileName,
				}
			})

		// Generate presigned-url for all files
		const presignedUrls = (await ky
			.post(`${API_HOST}/upload`, {
				json: {
					paths: mappedFiles.map(({ fileName }) => fileName),
					project: projectId,
					signedMessage: localStorage.getItem('@mejor/signedMessage'),
				},
			})
			.json()) as { presignedUrl: string }[]

		try {
			// Upload all files
			await Promise.all(
				presignedUrls.map(({ presignedUrl }, index) =>
					ky.put(presignedUrl, {
						headers: { 'Content-Type': 'multipart/form-data' },
						body: mappedFiles[index]?.file,
					}),
				),
			)

			setIsLoading(false)

			onUpload(mappedFiles)
		} catch {
			window.alert(t('errors.assetUpload'))
			setIsLoading(false)
		}
	}

	function handleSelectDirectory(event: React.ChangeEvent<HTMLInputElement>) {
		const { files } = event.target

		if (!files) return

		setIsLoading(true)

		uploadFiles(files)
	}

	if (isLoading) {
		return <Loading center message={t('uploadingFiles')} />
	}

	return (
		// TODO:
		// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
		<label
			style={{
				border: isDragging ? '2px solid var(--colors--uva)' : '2px dotted #999',
				borderRadius: 10,
				minHeight: 200,
				width: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				position: 'relative',
			}}
			onDragStart={() => undefined}
			onDragEnd={() => setIsDragging(false)}
			onDragOver={(ev) => {
				ev.preventDefault()
				return false
			}}
			onDragLeave={() => setIsDragging(false)}
			onDragEnter={() => setIsDragging(true)}
			onDrop={handleDrop}
			htmlFor="upload"
		>
			<p style={{ fontWeight: '800' }}>
				{isDragging
					? "Drop it like it's hot"
					: 'Select or drop your folder here'}
			</p>
			<input
				id="upload"
				style={{
					width: '100%',
					height: '100%',
					opacity: 0,
					position: 'absolute',
					top: 0,
					left: 0,
				}}
				multiple
				type="file"
				autoComplete="off"
				onChange={handleSelectDirectory}
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				allowdirs={files ? undefined : ''}
				directory={files ? undefined : ''}
				mozdirectory={files ? undefined : ''}
				webkitdirectory={files ? undefined : ''}
			/>
		</label>
	)
}

export default UploadZone
