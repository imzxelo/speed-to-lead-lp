<?php
session_start();

// CSRF Token生成
function generateCSRFToken() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

$csrfToken = generateCSRFToken();
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>お問い合わせ - リクゼロ</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
            color: #1e293b;
            font-size: 28px;
            margin-bottom: 10px;
            text-align: center;
        }
        
        .subtitle {
            color: #64748b;
            text-align: center;
            margin-bottom: 30px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            color: #475569;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .required {
            color: #ef4444;
        }
        
        input[type="text"],
        input[type="email"],
        input[type="datetime-local"],
        textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 14px;
            transition: all 0.2s;
        }
        
        input:focus,
        textarea:focus {
            outline: none;
            border-color: #22d3ee;
            box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.1);
        }
        
        textarea {
            resize: vertical;
            min-height: 120px;
        }
        
        .checkbox-group {
            background: #f0fdfa;
            border: 1px solid #5eead4;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
        }
        
        .checkbox-label {
            display: flex;
            align-items: flex-start;
            cursor: pointer;
        }
        
        input[type="checkbox"] {
            margin-right: 10px;
            margin-top: 3px;
            cursor: pointer;
            width: 18px;
            height: 18px;
        }
        
        .checkbox-text {
            flex: 1;
        }
        
        .checkbox-title {
            font-weight: 600;
            color: #0f766e;
            margin-bottom: 4px;
        }
        
        .checkbox-desc {
            font-size: 13px;
            color: #64748b;
        }
        
        .button {
            width: 100%;
            background: linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%);
            color: white;
            padding: 14px;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(34, 211, 238, 0.3);
        }
        
        .button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .error-message {
            color: #ef4444;
            font-size: 13px;
            margin-top: 5px;
            display: none;
        }
        
        .error-message.show {
            display: block;
        }
        
        .contact-info {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: 14px;
        }
        
        .contact-info strong {
            color: #1e293b;
        }
        
        /* ハニーポット（スパム対策） */
        .hp-field {
            position: absolute;
            left: -9999px;
            top: -9999px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>10分デモを予約</h1>
        <p class="subtitle">空き枠から選ぶだけ。最短当日で実演。</p>
        
        <form id="contactForm" action="/send.php" method="POST">
            <!-- CSRF Token -->
            <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($csrfToken); ?>">
            
            <!-- ハニーポット -->
            <input type="text" name="hp_field" class="hp-field" tabindex="-1" autocomplete="off">
            
            <div class="form-group">
                <label for="company">
                    会社名 <span class="required">*</span>
                </label>
                <input type="text" id="company" name="company" required placeholder="株式会社〇〇">
                <div class="error-message" id="company-error"></div>
            </div>
            
            <div class="form-group">
                <label for="name">
                    ご担当者名 <span class="required">*</span>
                </label>
                <input type="text" id="name" name="name" required placeholder="山田 太郎">
                <div class="error-message" id="name-error"></div>
            </div>
            
            <div class="form-group">
                <label for="email">
                    メールアドレス <span class="required">*</span>
                </label>
                <input type="email" id="email" name="email" required placeholder="example@company.jp">
                <div class="error-message" id="email-error"></div>
            </div>
            
            <div class="checkbox-group">
                <label class="checkbox-label">
                    <input type="checkbox" id="consultOnly" name="consultOnly">
                    <div class="checkbox-text">
                        <div class="checkbox-title">まずは話だけ聞きたい</div>
                        <div class="checkbox-desc">日時は後日調整します。資料や概要説明を希望の方はこちらを選択してください。</div>
                    </div>
                </label>
            </div>
            
            <div class="form-group" id="datetime-group">
                <label for="datetime">
                    希望日時（任意）
                </label>
                <input type="datetime-local" id="datetime" name="datetime">
                <div class="error-message" id="datetime-error"></div>
            </div>
            
            <div class="form-group">
                <label for="message">
                    お問い合わせ内容 <span class="required">*</span>
                </label>
                <textarea id="message" name="message" required placeholder="ご質問やご要望をお聞かせください"></textarea>
                <div class="error-message" id="message-error"></div>
            </div>
            
            <button type="submit" class="button" id="submitButton">
                送信して仮押さえ
            </button>
        </form>
        
        <div class="contact-info">
            <p>
                緊急の方はお電話でもお問い合わせください<br>
                <strong>080-7798-1037</strong><br>
                平日 10:00-18:00
            </p>
        </div>
    </div>
    
    <script>
        // フォームバリデーション
        const form = document.getElementById('contactForm');
        const submitButton = document.getElementById('submitButton');
        const consultOnly = document.getElementById('consultOnly');
        const datetimeGroup = document.getElementById('datetime-group');
        const datetimeInput = document.getElementById('datetime');
        
        // 「話だけ聞きたい」チェック時の処理
        consultOnly.addEventListener('change', function() {
            if (this.checked) {
                datetimeInput.disabled = true;
                datetimeInput.value = '';
                datetimeGroup.style.opacity = '0.5';
            } else {
                datetimeInput.disabled = false;
                datetimeGroup.style.opacity = '1';
            }
        });
        
        // フォーム送信時の処理
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // バリデーション
            let isValid = true;
            const fields = ['company', 'name', 'email', 'message'];
            
            fields.forEach(field => {
                const input = document.getElementById(field);
                const error = document.getElementById(field + '-error');
                
                if (!input.value.trim()) {
                    error.textContent = 'この項目は必須です';
                    error.classList.add('show');
                    isValid = false;
                } else {
                    error.classList.remove('show');
                }
            });
            
            // メールアドレスの形式チェック
            const emailInput = document.getElementById('email');
            const emailError = document.getElementById('email-error');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (emailInput.value && !emailRegex.test(emailInput.value)) {
                emailError.textContent = '有効なメールアドレスを入力してください';
                emailError.classList.add('show');
                isValid = false;
            }
            
            // メッセージの文字数チェック
            const messageInput = document.getElementById('message');
            const messageError = document.getElementById('message-error');
            
            if (messageInput.value.length > 2000) {
                messageError.textContent = 'お問い合わせ内容は2000文字以内で入力してください';
                messageError.classList.add('show');
                isValid = false;
            }
            
            if (isValid) {
                submitButton.disabled = true;
                submitButton.textContent = '送信中...';
                form.submit();
            }
        });
    </script>
</body>
</html>