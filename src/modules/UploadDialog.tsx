import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { Dialog, DialogContent, DialogTitle } from 'components/Dialog'

import UploadZone from './UploadZone'

function UploadDialog({
	onUpload,
	onClose,
	isMultiple = true,
}: {
	onUpload: (files: any[]) => void
	onClose: () => void
	isMultiple: boolean
}) {
	const { t } = useTranslation()
	const { projectId } = useParams()

	return (
		<Dialog onOpenChange={onClose} open>
			<DialogContent>
				<DialogTitle>{t('upload')}</DialogTitle>
				<UploadZone
					projectId={projectId!}
					onUpload={onUpload}
					isMultiple={isMultiple}
					files
				/>
			</DialogContent>
		</Dialog>
	)
}

export default UploadDialog
