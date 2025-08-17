# ロリポップサーバー デプロイ手順

## 概要
EmailJSからPHP/SMTP（ロリポップ）への切り替え手順書

## 必要ファイル構成

```
/home/users/[あなたのID]/web/  （ドキュメントルート）
├── public_html/              ← 公開ディレクトリ
│   ├── contact.php          ← お問い合わせフォーム
│   ├── send.php            ← 送信処理
│   ├── thanks.html         ← サンクスページ
│   ├── .htaccess          ← セキュリティ設定
│   ├── vendor/            ← PHPMailer
│   │   └── autoload.php
│   └── logs/              ← ログディレクトリ（書込権限755）
│
├── private/               ← 非公開ディレクトリ（1階層上）
│   └── config.php        ← SMTP認証情報
```

## セットアップ手順

### 1. PHPMailerのインストール

#### 方法A: Composerを使用（推奨）
```bash
cd public_html
composer require phpmailer/phpmailer
```

#### 方法B: 手動インストール
1. [PHPMailer](https://github.com/PHPMailer/PHPMailer/releases)から最新版をダウンロード
2. `src/`フォルダの内容を`public_html/vendor/phpmailer/phpmailer/src/`に配置

### 2. ディレクトリ作成と権限設定

```bash
# ログディレクトリ作成
mkdir -p public_html/logs
chmod 755 public_html/logs

# privateディレクトリ作成（ドキュメントルートの上）
mkdir -p ../private
chmod 700 ../private
```

### 3. 設定ファイルの配置

#### private/config.php
- `private/config.php`を編集
- SMTP認証情報を確認・更新：
  - SMTP_HOST: `smtp.lolipop.jp`
  - SMTP_USER: あなたのメールアドレス
  - SMTP_PASS: メールパスワード

### 4. ロリポップ管理画面での設定

1. **PHP設定**
   - ロリポップ管理画面 → サーバーの管理・設定 → PHP設定
   - PHPバージョン: 7.4以上を選択
   - `session.save_path`を確認

2. **メール設定確認**
   - メール設定 → メール設定/ロリポップ！webメーラー
   - SMTPサーバー情報を確認
   - 送信元メールアドレスが有効か確認

3. **SSL設定**
   - 独自SSL証明書導入 → 独自SSL証明書お申込み・設定
   - rikuzero.jpのSSLが有効か確認

### 5. ファイルアップロード

FTP/SFTPクライアントを使用：
```
ホスト: ftp.lolipop.jp
ユーザー: あなたのFTPアカウント
パスワード: FTPパスワード
```

アップロード順序：
1. `private/config.php` → `/home/users/[ID]/private/`
2. `public_html/`の全ファイル → `/home/users/[ID]/web/`

### 6. 動作確認

#### テスト項目
1. **フォーム表示**: https://rikuzero.jp/contact.php
2. **送信テスト**: 
   - 通常送信
   - 「話だけ聞きたい」チェック
3. **セキュリティテスト**:
   - 連続送信（60秒制限）
   - ハニーポット
   - CSRF保護

#### ログ確認
```bash
tail -f public_html/logs/contact.log
```

### 7. トラブルシューティング

#### メールが届かない場合
1. ログファイルを確認
2. SMTP認証情報を再確認
3. 迷惑メールフォルダを確認
4. SPFレコード設定を確認

#### 500エラーが出る場合
1. PHP構文エラーをチェック
2. ファイルパーミッションを確認（644）
3. .htaccessの構文を確認

#### セッションエラーの場合
1. session.save_pathの権限を確認
2. セッションディレクトリの書き込み権限

## 本番切り替え

### React側の修正（オプション）

現在のReactフォームをPHP送信に切り替える場合：

```javascript
// src/App.jsx の handleSubmit を修正
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // PHPエンドポイントに送信
  const formData = new FormData();
  formData.append('name', formData.person);
  formData.append('email', formData.email);
  formData.append('company', formData.company);
  formData.append('datetime', formData.datetime);
  formData.append('consultOnly', consultOnly);
  formData.append('message', '自動生成メッセージ');
  
  const response = await fetch('https://rikuzero.jp/send.php', {
    method: 'POST',
    body: formData
  });
  
  if (response.ok) {
    window.location.href = 'https://rikuzero.jp/thanks.html';
  }
};
```

### DNS/CDN設定

CloudflareやCDNを使用している場合：
- `/send.php`へのPOSTリクエストをキャッシュしない
- `/contact.php`のセッションCookieを通す

## セキュリティチェックリスト

- [ ] config.phpが公開ディレクトリ外にある
- [ ] .htaccessが正しく動作している
- [ ] エラー表示がOFFになっている
- [ ] ログファイルが外部からアクセスできない
- [ ] CSRF保護が有効
- [ ] レート制限が動作している
- [ ] SSL（HTTPS）が有効

## メンテナンス

### ログローテーション
```bash
# 月次でログをアーカイブ
mv logs/contact.log logs/contact_$(date +%Y%m).log
touch logs/contact.log
chmod 644 logs/contact.log
```

### バックアップ
定期的にバックアップ：
- config.php
- logs/
- データベース（使用している場合）

## サポート

問題が発生した場合：
1. ログファイルを確認
2. ロリポップサポートに問い合わせ
3. PHPMailerのドキュメントを参照

---
最終更新: 2024年