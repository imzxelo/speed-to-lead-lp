<?php
/**
 * お問い合わせフォーム送信処理
 * PHPMailer + SMTP (ロリポップ対応)
 */

// エラー表示設定（本番では必ずOFF）
ini_set('display_errors', 0);
error_reporting(E_ALL);

// セッション開始
session_start();

// 文字コード設定
mb_language('Japanese');
mb_internal_encoding('UTF-8');

// 設定ファイル読み込み
$configPath = __DIR__ . '/../private/config.php';
if (!file_exists($configPath)) {
    // privateディレクトリが使えない場合の代替パス
    $configPath = __DIR__ . '/config.php';
}
$config = require_once $configPath;

// PHPMailer読み込み
require_once __DIR__ . '/vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

/**
 * エラーログ記録
 */
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

/**
 * エラーレスポンス
 */
function errorResponse($message, $code = 400) {
    writeLog("Error: {$message}", 'ERROR');
    http_response_code($code);
    
    // ユーザー向けメッセージ
    $userMessage = 'エラーが発生しました。時間をおいて再度お試しください。';
    if ($code === 429) {
        $userMessage = '送信回数の制限に達しました。しばらく待ってから再度お試しください。';
    }
    
    die(json_encode(['error' => $userMessage], JSON_UNESCAPED_UNICODE));
}

/**
 * CSRF Token 生成
 */
function generateCSRFToken() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * CSRF Token 検証
 */
function verifyCSRFToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * レート制限チェック
 */
function checkRateLimit() {
    global $config;
    $limitSeconds = $config['RATE_LIMIT_SECONDS'] ?? 60;
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $sessionKey = 'last_submit_' . md5($ip);
    
    if (isset($_SESSION[$sessionKey])) {
        $lastSubmit = $_SESSION[$sessionKey];
        $timeDiff = time() - $lastSubmit;
        
        if ($timeDiff < $limitSeconds) {
            $remaining = $limitSeconds - $timeDiff;
            errorResponse("Rate limit exceeded. Wait {$remaining} seconds.", 429);
        }
    }
    
    $_SESSION[$sessionKey] = time();
}

/**
 * 入力値検証
 */
function validateInput($data) {
    global $config;
    $errors = [];
    
    // 名前の検証
    if (empty($data['name'])) {
        $errors[] = 'お名前は必須です';
    } elseif (mb_strlen($data['name']) > ($config['MAX_NAME_LENGTH'] ?? 50)) {
        $errors[] = 'お名前は50文字以内で入力してください';
    }
    
    // メールアドレスの検証
    if (empty($data['email'])) {
        $errors[] = 'メールアドレスは必須です';
    } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = '有効なメールアドレスを入力してください';
    }
    
    // メッセージの検証
    if (empty($data['message'])) {
        $errors[] = 'お問い合わせ内容は必須です';
    } elseif (mb_strlen($data['message']) > ($config['MAX_MESSAGE_LENGTH'] ?? 2000)) {
        $errors[] = 'お問い合わせ内容は2000文字以内で入力してください';
    }
    
    // ハニーポットチェック
    if (!empty($data['hp_field'])) {
        writeLog('Honeypot triggered', 'SECURITY');
        $errors[] = 'Invalid submission';
    }
    
    return $errors;
}

/**
 * メール送信処理
 */
function sendMail($data) {
    global $config;
    
    $mail = new PHPMailer(true);
    
    try {
        // サーバー設定
        if ($config['DEBUG_MODE'] ?? false) {
            $mail->SMTPDebug = SMTP::DEBUG_SERVER;
        }
        
        $mail->isSMTP();
        $mail->Host       = $config['SMTP_HOST'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $config['SMTP_USER'];
        $mail->Password   = $config['SMTP_PASS'];
        $mail->SMTPSecure = $config['SMTP_SECURE'];
        $mail->Port       = $config['SMTP_PORT'];
        
        // 文字エンコーディング
        $mail->CharSet = 'UTF-8';
        $mail->Encoding = 'base64';
        
        // 送信元・送信先
        $mail->setFrom($config['FROM_EMAIL'], $config['FROM_NAME']);
        $mail->addAddress($config['TO_EMAIL']);
        $mail->addReplyTo($data['email'], $data['name']);
        
        // 件名と本文
        $mail->Subject = "【お問い合わせ】{$data['name']}様（rikuzero.jp）";
        
        // 本文作成
        $timestamp = date('Y-m-d H:i:s');
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        
        $body = <<<EOT
お名前: {$data['name']}
メール: {$data['email']}
会社名: {$data['company']}
希望日時: {$data['datetime']}
相談のみ: {$data['consult_only']}
送信元IP: {$ip}
日時: {$timestamp}

--- お問い合わせ内容 ---
{$data['message']}
EOT;
        
        $mail->Body = $body;
        
        // 送信
        $mail->send();
        
        writeLog("Mail sent successfully to {$data['email']}", 'SUCCESS');
        return true;
        
    } catch (Exception $e) {
        writeLog("Mail send failed: {$mail->ErrorInfo}", 'ERROR');
        return false;
    }
}

// ===============================
// メイン処理
// ===============================

// POSTリクエストのみ受付
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse('Invalid request method', 405);
}

// レート制限チェック
checkRateLimit();

// 入力データ取得
$inputData = [
    'name'         => trim($_POST['name'] ?? ''),
    'email'        => trim($_POST['email'] ?? ''),
    'company'      => trim($_POST['company'] ?? ''),
    'datetime'     => trim($_POST['datetime'] ?? '後日調整'),
    'consult_only' => isset($_POST['consultOnly']) ? 'はい' : 'いいえ',
    'message'      => trim($_POST['message'] ?? ''),
    'hp_field'     => $_POST['hp_field'] ?? '',
    'csrf_token'   => $_POST['csrf_token'] ?? ''
];

// CSRF Token検証
if (!verifyCSRFToken($inputData['csrf_token'])) {
    errorResponse('Invalid CSRF token', 403);
}

// 入力値検証
$errors = validateInput($inputData);
if (!empty($errors)) {
    errorResponse(implode(', ', $errors), 400);
}

// メール送信
if (sendMail($inputData)) {
    // 成功時はthanks.htmlへリダイレクト
    $_SESSION['form_submitted'] = true;
    header('Location: /thanks.html', true, 303);
    exit;
} else {
    errorResponse('メール送信に失敗しました', 500);
}