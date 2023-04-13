export default function is_server() {
	return !(typeof window !== 'undefined' && window.document)
}
