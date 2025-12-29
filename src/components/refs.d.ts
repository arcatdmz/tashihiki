// CSSモジュールのTypeScript宣言ファイル
// TS/TSXファイルでCSSモジュールをインポートできるようにする

declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}
