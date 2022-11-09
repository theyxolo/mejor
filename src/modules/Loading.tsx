import Spinner from 'components/Spinner'
import { Main as StyledMain } from 'GlobalStyled'

function Loading({ center, message }: { center?: boolean; message?: string }) {
	return (
		<StyledMain center={center}>
			<Spinner />
			{Boolean(message) && (
				<p style={{ fontWeight: '700', textAlign: 'center', opacity: 0.7 }}>
					{message}
				</p>
			)}
		</StyledMain>
	)
}

export default Loading
