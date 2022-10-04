import styled from 'styled-components/macro'

const Button = styled.button<{ primary?: boolean }>`
	text-decoration: none;
	background-color: ${({ primary }) => (primary ? '#9d74eb' : '#fff')};
	padding: 5px 20px;
	border: none;
	color: ${({ primary }) => (primary ? '#fff' : '#000')};
	box-shadow: ${({ primary }) =>
		primary ? '0 0 9px rgb(157, 116, 235,0.75)' : ''};
	border-radius: 20px;
	font-weight: 800;
	min-height: 30px;

	display: flex;
	justify-content: center;
	align-items: center;

	font-family: 'SF Pro Rounded', -apple-system, BlinkMacSystemFont, 'Segoe UI',
		'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
		'Helvetica Neue', sans-serif;

	&:hover {
		${({ primary }) => (primary ? 'background-color: #7B5AB8;' : '')}
	}

	&[disabled] {
		opacity: 0.5;
	}
`

export const Icon = styled.svg<{ noMargin?: boolean }>`
	margin-left: ${({ noMargin = false }) => (noMargin ? '' : '4px')};
	size: 20px;
	width: 20px;
	height: 20px;
	stroke-width: 2.5px;
`

export default Button
