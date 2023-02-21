import styled from 'styled-components/macro'

export const NavList = styled.ul`
	display: flex;
	justify-content: center;
	height: 100%;

	a {
		opacity: 0.7;
	}
`

export const Header = styled.div`
	display: grid;
	justify-content: space-between;
	align-items: center;
	padding: 0 10px;
	grid-template-columns: repeat(2, 1fr);
	border-bottom: 1px solid var(--colors--border);

	a {
		font-weight: 700;
		display: inline-flex;
		align-items: center;
		text-decoration: none;
		color: inherit;
		min-height: 40px;
		height: 100%;
		position: relative;

		span {
			gap: 8px;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: var(--space--medium) var(--space--large);
			border-radius: 16px;
			overflow: hidden;

			&:hover {
				background-color: var(--colors--overlay_alternate);
				opacity: 1;
			}
		}

		&[aria-current='page'] {
			opacity: 1;

			span:after {
				content: '';
				position: absolute;
				bottom: 0;
				left: 0;
				height: 2px;
				width: 100%;
				background-color: #333;
			}
		}
	}

	&:nth-child(2) {
		align-content: center;
	}

	&:nth-child(3) {
		align-content: flex-end;
	}
`
