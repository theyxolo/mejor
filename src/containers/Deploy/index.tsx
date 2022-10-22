import { useState } from 'react'
import { useMutation, useSigner } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { useField, useFormik } from 'formik'
import { useParams } from 'react-router'
import * as ethers from 'ethers'

import Button from 'components/Button'

import abi from 'lib/erc721x/abi.json'
import bytecode from 'lib/erc721x/bytecode.json'
import TextInput from 'components/TextInput'
import { Main } from 'GlobalStyled'
import { Flex, Grid } from 'components/system'

function Deploy() {
	const { t } = useTranslation()
	const [factory, setFactory] = useState<ethers.ContractFactory | null>(null)

	const { projectId } = useParams()
	const [{ value: name }] = useField(`projects.${projectId}.name`)
	const [{ value: maxSupply }] = useField(`projects.${projectId}.count`)
	const [{ value: symbol }] = useField(`projects.${projectId}.symbol`)

	const formik = useFormik({
		initialValues: {
			arguments: '',
			address: '',
			publicMintPrice: '0.02',
			privateMintPrice: '0.01',
			maxPerTx: '10',
			maxPerWalletPrivateMint: '2',
			defaultRoyalty: '800',
			baseURI: 'https://develop.theyxolo.art/api/tokens/',
			contractURI: 'https://develop.theyxolo.art/api/contract.json',
		},
		onSubmit() {
			deploy()
		},
	})

	const { mutate: deploy } = useMutation(async () => {
		if (!factory) return Promise.reject()

		const contract = await factory.deploy(
			...[
				name,
				symbol,
				ethers.BigNumber.from(maxSupply),
				ethers.utils.parseEther(formik.values.publicMintPrice),
				ethers.utils.parseEther(formik.values.privateMintPrice),
				ethers.BigNumber.from(formik.values.maxPerTx),
				ethers.BigNumber.from(formik.values.maxPerWalletPrivateMint),
				ethers.BigNumber.from(formik.values.defaultRoyalty),
				formik.values.baseURI,
				formik.values.contractURI,
			],
		)

		formik.setFieldValue('arguments', contract.deployTransaction.data)
		formik.setFieldValue('address', contract.address)

		await contract.deployTransaction.wait()

		return contract
	})

	useSigner({
		onSuccess(signer) {
			setFactory(new ethers.ContractFactory(abi, bytecode, signer as any))
		},
	})

	return (
		<Main
			style={{
				padding: 'var(--space--large)',
			}}
		>
			<h2>{t('screens.deploy.title')}</h2>
			<p style={{ marginBottom: 'var(--space--xlarge)' }}>
				{t('screens.deploy.description')}
			</p>
			<form
				onSubmit={formik.handleSubmit}
				style={{ marginBottom: 'var(--space--xlarge)' }}
			>
				<Grid
					gap="var(--space--large)"
					style={{
						gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
						marginBottom: 'var(--space--large)',
					}}
				>
					<TextInput label={t('name')} value={name} readOnly />
					<TextInput label={t('symbol')} value={symbol} readOnly />
					<TextInput label={t('maxSupply')} value={maxSupply} readOnly />
				</Grid>
				<Grid
					gap="var(--space--large)"
					style={{
						gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
						marginBottom: 'var(--space--large)',
					}}
				>
					<TextInput
						label={t('publicMintPrice')}
						{...formik.getFieldProps('publicMintPrice')}
						type="number"
					/>
					<TextInput
						label={t('privateMintPrice')}
						{...formik.getFieldProps('privateMintPrice')}
						type="number"
					/>
					<TextInput
						label={t('maxPerTx')}
						{...formik.getFieldProps('maxPerTx')}
						type="number"
					/>
					<TextInput
						label={t('maxPerWalletPrivateMint')}
						{...formik.getFieldProps('maxPerWalletPrivateMint')}
						type="number"
					/>
					<TextInput
						label={t('defaultRoyaltyBasisPoints')}
						{...formik.getFieldProps('defaultRoyalty')}
						type="number"
					/>
					<TextInput
						label={t('baseURI')}
						{...formik.getFieldProps('baseURI')}
					/>
					{/* <TextInput
						label={t('contractURI')}
						{...formik.getFieldProps('contractURI')}
					/> */}
				</Grid>
				<Flex justifyContent="center">
					<Button onClick={() => deploy()} type="submit">
						{t('deploy')}
					</Button>
				</Flex>
			</form>

			<h3>{t('result')}</h3>
			<TextInput
				label={t('arguments')}
				{...formik.getFieldProps('arguments')}
				readOnly
				multiline
			/>
			<TextInput
				label={t('address')}
				{...formik.getFieldProps('address')}
				readOnly
			/>
		</Main>
	)
}

export default Deploy
