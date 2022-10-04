import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { Dialog, DialogContent, DialogTitle } from 'components/Dialog'

import UploadZone from './UploadZone'

function UploadDialog({
	onUpload,
	onClose,
}: {
	onUpload: (files: any[]) => void
	onClose: () => void
}) {
	const { t } = useTranslation()
	const { projectId } = useParams()

	return (
		<Dialog onOpenChange={onClose} open>
			<DialogContent>
				<DialogTitle>{t('upload')}</DialogTitle>
				<UploadZone projectId={projectId!} onUpload={onUpload} files />
			</DialogContent>
		</Dialog>
	)
}

export default UploadDialog
