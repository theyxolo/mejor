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
		--colors--border: #444;
		--colors--border_alternate: #222;
		--colors--text: #fff;
		--colors--text_opposite: #000;

		--font_size--larger: 1.5rem;
		--font_size--large: 1.2rem;
		--font_size--regular: 1rem;
		--font_size--small: 0.9rem;


		--borders--text_input: 1px solid var(--colors--border);

		/* Light mode */
		@media (prefers-color-scheme: light) {
			--colors--background: #fff;
			--colors--background_transparent: rgba(255, 255, 255, 0.9);
			--colors--overlay: rgba(255, 255, 255, 0.3);
			--colors--overlay_alternate: rgba(0, 0, 0, 0.1);
			--colors--background_alternate: #f6f6f6;
			--colors--background_opposite: #111;
			--colors--border: #e9e9e9;
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
	body,
	input,
	textarea {
		margin: 0;
		font-family: var(--font--system);
		font-size: var(--font_size--regular);
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
	h3 {
		font-family: 'Unbounded', system-ui, Helvetica Neue, Arial, Helvetica, sans-serif;
	}

	h1 {
		font-size: var(--font_size--large);
		font-weight: 900;
	}

	button {
		border: none;
		appearance: none;
		font-size: var(--font_size--regular);
		font-weight: 700;
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
		width: 100%;
		font-weight: 600;
	}

	a {
		color: inherit;
		text-decoration: none;
	}

 

	input,
	textarea,
	select {
		min-height: 30px;
		padding: 5px 10px;
		border: var(--borders--text_input);
		border-radius: 10px;
		width: auto;
		min-width: 0;
		max-width: 100%;
		display: inline-block;
		background-color: transparent;
		color: inherit;
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
	background-color: var(--colors--background_alternate);

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
		margin: 0 0 16px;
	}

	h3 {
		font-size: var(--font_size--large);
		margin-bottom: 8px;
	}

	hr {
		border: none;
		border-top: 2px solid var(--colors--border);
		margin: 20px 0;
	}
`
