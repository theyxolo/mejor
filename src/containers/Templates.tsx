import { useRef, Fragment, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import update from 'immutability-helper'
import { useAccount } from 'wagmi'
import styled from 'styled-components/macro'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DragHandleDots2Icon } from '@radix-ui/react-icons'
import { PlusCircle } from 'react-feather'
import type { Identifier, XYCoord } from 'dnd-core'
import { nanoid } from 'nanoid'

import TokenPreview from 'modules/TokenPreview'

import Button, { Icon } from 'components/Button'
import { Flex, Grid } from 'components/system'
import { Switch, SwitchThumb } from 'components/Switch'

import { getAssetUrl } from 'lib'
import Slider from 'components/Slider'
import {
	useField,
	useFieldProps,
	useFieldValue,
	useSetFieldValue,
} from 'lib/recoil'
import { Project, Template } from 'lib/types'
import { MICRO_ID } from 'lib/constants'

const Card = styled(Button)<{ $enabled: boolean; $isDragging: boolean }>`
	cursor: ${({ $enabled }) => ($enabled ? 'move' : 'inherit')};
	margin-bottom: var(--space--medium);
	display: flex;
	position: relative;
	background-color: var(--colors--background_alternate);
	color: var(--colors--text);
	border-radius: var(--border_radius--small);
	align-items: center;
	padding: 0 var(--space--large);
	opacity: ${({ $enabled, $isDragging }) =>
		$isDragging ? '0.5' : $enabled ? '1' : '0.7'};
`

const ImgContainer = styled.div`
	height: 50px;
	width: 50px;
	flex-shrink: 0;
	border-radius: 12px;
	border: 1px solid var(--colors--border);
	overflow: hidden;
`

const TokenName = styled.p`
	width: 100%;
	font-weight: 700;
`

interface DragItem {
	index: number
	id: string
	type: string
}

function AttributeItem({
	id,
	text,
	index,
	moveItem,
	image,
	enabled,
	onCheckedChange,
}: {
	id: string
	text: string
	index: number
	onCheckedChange: (checked: boolean, id: string) => void
	moveItem: (dragIndex: number, hoverIndex: number) => void
	image: string
	enabled: boolean
}) {
	const ref = useRef<HTMLDivElement>(null)
	const [{ handlerId }, drop] = useDrop<
		DragItem,
		void,
		{ handlerId: Identifier | null }
	>({
		accept: 'CARD',
		collect(monitor) {
			return {
				handlerId: monitor.getHandlerId(),
			}
		},
		hover(item: DragItem, monitor) {
			if (!ref.current) return

			const dragIndex = item.index
			const hoverIndex = index

			// Don't replace items with themselves
			if (dragIndex === hoverIndex) return

			// Determine rectangle on screen
			const hoverBoundingRect = ref.current?.getBoundingClientRect()

			// Get vertical middle
			const hoverMiddleY =
				// eslint-disable-next-line no-magic-numbers
				(hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

			// Determine mouse position
			const clientOffset = monitor.getClientOffset()

			// Get pixels to the top
			const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

			// Only perform the move when the mouse has crossed half of the items height
			// When dragging downwards, only move when the cursor is below 50%
			// When dragging upwards, only move when the cursor is above 50%

			// Dragging downwards
			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
				return
			}

			// Dragging upwards
			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
				return
			}

			// Time to actually perform the action
			moveItem(dragIndex, hoverIndex)

			// Note: we're mutating the monitor item here!
			// Generally it's better to avoid mutations,
			// but it's good here for the sake of performance
			// to avoid expensive index searches.
			item.index = hoverIndex
		},
	})

	const [{ isDragging }, drag] = useDrag({
		type: 'CARD',
		item: () => ({ id, index }),
		collect: (monitor: any) => ({
			isDragging: monitor.isDragging(),
		}),
	})

	drag(drop(ref))

	return (
		<Card
			as="div"
			$enabled={enabled}
			$isDragging={isDragging}
			ref={enabled ? ref : undefined}
			data-handler-id={handlerId}
		>
			<Icon
				as={DragHandleDots2Icon}
				style={{
					position: 'absolute',
					left: 'var(--space--large)',
				}}
				noMargin
			/>
			<Flex
				style={{
					width: '100%',
					paddingLeft: 'calc(var(--space--large) + var(--space--medium))',
				}}
				justifyContent="space-between"
				marginRight="var(--space--medium)"
				alignItems="center"
			>
				<TokenName>{text}</TokenName>
				<ImgContainer>
					<img
						style={{ width: '100%', height: '100%', objectFit: 'contain' }}
						src={image}
						alt=""
					/>
				</ImgContainer>
			</Flex>
			<Switch
				onCheckedChange={(checked) => onCheckedChange(checked, id)}
				checked={enabled}
			>
				<SwitchThumb />
			</Switch>
		</Card>
	)
}

function TemplateItem({
	id,
	projectId,
	address,
}: {
	address: string
	projectId: string
	id: string
}) {
	const { t } = useTranslation()

	const traits = useFieldValue<Project['traits']>('traits')
	const attributes = useFieldValue<Project['attributes']>('attributes')
	const setTemplate = useSetFieldValue<Template>(`templates.${id}`)
	const templateAttributes = useFieldValue<Template['attributes']>(
		`templates.${id}.attributes`,
	)
	const templateNameProps = useFieldProps<Template['name']>(
		`templates.${id}.name`,
	)
	const [weightValue, setWeight] = useField<Template['weight']>(
		`templates.${id}.weight`,
	)

	const weightValueInt = parseInt(weightValue?.replace('%', '') ?? '')

	const [items, setItems] = useState<string[]>(templateAttributes)

	const allItems = items.concat(
		Object.keys(attributes ?? {})
			.map((key) => key)
			.filter((key) => !items.includes?.(key)),
	)

	useEffect(() => {
		setTemplate((existing) => {
			const nextValue = { ...existing, attributes: items }

			if (JSON.stringify(nextValue) === JSON.stringify(existing)) {
				return existing
			}

			return nextValue
		})
	}, [items, setTemplate])

	const moveItem = useCallback((dragIndex: number, hoverIndex: number) => {
		setItems((prevItems: any) =>
			update(prevItems, {
				$splice: [
					[dragIndex, 1],
					[hoverIndex, 0, prevItems[dragIndex]],
				],
			}),
		)
	}, [])

	const handleCheckedChange = useCallback((checked: boolean, id: string) => {
		if (!checked) {
			setItems((prevItems: any) => {
				const index = prevItems.indexOf(id)
				if (index === -1) {
					return [...prevItems, id]
				}
				return prevItems.filter((item: string) => item !== id)
			})
		} else {
			setItems((prevItems: any) => {
				const index = prevItems.indexOf(id)
				if (index === -1) {
					return [...prevItems, id]
				}
				return prevItems.filter((item: string) => item !== id)
			})
		}
	}, [])

	const renderCard = useCallback(
		(item: any, index: number) => {
			const [traitId] = attributes[item]?.traits ?? []
			const { assetKey } = traits[traitId] ?? {}
			const enabled = items.some((key) => key === item)

			return (
				<AttributeItem
					key={item}
					id={item}
					index={index}
					moveItem={moveItem}
					enabled={enabled}
					onCheckedChange={handleCheckedChange}
					text={attributes[item]?.name}
					image={getAssetUrl(assetKey, { address, project: projectId })}
				/>
			)
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[JSON.stringify(items)],
	)

	return (
		<Flex
			width="100%"
			maxWidth="800px"
			flexDirection="column"
			gap="var(--space--medium)"
		>
			<label htmlFor="">
				<input style={{ fontSize: '1.5rem' }} {...templateNameProps} />
			</label>
			<Flex gap="var(--space--medium)">
				<div style={{ flex: 1 }}>
					<label style={{ flex: 1 }} htmlFor="">
						<b>{t('weight')}</b>
						<Slider
							onValueChange={([value]) => setWeight(`${value}%`)}
							value={[weightValueInt]}
						/>
					</label>
					<p>{t('actual')} %</p>
				</div>
			</Flex>
			<Grid gridTemplateColumns="1fr 1fr" gap="var(--space--large)">
				<DndProvider backend={HTML5Backend}>
					<div>
						{allItems.map((element, index) => renderCard(element, index))}
					</div>
				</DndProvider>
				<TokenPreview
					name=""
					hasWarning={false}
					number={0}
					projectName=""
					assets={items.map((attributeKey) => {
						const [firstTraitId] = attributes[attributeKey as any]?.traits ?? []
						const { assetKey } = traits[firstTraitId] ?? {}
						return assetKey
					})}
					address={address}
					projectId={projectId!}
				/>
			</Grid>
		</Flex>
	)
}

function Templates() {
	const { t } = useTranslation()
	const { projectId } = useParams()
	const { address } = useAccount()

	const [templates, setTemplates] = useField<Project['templates']>('templates')

	function handleAddTemplate() {
		setTemplates((prev) => ({
			...prev,
			[nanoid(MICRO_ID)]: {
				name: '',
				weight: '100%',
				showInMetadata: true,
				attributes: [],
			},
		}))
	}

	return (
		<>
			<Flex
				marginBottom="var(--space--large)"
				justifyContent="space-between"
				alignItems="center"
			>
				<h2 style={{ margin: 0 }}>{t('templates')}</h2>
				<Button onClick={handleAddTemplate}>
					{t('addTemplate')}
					<Icon as={PlusCircle} />
				</Button>
			</Flex>
			<p style={{ marginBottom: 'var(--space--large)' }}>
				{t('screens.templates.instructions')}
			</p>
			{Object.keys(templates ?? {}).map((key) => (
				<Fragment key={key}>
					<hr />
					<TemplateItem id={key} address={address!} projectId={projectId!} />
				</Fragment>
			))}
		</>
	)
}

export { AttributeItem }

export default Templates
