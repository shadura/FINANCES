export default (text?: string | null) => {
	if (!text) return ''

	const urlPattern = /(\bhttps?:\/\/[^\s]+)/g
	return text.replace(urlPattern, (url) => `<a href="${url}" target="_blank" class="underline">link</a>`)
}
