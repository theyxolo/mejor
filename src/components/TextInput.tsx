function TextInput({
	label,
	style,
	...props
}: { label?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
	if (!label) {
		return <input {...props} type="text" />
	}

	return (
		<label style={style} htmlFor="">
			<b>{label}</b>
			<input {...props} type="text" />
		</label>
	)
}

export default TextInput
