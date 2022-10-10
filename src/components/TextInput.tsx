function TextInput({
	label,
	...props
}: { label?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
	if (!label) {
		return <input {...props} type="text" />
	}

	return (
		<label htmlFor="">
			<b>{label}</b>
			<input {...props} type="text" />
		</label>
	)
}

export default TextInput
