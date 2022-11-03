/* eslint-disable jsx-a11y/label-has-associated-control */
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, MinusCircle, XCircle } from 'react-feather'
import styled from 'styled-components/macro'
import { useParams } from 'react-router'
import { useAccount } from 'wagmi'

import Button from 'components/Button'
import { Flex, Grid } from 'components/system'
import { Attribute, Project, Rule } from 'lib/types'
import { useFieldValue, useField } from 'lib/recoil'
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
import Empty from 'modules/Empty'

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

	const [rules, setRules] = useField<[string, Rule, string][]>('rules')
	const traits = useFieldValue<Project['traits']>('traits')
	const attributes = useFieldValue<Attribute[]>('attributes')

	function handleAddRule() {
		setRules((prev) => [...prev, ['', Rule.DoesNotMixWith, '']])
	}

	function handleSelectChange(
		changeValue: Rule,
		index: number,
		position: 'first' | 'rule' | 'last',
	) {
		setRules((rules) =>
			rules.map((rule, i) => {
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
			}),
		)
	}

	function handleRemoveRule(index: number) {
		setRules((rules) => rules.filter((_, i) => i !== index) as any)
	}

	return (
		<>
			<Flex alignItems="center" justifyContent="space-between">
				<h2 style={{ margin: 0 }}>{t('rules')}</h2>
				<Button onClick={handleAddRule}>{t('addRule')}</Button>
			</Flex>

			{rules.length > 0 ? (
				<Grid
					marginTop="var(--space--large)"
					gridTemplateColumns="1fr 1fr 1fr auto"
					gap="var(--space--medium)"
				>
					{rules.map((_, index) => (
						<Fragment key={index}>
							<Select
								onValueChange={(rules: Rule) =>
									handleSelectChange(rules, index, 'first')
								}
								value={rules[index][0]}
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
																		src={getAssetUrl(
																			traits[traitKey].assetKey,
																			{
																				project: projectId!,
																				address: address!,
																			},
																		)}
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
								onValueChange={(rules: Rule) =>
									handleSelectChange(rules, index, 'rule')
								}
								value={rules[index][1]}
							>
								<SelectTrigger aria-label="Food">
									<SelectValue placeholder="Select a fruit…" />
									<SelectIcon>
										<ChevronDown />
									</SelectIcon>
								</SelectTrigger>
								<SelectContent>
									<SelectViewport>
										{Object.entries(Rule).map(([key, rules]) => (
											<SelectItem key={key} value={rules}>
												<SelectItemText asChild>
													<Flex gap="var(--space--small)" alignItems="center">
														<XCircle
															style={{
																color:
																	rules === Rule.OnlyMixesWith
																		? 'green'
																		: 'red',
															}}
														/>
														{t(`rules.${rules}`)}
													</Flex>
												</SelectItemText>
											</SelectItem>
										))}
									</SelectViewport>
								</SelectContent>
							</Select>

							<Select
								onValueChange={(rules: Rule) =>
									handleSelectChange(rules, index, 'last')
								}
								value={rules[index][2]}
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
											([key, { name, traits: traitKeys }]: any) => (
												<SelectGroup key={key}>
													<SelectLabel>{name}</SelectLabel>
													{traitKeys.map((traitKey: any) => (
														<SelectItem key={traitKey} value={traitKey}>
															<SelectItemText asChild>
																<TraitContent>
																	<>
																		{traits[traitKey]?.name ?? 'unknown'}
																		<TraitImage
																			alt=""
																			src={getAssetUrl(
																				traits[traitKey].assetKey,
																				{
																					project: projectId!,
																					address: address!,
																				},
																			)}
																		/>
																	</>
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
								style={{
									backgroundColor: 'transparent',
									color: 'var(--colors--text)',
								}}
								onClick={() => handleRemoveRule(index)}
							>
								<MinusCircle strokeWidth={3} />
							</button>
						</Fragment>
					))}
				</Grid>
			) : (
				<Empty />
			)}
		</>
	)
}

export default Rules
