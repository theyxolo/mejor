function TextInput({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label htmlFor="">
      <b>{label}</b>
      <input {...props} type="text" />
    </label>
  )
}

export default TextInput
