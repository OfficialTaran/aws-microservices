const displayDate = ( date_string ) => {
  const date = new Date(date_string)
  return date.toLocaleString()
}

export { displayDate }