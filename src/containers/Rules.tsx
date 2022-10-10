/* eslint-disable jsx-a11y/label-has-associated-control */
import { useField } from 'formik'
import { useTranslation } from 'react-i18next'
import { ChevronDown, MinusCircle, XCircle } from 'react-feather'
import styled from 'styled-components/macro'
import { useParams } from 'react-router'
import { useAccount } from 'wagmi'

import Button from 'components/Button'
import { Flex, Grid } from 'components/system'
import { Attribute, Project, Rule } from 'lib/types'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectIcon,
	SelectItem,
	SelectItemText,
	SelectLabel,
	SelectTrigger,
	SelectValue,
	SelectViewport,
} from 'components/Select'
import { getAssetUrl } from 'lib'

const TraitContent = styled.div`
	display: flex;
	width: 100%;
	font-size: 1rem;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	gap: 8;
`

const TraitImage = styled.img`
	width: 35px;
	height: 35px;
	border-radius: 8px;
	border: 1px solid #333;
`

function Rules() {
	const { t } = useTranslation()
	const { projectId } = useParams()
	const { address } = useAccount()

	const [{ value }, , { setValue }] = useField<Project['rules']>(
		`projects.${projectId}.rules`,
	)
	const [{ value: traits }] = useField<Project['traits']>(
		`projects.${projectId}.traits`,
	)
	const [{ value: attributes }] = useField<Attribute[]>(
		`projects.${projectId}.attributes`,
	)

	function handleAddRule() {
		setValue([...value, [[], Rule.DoesNotMixWith, []]] as any)
	}

	function handleSelectChange(
		changeValue: string,
		index: number,
		position: 'first' | 'rule' | 'last',
	) {
		setValue(
			value.map((rule, i) => {
				if (i === index) {
					if (position === 'first') {
						return [changeValue, rule[1], rule[2]]
					}
					if (position === 'rule') {
						return [rule[0], changeValue, rule[2]]
					}

					return [rule[0], rule[1], changeValue]
				}

				return rule
			}) as any,
			true,
		)
	}

	function handleRemoveRule(index: number) {
		setValue(value.filter((_, i) => i !== index) as any, true)
	}

	return (
		<>
			<Flex alignItems="center" justifyContent="space-between">
				<h2 style={{ margin: 0 }}>{t('rules')}</h2>
				<Button onClick={handleAddRule}>{t('addRule')}</Button>
			</Flex>

			<Grid
				marginTop="var(--space--large)"
				gridTemplateColumns="1fr 1fr 1fr auto"
				gap="var(--space--medium)"
			>
				{value.map((_, index) => (
					<>
						<Select
							onValueChange={(value) =>
								handleSelectChange(value, index, 'first')
							}
							value={value[index][0]}
						>
							<SelectTrigger aria-label="Food">
								<SelectValue placeholder="Select a fruit…" />
								<SelectIcon>
									<ChevronDown />
								</SelectIcon>
							</SelectTrigger>
							<SelectContent>
								<SelectViewport>
									{Object.entries(attributes).map(
										([key, { name, traits: traitKeys }]) => (
											<SelectGroup key={key}>
												<SelectLabel>{name}</SelectLabel>
												{traitKeys.map((traitKey) => (
													<SelectItem key={traitKey} value={traitKey}>
														<SelectItemText asChild>
															<TraitContent>
																{traits[traitKey]?.name ?? 'unknown'}
																<TraitImage
																	alt=""
																	src={getAssetUrl(traits[traitKey].assetKey, {
																		project: projectId!,
																		address: address!,
																	})}
																/>
															</TraitContent>
														</SelectItemText>
													</SelectItem>
												))}
											</SelectGroup>
										),
									)}
								</SelectViewport>
							</SelectContent>
						</Select>

						<Select
							onValueChange={(value) =>
								handleSelectChange(value, index, 'rule')
							}
							value={value[index][1]}
						>
							<SelectTrigger aria-label="Food">
								<SelectValue placeholder="Select a fruit…" />
								<SelectIcon>
									<ChevronDown />
								</SelectIcon>
							</SelectTrigger>
							<SelectContent>
								<SelectViewport>
									{Object.entries(Rule).map(([key, value]) => (
										<SelectItem key={key} value={value}>
											<SelectItemText asChild>
												<Flex gap="var(--space--small)" alignItems="center">
													<XCircle />
													{t(`rules.${value}`)}
												</Flex>
											</SelectItemText>
										</SelectItem>
									))}
								</SelectViewport>
							</SelectContent>
						</Select>

						<Select
							onValueChange={(value) =>
								handleSelectChange(value, index, 'last')
							}
							value={value[index][2]}
						>
							<SelectTrigger aria-label="Food">
								<SelectValue placeholder="Select a fruit…" />
								<SelectIcon>
									<ChevronDown />
								</SelectIcon>
							</SelectTrigger>
							<SelectContent>
								<SelectViewport>
									{Object.entries(attributes).map(
										([key, { name, traits: traitKeys }]) => (
											<SelectGroup key={key}>
												<SelectLabel>{name}</SelectLabel>
												{traitKeys.map((traitKey) => (
													<SelectItem key={traitKey} value={traitKey}>
														<SelectItemText asChild>
															<TraitContent>
																{traits[traitKey]?.name ?? 'unknown'}
																<TraitImage
																	alt=""
																	src={getAssetUrl(traits[traitKey].assetKey, {
																		project: projectId!,
																		address: address!,
																	})}
																/>
															</TraitContent>
														</SelectItemText>
													</SelectItem>
												))}
											</SelectGroup>
										),
									)}
								</SelectViewport>
							</SelectContent>
						</Select>

						<button
							style={{ backgroundColor: 'transparent', color: 'white' }}
							onClick={() => handleRemoveRule(index)}
						>
							<MinusCircle strokeWidth={3} />
						</button>
					</>
				))}
			</Grid>
		</>
	)
}

export default Rules
