import { Fragment, useMemo, useState } from 'react'
import { useField, useFormikContext } from 'formik'
import {
	Eye,
	Plus,
	Trash,
	Shuffle,
	MoreHorizontal,
	PlusCircle,
	ChevronRight,
	Check,
	Droplet,
	EyeOff,
} from 'react-feather'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { useAccount } from 'wagmi'
import { nanoid } from 'nanoid'

import Upload from 'containers/Upload'

import {
	RightSlot,
	DropdownMenu,
	DropdownMenuSub,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from 'components/DropdownMenu'
import Button, { Icon } from 'components/Button'
import { Flex, Grid } from 'components/system'
import Slider from 'components/Slider'

import UploadDialog from 'modules/UploadDialog'

import { BlendMode } from 'lib/constants'
import { useOut } from 'lib/context/out'
import { getAssetUrl } from 'lib'

import { AssetImg } from './styled'

function Trait({
	id,
	project,
	address,
	onDelete,
}: {
	id: string
	project: string
	address: string
	onDelete?: () => void
}) {
	const { t } = useTranslation()
	const { getFieldProps, setFieldValue } = useFormikContext()

	const [out] = useOut(project)
	const [{ value: weightValue }, , { setValue }] = useField(
		`projects.${project}.traits.${id}.weight`,
	)
	const [{ value: assetKey }] = useField(
		`projects.${project}.traits.${id}.assetKey`,
	)
	const [{ value: showInMetadata }, , { setValue: setShowInMetadata }] =
		useField(`projects.${project}.traits.${id}.showInMetadata`)
	const weightValueInt = parseInt(weightValue?.replace('%', ''))

	const [traitPercentage] = useMemo(() => {
		const totalCount = out?.length
		const appearancesCount = out
			?.flat()
			.filter((trait: string) => trait.includes(id)).length

		return [
			// eslint-disable-next-line no-magic-numbers
			Math.round(((appearancesCount ?? 0) / (totalCount ?? 0)) * 100),
			appearancesCount,
		]
	}, [out, id])

	return (
		<Flex flexDirection="column" gap="var(--space--medium)">
			{assetKey && (
				<AssetImg src={getAssetUrl(assetKey, { address, project })} />
			)}
			<Flex gap="var(--space--small)" style={{ width: '100%' }}>
				<input
					type="text"
					style={{ width: '100%', display: 'block' }}
					{...getFieldProps(`projects.${project}.traits.${id}.name`)}
				/>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							style={{ width: 40, height: 40, padding: 0, flexShrink: 0 }}
						>
							<MoreHorizontal size={16} />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent sideOffset={5}>
						<DropdownMenuItem disabled>
							<Shuffle />
							{t('replace')}
						</DropdownMenuItem>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<Droplet />
								{t('blendMode')}
								<RightSlot>
									<ChevronRight />
								</RightSlot>
							</DropdownMenuSubTrigger>
							<DropdownMenuSubContent sideOffset={2} alignOffset={-5}>
								<DropdownMenuItem>
									<Check />
									{t('blendMode.normal')}
								</DropdownMenuItem>
								<DropdownMenuItem disabled>
									{t('blendMode.multiply')}
								</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuSub>
						<DropdownMenuItem
							onSelect={(event) => {
								event.preventDefault()
								setShowInMetadata(!showInMetadata)
							}}
						>
							{showInMetadata ? (
								<>
									<Eye />
									{t('shownInMetadata')}
								</>
							) : (
								<>
									<EyeOff />
									{t('hiddenInMetadata')}
								</>
							)}
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => {
								onDelete?.()
								setFieldValue(
									`projects.${project}.traits.${id}`,
									undefined,
									true,
								)
							}}
						>
							<Trash />
							{t('delete')}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</Flex>
			<Slider
				onValueChange={([value]) => setValue(`${value}%`, true)}
				value={[weightValueInt]}
			/>
			<p
				style={{
					opacity: 0.7,
					fontWeight: '700',
					fontSize: '0.8rem',
					textAlign: 'center',
				}}
			>
				{t('current')} {traitPercentage}%
			</p>
		</Flex>
	)
}

function Attribute({
	id,
	onDelete,
	onAdd,
}: {
	id: string
	onDelete?: () => void
	onAdd?: () => void
}) {
	const { address } = useAccount()
	const { t } = useTranslation()
	const { projectId } = useParams()
	const { getFieldProps } = useFormikContext()

	const [{ value: traits }, , { setValue }] = useField(
		`projects.${projectId}.attributes.${id}.traits`,
	)
	const [{ value: showInMetadata }, , { setValue: setShowInMetadata }] =
		useField(`projects.${projectId}.attributes.${id}.showInMetadata`)

	return (
		<Fragment>
			<Flex justifyContent="space-between" alignItems="center">
				<div style={{ gap: 8, display: 'flex', alignItems: 'center' }}>
					<input
						style={{ fontSize: '1.5rem' }}
						type="text"
						{...getFieldProps(`projects.${projectId}.attributes.${id}.name`)}
					/>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button style={{ width: 40, height: 40, padding: 0 }}>
								<MoreHorizontal size={16} />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent sideOffset={5}>
							<DropdownMenuItem onSelect={onAdd}>
								<Plus />
								{t('addTraits')}
							</DropdownMenuItem>
							<DropdownMenuItem
								onSelect={(event) => {
									event.preventDefault()
									setShowInMetadata(!showInMetadata)
								}}
							>
								{showInMetadata ? (
									<>
										<Eye />
										{t('shownInMetadata')}
									</>
								) : (
									<>
										<EyeOff />
										{t('hiddenInMetadata')}
									</>
								)}
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => onDelete?.()}>
								<Trash />
								{t('delete')}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</Flex>
			<Grid
				gap="var(--space--large)"
				gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
			>
				{traits?.map((traitId: string) => (
					<Trait
						key={traitId}
						address={address!}
						project={projectId!}
						onDelete={() =>
							setValue(
								traits.filter((t: string) => t !== traitId),
								true,
							)
						}
						id={traitId}
					/>
				))}
			</Grid>
			<hr style={{ marginTop: 'var(--space--large)' }} />
		</Fragment>
	)
}

function Attributes() {
	const { t } = useTranslation()
	const { projectId } = useParams()
	const [isAddingAttribute, setIsAddingAttribute] = useState<boolean | string>(
		false,
	)

	const { values, setValues } = useFormikContext<any>()
	const [{ value: attributes }, , { setValue }] = useField(
		`projects.${projectId}.attributes`,
	)
	const [{ value: traits }] = useField(`projects.${projectId}.traits`)
	const hasTraits = Object.keys(traits ?? {})?.length > 0

	const memoAttributes = useMemo(
		() => Object.keys(attributes ?? {}),
		[attributes],
	)

	function handleUpload(assets: any) {
		setIsAddingAttribute(false)

		const attributeId =
			typeof isAddingAttribute === 'string' ? isAddingAttribute : nanoid()
		const existingAttribute =
			values.projects[projectId!].attributes[attributeId]

		const mappedAssets = assets.map((asset: any) => [
			asset.id,
			{
				name: asset.name,
				weight: '100%',
				showInMetadata: true,
				assetKey: asset.assetKey,
			},
		])

		const traitsKeys = mappedAssets.map((a: any) => a[0])

		setValues(
			{
				...values,
				projects: {
					...values.projects,
					[projectId!]: {
						...values.projects[projectId!],
						traits: {
							...values.projects[projectId!].traits,
							...Object.fromEntries(mappedAssets),
						},
						attributes: {
							...values.projects[projectId!].attributes,
							[attributeId]: {
								// eslint-disable-next-line no-magic-numbers
								name: existingAttribute?.name ?? `New attribute ${nanoid(4)}`,
								showInMetadata: existingAttribute?.showInMetadata ?? true,
								blendType: existingAttribute?.blendType ?? BlendMode.normal,
								weight: existingAttribute?.weight ?? '100%',
								traits: [...(existingAttribute?.traits ?? []), ...traitsKeys],
							},
						},
					},
				},
			},
			true,
		)
	}

	if (!hasTraits) {
		return <Upload />
	}

	return (
		<>
			{isAddingAttribute && (
				<UploadDialog
					onClose={() => setIsAddingAttribute(false)}
					onUpload={handleUpload}
					isMultiple
				/>
			)}
			<Flex
				marginBottom="var(--space--large)"
				justifyContent="space-between"
				alignItems="center"
			>
				<h2 style={{ margin: 0 }}>{t('attributes')}</h2>
				<Button onClick={() => setIsAddingAttribute(true)}>
					{t('addAttribute')}
					<Icon as={PlusCircle} />
				</Button>
			</Flex>
			<Grid gap="var(--space--medium)">
				{memoAttributes.map((key: string) => (
					<Attribute
						key={key}
						id={key}
						onAdd={() => setIsAddingAttribute(key)}
						onDelete={() => {
							// eslint-disable-next-line @typescript-eslint/no-unused-vars
							const { [key]: _, ...rest } = attributes
							setValue(rest, true)
						}}
					/>
				))}
			</Grid>
		</>
	)
}

export default Attributes
