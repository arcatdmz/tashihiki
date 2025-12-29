// TypeScript declaration for CSS modules
// This allows importing CSS Modules in TS/TSX files

declare module '*.module.css' {
	const classes: { [key: string]: string }
	export default classes
}
