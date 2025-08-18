# 【重要】ロリポップサーバー デプロイ手順

## 必要な作業の概要

あなたがロリポップサーバー上で行う作業は以下の通りです：

1. **FTPで必要ファイルをアップロード**
2. **PHPMailerをインストール** 
3. **パスワードを設定**
4. **動作確認**

---

## STEP 1: FTP接続準備

### 1-1. FTP情報の確認
1. ロリポップ管理画面にログイン
2. 「サーバーの管理・設定」→「FTP・WebDAVアクセス」
3. 以下の情報をメモ：
   - FTPサーバー: `ftp.lolipop.jp`
   - FTPアカウント: （あなたのアカウント）
   - FTPパスワード: （あなたのパスワード）

### 1-2. FTPクライアントをインストール
- Windows/Mac: [FileZilla](https://filezilla-project.org/)をダウンロード

---

## STEP 2: ファイルアップロード

### 2-1. FTPで接続
```
ホスト: ftp.lolipop.jp
ユーザー名: あなたのFTPアカウント
パスワード: FTPパスワード
ポート: 21
```

### 2-2. privateディレクトリを作成

1. FTPクライアントで `/home/users/2/[あなたのID]/` に移動（webフォルダの1つ上）
2. 右クリック → 「ディレクトリ作成」 → `private` と入力
3. 作成した `private` フォルダを右クリック → 「パーミッション」 → `700` に設定

### 2-3. config.phpを編集してアップロード

1. ローカルの `private/config.php` をテキストエディタで開く
2. **以下の行のパスワードを実際のメールパスワードに変更：**
```php
'SMTP_PASS' => '_-mnVZZ4FLgH-Gm',  // ← あなたの実際のパスワードに変更
```
3. 保存してFTPで `/home/users/2/[あなたのID]/private/` にアップロード

### 2-4. public_htmlフォルダの内容をアップロード

以下のファイル/フォルダを `/home/users/2/[あなたのID]/web/` にアップロード：

```
public_html/
├── .htaccess          ← 必須
├── send.php           ← 必須
├── install-phpmailer.sh
├── composer.json
├── vendor/
│   └── autoload.php   ← 必須
└── logs/              ← 必須（フォルダ）
    └── .gitkeep
```

### 2-5. distフォルダの内容をアップロード

`dist/` フォルダの中身を全て `/home/users/2/[あなたのID]/web/` にアップロード：

```
dist/
├── index.html         ← 必須
└── assets/           ← 必須（フォルダごと）
    ├── index-xxxxx.css
    └── index-xxxxx.js
```

---

## STEP 3: PHPMailerインストール

### 方法A: 手動でダウンロード（推奨）

1. https://github.com/PHPMailer/PHPMailer/releases にアクセス
2. 最新版（v6.9.1）の「Source code (zip)」をダウンロード
3. ZIPファイルを解凍
4. `PHPMailer-6.9.1/src/` フォルダの中身を全て選択
5. FTPで以下の場所にアップロード：
   `/home/users/2/[あなたのID]/web/vendor/phpmailer/phpmailer/src/`

確認：以下のファイルが存在すればOK
```
vendor/phpmailer/phpmailer/src/
├── PHPMailer.php
├── SMTP.php
└── Exception.php
```

### 方法B: SSHが使える場合

```bash
ssh [FTPアカウント]@ssh.lolipop.jp -p 2222
cd web
chmod +x install-phpmailer.sh
./install-phpmailer.sh
```

---

## STEP 4: パーミッション設定

FTPクライアントで以下を設定：

1. `/web/logs/` フォルダ → パーミッション `755`
2. `.php` ファイル全て → パーミッション `644`
3. `.htaccess` → パーミッション `644`

---

## STEP 5: 動作確認

### 5-1. サイトにアクセス
```
https://rikuzero.jp/
```

### 5-2. フォームでテスト送信
1. ページ下部の「10分デモを予約」セクションまでスクロール
2. 以下を入力：
   - 会社名: テスト会社
   - ご担当者名: テスト太郎
   - メール: あなたのメールアドレス
3. 「送信して仮押さえ」をクリック
4. 「お問い合わせありがとうございます」と表示されればOK

### 5-3. メール受信確認
- `contact@rikuzero.jp` の受信ボックスを確認
- 迷惑メールフォルダも確認

---

## トラブルシューティング

### エラーが出る場合

1. **ログファイルを確認**
   - FTPで `/web/logs/contact.log` をダウンロードして内容を確認

2. **よくあるエラー**

| エラー | 対処法 |
|--------|--------|
| 500 Internal Server Error | PHP設定で7.4以上を選択（管理画面） |
| メールが届かない | config.phpのパスワードを再確認 |
| PHPMailer not found | vendor/phpmailer/phpmailer/src/にファイルがあるか確認 |

3. **デバッグモード**（問題解決後は必ずOFFに）
```php
// private/config.php の以下を一時的に変更
'DEBUG_MODE' => true,  // 問題解決後は false に戻す
```

---

## 最終チェックリスト

- [ ] private/config.php のパスワードを本番用に変更した
- [ ] PHPMailerがインストールされた（3つのPHPファイル確認）
- [ ] logsフォルダのパーミッションが755
- [ ] フォームからテスト送信できた
- [ ] contact@rikuzero.jp にメールが届いた
- [ ] DEBUG_MODEがfalseになっている

---

## サポート

問題が発生した場合は、以下の情報と一緒に連絡してください：
- エラーメッセージのスクリーンショット
- /web/logs/contact.log の内容
- どのステップで問題が発生したか