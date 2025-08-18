<?php
/**
 * お問い合わせフォーム送信処理（シンプル版）
 * React LP からのAJAX送信用
 */

// CORS設定（Reactからのアクセスを許可）
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

// プリフライトリクエストへの対応
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// POSTのみ受付
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['error' => 'Method not allowed']));
}

// エラー表示OFF（本番環境）
ini_set('display_errors', 0);
error_reporting(E_ALL);

// 文字コード設定
mb_language('Japanese');
mb_internal_encoding('UTF-8');

// 設定ファイル読み込み
$configPath = __DIR__ . '/../private/config.php';
if (!file_exists($configPath)) {
    // privateディレクトリが使えない場合
    $configPath = __DIR__ . '/config.php';
}

if (!file_exists($configPath)) {
    http_response_code(500);
    die(json_encode(['error' => 'Configuration file not found']));
}

$config = require_once $configPath;

// PHPMailer読み込み
require_once __DIR__ . '/vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// ログ記録
function writeLog($message, $level = 'INFO') {
    global $config;
    $logFile = $config['LOG_FILE'] ?? __DIR__ . '/logs/contact.log';
    $logDir = dirname($logFile);
    
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    $timestamp = date('Y-m-d H:i:s');
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $logMessage = "[{$timestamp}] [{$level}] [IP: {$ip}] {$message}" . PHP_EOL;
    
    file_put_contents($logFile, $logMessage, FILE_APPEND | LOCK_EX);
}

// 入力データ取得（JSONとFormDataの両対応）
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (strpos($contentType, 'application/json') !== false) {
    $input = json_decode(file_get_contents('php://input'), true);
} else {
    $input = $_POST;
}

// データ検証と整形
$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$company = trim($input['company'] ?? '');
$datetime = trim($input['datetime'] ?? '後日調整');
$consultOnly = isset($input['consultOnly']) && $input['consultOnly'] ? 'はい' : 'いいえ';
$message = trim($input['message'] ?? '');

// 簡易バリデーション
if (empty($name) || empty($email)) {
    http_response_code(400);
    die(json_encode(['error' => '必須項目が入力されていません']));
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    die(json_encode(['error' => '有効なメールアドレスを入力してください']));
}

// メール送信
try {
    $mail = new PHPMailer(true);
    
    // SMTP設定
    $mail->isSMTP();
    $mail->Host       = $config['SMTP_HOST'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $config['SMTP_USER'];
    $mail->Password   = $config['SMTP_PASS'];
    $mail->SMTPSecure = $config['SMTP_SECURE'];
    $mail->Port       = $config['SMTP_PORT'];
    
    // デバッグモード
    if ($config['DEBUG_MODE'] ?? false) {
        $mail->SMTPDebug = SMTP::DEBUG_SERVER;
    }
    
    // 文字エンコーディング
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';
    
    // 送信元・送信先
    $mail->setFrom($config['FROM_EMAIL'], $config['FROM_NAME']);
    $mail->addAddress($config['TO_EMAIL']);
    $mail->addReplyTo($email, $name);
    
    // 件名
    $mail->Subject = "【お問い合わせ】{$name}様（リクゼロ）";
    
    // 本文
    $timestamp = date('Y-m-d H:i:s');
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    
    $body = <<<EOT
■ お問い合わせを受け付けました

【お客様情報】
お名前: {$name}
会社名: {$company}
メールアドレス: {$email}

【ご希望内容】
希望日時: {$datetime}
話だけ聞きたい: {$consultOnly}

【お問い合わせ内容】
{$message}

【システム情報】
送信日時: {$timestamp}
IPアドレス: {$ip}

---
このメールは自動送信されています。
お問い合わせへの返信は、上記メールアドレス宛にお送りください。
EOT;
    
    $mail->Body = $body;
    
    // 送信実行
    $mail->send();
    
    writeLog("Mail sent successfully to {$email}", 'SUCCESS');
    
    // 成功レスポンス
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'お問い合わせを受け付けました'
    ]);
    
} catch (Exception $e) {
    writeLog("Mail send failed: {$mail->ErrorInfo}", 'ERROR');
    
    // エラーレスポンス
    http_response_code(500);
    echo json_encode([
        'error' => 'メール送信に失敗しました',
        'details' => $config['DEBUG_MODE'] ? $mail->ErrorInfo : null
    ]);
}