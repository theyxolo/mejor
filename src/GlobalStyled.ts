import styled, { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
	:root {
		--font--system: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
			Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

		--colors--background: #111;
		--colors--background_transparent: rgba(16, 16, 16, 0.9);
		--colors--overlay: rgba(0, 0, 0, 0.3);
		--colors--overlay_alternate: rgba(255, 255, 255, 0.1);
		--colors--background_alternate: #222;
		--colors--background_opposite: #fff;
		--colors--border: #393939;
		--colors--border_alternate: #222;
		--colors--text: #fff;
		--colors--text_opposite: #000;

		/* Light mode */
		@media (prefers-color-scheme: light) {
			--colors--background: #fff;
			--colors--background_transparent: rgba(255, 255, 255, 0.9);
			--colors--overlay: rgba(255, 255, 255, 0.3);
			--colors--overlay_alternate: rgba(0, 0, 0, 0.1);
			--colors--background_alternate: #f2f2f2;
			--colors--background_opposite: #111;
			--colors--border: #333;
			--colors--border_alternate: #f2f2f2;
			--colors--text: #000;
			--colors--text_opposite: #fff;
		}
		

		--colors--pina: #F3D034;
		--colors--mandarina: #ef9637;
		--colors--pitaya: #fa63b0;
		--colors--lichi: #fca9d3;
		--colors--manzana: #e33535;
		--colors--chicle: #73ddfd;
		--colors--uva: #be9af8;
		--colors--verde: #c2eb42;
		--colors--tint: #9d74eb;

		--border_radius--small: 16px;
		--border_radius--medium: 22px;
		--border_radius--large: 32px;
		--border_radius--xlarge: 64px;

		--space--small: 4px;
		--space--medium: 8px;
		--space--large: 16px;
		--space--xlarge: 32px;
		--space--xxlarge: 64px;

		--size--top_nav: 56px;

		--image--transparent: linear-gradient(
				45deg,
				var(--colors--background_alternate) 25%,
				transparent 0,
				transparent 75%,
				var(--colors--background_alternate) 0
			),
			linear-gradient(45deg, var(--colors--background_alternate) 25%, transparent 0, transparent 75%, var(--colors--background_alternate) 0);
	}

	* {
		box-sizing: border-box;
	}

	@font-face {
		font-family: "Unbounded";
		src: url("/fonts/Unbounded/Unbounded-VariableFont_wght.ttf");
		font-weight: 125 950;
		font-stretch: 75% 125%;
		font-style: normal;
	}

	html,
	body {
		margin: 0;
		font-family: var(--font--system);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;

		font-synthesis: none;
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		-webkit-text-size-adjust: 100%;

		color: var(--colors--text);
		background-color: var(--colors--background);
	}

	h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	button {
		font-weight: 900;
		font-family: 'Unbounded', system-ui, Helvetica Neue, Arial, Helvetica, sans-serif;
	}

	button {
		border: none;
		appearance: none;
	}

	html,
	body,
	#root,
	[data-rk] {
		min-height: 100vh;
	}

	#root [data-rk] {
		display: grid;
		grid-template-rows: auto 1fr;
		max-height: 100vh;
		max-height: 100dvh;
	}

	label {
		display: flex;
		flex-direction: column;
	}
	label b {
		font-weight: 800;
		width: 100%;
	}

	a {
		color: inherit;
		text-decoration: none;
	}

	p b {
		font-weight: 800;
	}

	input,
	textarea,
	select {
		min-height: 30px;
		padding: 5px 10px;
		border: 2px solid var(--colors--border);
		border-radius: 10px;
		width: auto;
		min-width: 0;
		max-width: 100%;
		display: inline-block;
		background-color: transparent;
		color: inherit;
		font-size: 1rem;
		appearance: none;
	}

	textarea,
	input[type="text"],
	input[type="email"],
	input[type="number"] {
		font-family: var(--font--system);

		&[readonly] {
			border-color: var(--colors--border_alternate);
		}
		&:focus {
			outline: none;
			border-color: var(--colors--pina);
		}
	}

	input[type="checkbox"] {
		appearance: none;
		border: 2px solid var(--colors--border);
		border-radius: 4px;
		width: 20px;
		height: 20px;
		display: inline-block;
		vertical-align: middle;
		margin-right: 10px;
		&:checked {
			background-color: var(--colors--pina);
			border-color: var(--colors--pina);
		}
		&:focus {
			outline: none;
			border-color: var(--colors--pina);
		}
	}
`

export const Main = styled.main<{ withPadding?: boolean; center?: boolean }>`
	height: 100%;
	width: 100%;
	overflow: scroll;
	min-height: 0;
	padding: ${({ withPadding }) => (withPadding ? '10px' : '0')};

	${({ center }) =>
		center &&
		`
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 10px;
	`}

	h2 {
		font-weight: 900;
		font-size: 2rem;
		margin: 0 0 16px;
	}

	h3 {
		font-weight: 900;
		font-size: 1.5rem;
		margin-bottom: 8px;
	}

	hr {
		border: none;
		border-top: 2px solid var(--colors--border);
		margin: 20px 0;
	}
`
