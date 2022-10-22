function Empty() {
	return (
		<div
			style={{
				flex: 1,
				width: '100%',
				height: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				gap: 'var(--space--large)',
				opacity: 0.5,
			}}
		>
			<h3>Nothing here</h3>
			<p>Go ahead and create a new resource</p>
		</div>
	)
}

export default Empty
