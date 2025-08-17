#!/bin/bash

# PHPMailer手動インストールスクリプト
# Composerが使えない環境用

echo "PHPMailerのインストールを開始します..."

# PHPMailerのバージョン
VERSION="v6.9.1"

# ディレクトリ作成
mkdir -p vendor/phpmailer/phpmailer/src

# GitHubからPHPMailerをダウンロード
echo "PHPMailerをダウンロード中..."
cd vendor/phpmailer/phpmailer

# wgetが使える場合
if command -v wget &> /dev/null; then
    wget -O phpmailer.zip "https://github.com/PHPMailer/PHPMailer/archive/refs/tags/${VERSION}.zip"
# curlが使える場合
elif command -v curl &> /dev/null; then
    curl -L -o phpmailer.zip "https://github.com/PHPMailer/PHPMailer/archive/refs/tags/${VERSION}.zip"
else
    echo "Error: wgetもcurlも見つかりません。手動でダウンロードしてください。"
    echo "URL: https://github.com/PHPMailer/PHPMailer/releases/tag/${VERSION}"
    exit 1
fi

# 解凍
echo "ファイルを解凍中..."
unzip -q phpmailer.zip

# srcディレクトリの内容をコピー
cp -r PHPMailer-*/{src/*,LICENSE} .
rm -rf PHPMailer-* phpmailer.zip

echo "PHPMailerのインストールが完了しました！"
echo ""
echo "インストールされたファイル:"
ls -la src/

cd ../../..
echo ""
echo "次のステップ:"
echo "1. private/config.php のSMTP設定を確認"
echo "2. logs/ ディレクトリの作成と権限設定"
echo "3. send.php の動作確認"