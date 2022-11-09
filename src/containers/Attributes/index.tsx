/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Fragment, useMemo, useState } from 'react'
import {
	Eye,
	Plus,
	Trash,
	MoreHorizontal,
	PlusCircle,
	ChevronRight,
	Check,
	Droplet,
	EyeOff,
	RotateCcw,
	RefreshCw,
	Download,
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

import {
	useAttributeKeys,
	useField,
	useFieldProps,
	useFieldValue,
	useSetFieldsValue,
	useSetFieldValue,
	useTraitKeys,
} from 'lib/recoil'
import { getAssetUrl } from 'lib'
import { BlendMode, MICRO_ID } from 'lib/constants'
import { Attribute, Project } from 'lib/types'

import { AssetImg } from './styled'

function TraitItem({
	id,
	project,
	address,
	onDelete,
	attributeId,
	onReplace,
}: {
	id: string
	project: string
	address: string
	onDelete?: () => void
	attributeId: string
	onReplace?: (traitId: string) => void
}) {
	const { t } = useTranslation()
	const setFieldsValue = useSetFieldsValue()

	const combinations = useFieldValue<string[][]>('export.combinations')
	const attributes = useFieldValue<Project['attributes']>('attributes')
	const [weightValue, setValue] = useField<string>(`traits.${id}.weight`)
	const assetKey = useFieldValue<string>(`traits.${id}.assetKey`)
	const [showInMetadata, setShowInMetadata] = useField<boolean>(
		`traits.${id}.showInMetadata`,
	)
	const traitNameProps = useFieldProps<string>(`traits.${id}.name`)
	const weightValueInt = parseInt(weightValue?.replace('%', ''))

	const [traitPercentage] = useMemo(() => {
		const totalCount = combinations?.length
		const appearancesCount = combinations
			?.flat()
			.filter((trait: string) => trait.includes(id)).length

		return [
			// eslint-disable-next-line no-magic-numbers
			Math.round(((appearancesCount ?? 0) / (totalCount ?? 0)) * 1000) / 10,
			appearancesCount,
		]
	}, [id, combinations])

	function handleChangeAttribute({
		trait,
		from,
		to,
	}: {
		trait: string
		from: string
		to: string
	}) {
		setFieldsValue(
			`attributes.${to}.traits`,
			attributes[to].traits.concat(trait),
		)
		setFieldsValue(
			`attributes.${from}.traits`,
			attributes[from].traits.filter((t: string) => t !== trait),
		)
	}

	return (
		<Flex flexDirection="column" gap="var(--space--medium)">
			{assetKey ? (
				<AssetImg src={getAssetUrl(assetKey, { address, project })} />
			) : null}
			<Flex gap="var(--space--small)" style={{ width: '100%' }}>
				<input
					type="text"
					style={{ width: '100%', display: 'block' }}
					{...traitNameProps}
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
						<DropdownMenuItem
							disabled={!onReplace}
							onSelect={() => onReplace?.(id)}
						>
							<RotateCcw />
							{t('replace')}
						</DropdownMenuItem>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<RefreshCw />
								{t('move')}
								<RightSlot>
									<ChevronRight />
								</RightSlot>
							</DropdownMenuSubTrigger>
							<DropdownMenuSubContent sideOffset={2} alignOffset={-5}>
								{Object.entries(attributes ?? {}).map(([key, value]: any) => (
									<DropdownMenuItem
										onSelect={() =>
											handleChangeAttribute({
												trait: id,
												from: attributeId,
												to: key,
											})
										}
										key={key}
									>
										{value?.name}
									</DropdownMenuItem>
								))}
							</DropdownMenuSubContent>
						</DropdownMenuSub>
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
							as="a"
							href={getAssetUrl(assetKey, { address, project })}
							download
						>
							<Download />
							{t('download')}
						</DropdownMenuItem>
						<DropdownMenuItem
							onSelect={() => {
								onDelete?.()
								setFieldsValue(`traits.${id}`, undefined)
							}}
						>
							<Trash />
							{t('delete')}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</Flex>
			<Slider
				onValueChange={([value]) => setValue(`${value}%`)}
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

function AttributeHeader({ id }: { id: string }) {
	const { t } = useTranslation()
	const nameProps = useFieldProps<string>(`attributes.${id}.name`)
	const [name, setName] = useState<string>(nameProps.value)
	const aliasProps = useFieldProps<string>(`attributes.${id}.alias`)

	return (
		<div
			style={{
				gap: 8,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
			}}
		>
			<input
				style={{ fontSize: '1.5rem' }}
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
				onBlur={(e) => nameProps.onChange(e)}
			/>
			<label htmlFor="">
				<b>{t('alias')}</b>
				<input
					type="text"
					style={{ width: '100%', display: 'block' }}
					{...aliasProps}
				/>
			</label>
		</div>
	)
}

function AttributeItem({
	id,
	onAdd,
	onDelete,
	onReplace,
}: {
	id: string
	onAdd?: () => void
	onDelete?: () => void
	onReplace?: ({
		attributeId,
		traitId,
	}: {
		attributeId: string
		traitId: string
	}) => void
}) {
	const { t } = useTranslation()
	const { address } = useAccount()
	const { projectId } = useParams()

	const [traits, setTraits] = useField<Attribute['traits']>(
		`attributes.${id}.traits`,
	)
	const [showInMetadata, setShowInMetadata] = useField(
		`attributes.${id}.showInMetadata`,
	)

	return (
		<Fragment>
			<Flex justifyContent="space-between" alignItems="center">
				<AttributeHeader id={id} />
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
			</Flex>
			<Grid
				gap="var(--space--large)"
				gridTemplateColumns="repeat(auto-fill, minmax(150px, 1fr))"
			>
				{traits?.map((traitId: string) => (
					<TraitItem
						key={traitId}
						address={address!}
						project={projectId!}
						onDelete={() =>
							setTraits(traits.filter((t: string) => t !== traitId))
						}
						onReplace={(traitId) => onReplace?.({ traitId, attributeId: id })}
						attributeId={id}
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

	const [isAddingAttribute, setIsAddingAttribute] = useState<
		boolean | { attributeId: string; traitId?: string }
	>(false)

	const setAttributes = useSetFieldValue('attributes')
	const setTraits = useSetFieldValue('traits')
	const traitKeys = useTraitKeys()
	const attributeKeys = useAttributeKeys()

	const hasTraits = traitKeys?.length > 0

	function handleUpload(assets: any) {
		setIsAddingAttribute(false)

		const attributeId =
			typeof isAddingAttribute === 'object'
				? isAddingAttribute.attributeId
				: nanoid(MICRO_ID)

		const replacedTrait =
			typeof isAddingAttribute === 'object' && isAddingAttribute?.traitId

		setAttributes((prev: any) => {
			const existingAttribute = prev[attributeId]
			const traitsKeys = assets.map((asset: any) => asset.id)
			console.log({ existingAttribute, traitsKeys })

			const existingTraits =
				existingAttribute?.traits?.filter(
					(traitId: string) => traitId !== replacedTrait,
				) ?? []

			return {
				...prev,
				[attributeId]: {
					name: existingAttribute?.name ?? `New attribute ${nanoid(MICRO_ID)}`,
					showInMetadata: existingAttribute?.showInMetadata ?? true,
					blendMode: existingAttribute?.blendMode ?? BlendMode.normal,
					weight: existingAttribute?.weight ?? '100%',
					traits: [...(existingTraits ?? []), ...traitsKeys],
				},
			}
		})

		setTraits((prev: any) => {
			if (replacedTrait) {
				console.log('NEW', assets[0])
				console.log({ replacedTrait })

				const { [isAddingAttribute?.traitId!]: _, ...rest } = prev

				console.log({
					isAddingAttribute,
					prev,
					assets,
				})
				return {
					...rest,
					[assets[0].id!]: {
						...prev[isAddingAttribute?.traitId!],
						assetKey: assets[0].assetKey,
					},
				}
			} else {
				const mappedAssets = assets.map((asset: any) => [
					asset.id,
					{
						name: asset.name,
						weight: '100%',
						showInMetadata: true,
						assetKey: asset.assetKey,
					},
				])

				return {
					...prev,
					...Object.fromEntries(mappedAssets),
				}
			}
		})
	}

	if (!hasTraits) {
		return <Upload />
	}

	return (
		<>
			{isAddingAttribute ? (
				<UploadDialog
					onClose={() => setIsAddingAttribute(false)}
					onUpload={handleUpload}
					isMultiple={!(isAddingAttribute as any).traitId}
				/>
			) : null}
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
				{attributeKeys?.map((key: string) => (
					<AttributeItem
						key={key}
						id={key}
						onAdd={() => setIsAddingAttribute({ attributeId: key })}
						onReplace={({ attributeId, traitId }) =>
							setIsAddingAttribute({ attributeId, traitId })
						}
						onDelete={() => {
							// eslint-disable-next-line @typescript-eslint/no-unused-vars
							setAttributes(({ [key]: _, ...rest }) => rest)
						}}
					/>
				))}
			</Grid>
		</>
	)
}

export default Attributes
