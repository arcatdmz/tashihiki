# 足し算・引き算れんしゅう たしひき

小学一年生向けの足し算と引き算を練習できるWebアプリケーションです。

[![wakatime](https://wakatime.com/badge/user/cc077b43-5854-4a13-9a3f-480b1d74b2a9/project/b6a966e5-fdc5-4eda-b1b1-bf4d164c5ff6.svg)](https://wakatime.com/badge/user/cc077b43-5854-4a13-9a3f-480b1d74b2a9/project/b6a966e5-fdc5-4eda-b1b1-bf4d164c5ff6) [![Deploy to GitHub Pages](https://github.com/arcatdmz/tashihiki/actions/workflows/deploy.yml/badge.svg)](https://github.com/arcatdmz/tashihiki/actions/workflows/deploy.yml)

## 🎯 概要

タッチデバイス（スマートフォン・タブレット）を使用して、楽しく算数の基礎を学べるWebアプリです。

![](/public/tashihiki.jpg)

## ✨ 主な機能

### 1. 問題画面（もんだい）

- 足し算と引き算の問題をランダムで出題
- 大きくて押しやすい数字ボタン
- 問題ごとの解答時間を計測して表示

### 2. 設定画面（せってい）

- **難易度選択**
  - かんたん（1-10）
  - ふつう（1-20）
  - むずかしい（1-50）
  - じぶんできめる（カスタム範囲）
- **問題選択**
  - 足し算と引き算
  - 足し算だけ
  - 引き算だけ
- **解答時間表示のオン/オフ**

### 3. 結果画面（けっか）

- 正解数・不正解数・合計解答数の表示
- 正解率の視覚的な表示
- URLでの履歴保存機能
- リセット機能

## 🎨 デザインの特徴

- 親しみやすいカラフルなUI
- 大きなタッチ操作可能なボタン
- 絵文字を活用したフィードバック
- モバイルファーストのレスポンシブデザイン

## 🚀 技術スタック

- **React 19** - UIフレームワーク
- **Vite** - ビルドツール
- **React Hooks** - 状態管理（useState, useEffect）
- **URLSearchParams** - クエリパラメータ管理

## 📦 インストールと起動

### 必要な環境

- Node.js 20.x以上
- npm 10.x以上

### セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ブラウザで http://localhost:5173/ にアクセス
```

### ビルド

```bash
# プロダクションビルド
npm run build

# ビルドのプレビュー
npm run preview
```

### デプロイ

このアプリはクライアントオンリーのため、以下のような静的ホスティングサービスで簡単にデプロイできます：

- **GitHub Pages**: リポジトリの Settings > Pages で設定
- **Vercel**: プロジェクトをインポートして自動デプロイ
- **Netlify**: ドラッグ&ドロップで dist フォルダをデプロイ
- **Cloudflare Pages**: GitHub連携で自動デプロイ

ビルドコマンド: `npm run build`  
出力ディレクトリ: `dist`

## 📱 使い方

1. **問題を解く**
   - 「もんだい」タブで問題が表示されます
   - 数字ボタンをタップして答えを入力
   - 「✓ こたえる」ボタンで答えを送信して次の問題へ
   - 不正解なら正しい答えが表示されます

2. **設定を変更**
   - 「せってい」タブで難易度や問題の種類、タイマー表示を変更
   - 変更は即座に反映されます

3. **結果を確認**
   - 「けっか」タブで成績を確認
   - URLを保存すれば後で結果を見ることができます
   - 「🔄 リセット」ボタンで成績をリセット

## 🔗 URL履歴保存機能

アプリは正解数と不正解数、解答時間をURLクエリパラメータに自動保存します：

```
例: ?correct=5&wrong=2&totalTime=4.259
```

このURLをブックマークやシェアすることで、学習の進捗を記録できます。

## 🏗️ プロジェクト構造

```
src/
├── App.tsx                # メインアプリケーションコンポーネント
├── App.css                # アプリケーション全体のスタイル
├── main.tsx               # エントリーポイント
├── index.css              # グローバルスタイル
└── components/
   ├── QuizScreen.tsx         # 問題画面コンポーネント
   ├── QuizScreen.module.css  # 問題画面のスタイル
   ├── Settings.tsx           # 設定画面コンポーネント
   ├── Settings.module.css    # 設定画面のスタイル
   ├── Results.tsx            # 結果画面コンポーネント
   ├── Results.module.css     # 結果画面のスタイル
   ├── Welcome.tsx            # ようこそ画面コンポーネント
   ├── Welcome.css            # ようこそ画面のスタイル
   └── ConfigPanel.tsx        # 設定UI共通パネル
```

## 🎓 教育的配慮

- 引き算の答えが負の数にならないように自動調整
- ポップな視覚的なフィードバック
- シンプルで直感的な操作性
- 段階的な難易度設定

## 📄 ライセンス

このプロジェクトはMIT Licenseのもとで公開されています。
詳しくは[LICENSE](./LICENSE)ファイルを参照してください。

## 🤝 貢献

バグ報告や機能リクエストは、GitHubのIssuesからお願いします。
