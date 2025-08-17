# リクゼロ - Speed-to-Lead Landing Page

AIエージェントによる反響対応自動化サービスのランディングページ

## 機能

- **60秒以内の一次返信自動化**: 反響の一次対応を60秒で標準化
- **内見・来店予約の自動調整**: AIエージェントが候補提示から確定まで
- **前日リマインドSMS送信**: ノーショー率を大幅削減
- **フォーム送信機能**: EmailJS連携でcontact@rikuzero.jpへ自動送信
- **レスポンシブデザイン**: モバイル・デスクトップ完全対応
- **アニメーション**: Framer Motionを使用した滑らかなUX

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. EmailJSの設定

フォーム送信機能を有効にするには、EmailJSの設定が必要です：

1. [EmailJS](https://www.emailjs.com/)でアカウントを作成
2. Email Service（Gmail等）を追加
3. Email Templateを作成（以下のテンプレート変数を使用）：
   - `{{to_email}}`: contact@rikuzero.jp
   - `{{from_name}}`: 送信者名
   - `{{company_name}}`: 会社名
   - `{{reply_to}}`: 返信先メールアドレス
   - `{{datetime}}`: 希望日時
   - `{{consult_only}}`: 相談のみか
   - `{{message}}`: メッセージ本文

4. `.env`ファイルを作成し、EmailJSの認証情報を設定：

```bash
cp .env.example .env
```

```env
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:5173 を開きます。

### 4. 本番ビルド

```bash
npm run build
```

### 5. プレビュー

```bash
npm run preview
```

## デプロイ

GitHub Pagesで自動デプロイされます：

```bash
# mainブランチにプッシュすると自動デプロイ
git push origin main

# または手動デプロイ
npm run deploy
```

## 技術スタック

- **React 18**: UIライブラリ
- **Vite**: 高速ビルドツール
- **Tailwind CSS**: ユーティリティファーストCSS
- **Framer Motion**: アニメーションライブラリ
- **EmailJS**: メール送信サービス
- **Lucide Icons**: アイコンライブラリ

## プロジェクト構造

```
speed-to-lead-lp/
├── src/
│   ├── App.jsx          # メインコンポーネント
│   ├── App.css          # グローバルスタイル
│   └── main.jsx         # エントリーポイント
├── public/              # 静的ファイル
├── .env.example         # 環境変数のテンプレート
├── vite.config.js       # Vite設定
├── tailwind.config.js   # Tailwind設定
└── package.json         # 依存関係
```

## お問い合わせ

- **Email**: contact@rikuzero.jp
- **Tel**: 080-7798-1037
- **営業時間**: 平日 10:00-18:00

## ライセンス

MIT License