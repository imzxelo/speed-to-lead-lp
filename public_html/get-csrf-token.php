<?php
/**
 * CSRF Token生成エンドポイント
 * React/Ajax からのリクエスト用
 */

session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// CSRF Token生成
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// JSONレスポンス
echo json_encode([
    'token' => $_SESSION['csrf_token'],
    'expires' => time() + 3600 // 1時間有効
]);