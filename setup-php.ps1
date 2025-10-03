# setup-php.ps1 - PHP Backend Setup for GupAI
Write-Host "🚀 Setting up GupAI with PHP Backend..." -ForegroundColor Green

# Create api directory
if (!(Test-Path "api")) {
    New-Item -ItemType Directory -Path "api" -Force
    Write-Host "✅ Created api folder" -ForegroundColor Green
}

# Create chat.php
$chatPHP = @'
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!isset($data['message']) || empty($data['message'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Message is required']);
    exit;
}

$message = $data['message'];
$chatHistory = $data['chatHistory'] ?? [];

// Simulate processing
usleep(800000 + rand(0, 1200000));

$responses = [
    "I understand you're asking about: \"$message\". This is from PHP backend.",
    "Thanks for your message! I received: \"$message\". How can I help?",
    "GupAI PHP Backend responding to: \"$message\". I'm here to assist you!"
];

$randomResponse = $responses[array_rand($responses)];

echo json_encode([
    'reply' => $randomResponse,
    'timestamp' => date('c'),
    'backend' => 'PHP'
]);
?>
'@

# Create health.php
$healthPHP = @'
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

echo json_encode([
    'status' => 'OK',
    'service' => 'GupAI PHP Backend',
    'timestamp' => date('c'),
    'version' => '1.0.0',
    'php_version' => PHP_VERSION
]);
?>
'@

# Create .htaccess
$htaccess = @'
Header always set Access-Control-Allow-Origin "*"
Header always set Access-Control-Allow-Methods "POST, GET, OPTIONS"
Header always set Access-Control-Allow-Headers "Content-Type"

RewriteEngine On
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ $1 [R=200,L]
'@

# Write files
$chatPHP | Out-File -FilePath "api\chat.php" -Encoding utf8
$healthPHP | Out-File -FilePath "api\health.php" -Encoding utf8
$htaccess | Out-File -FilePath "api\.htaccess" -Encoding utf8

Write-Host "✅ PHP backend files created" -ForegroundColor Green

# Check if PHP is installed
try {
    $phpVersion = php -v
    Write-Host "✅ PHP is installed: $($phpVersion[0])" -ForegroundColor Green
    
    Write-Host "🎯 Starting PHP server..." -ForegroundColor Yellow
    Write-Host "📍 Server will run at: http://localhost:8000" -ForegroundColor Cyan
    Write-Host "⏹️  Press Ctrl+C to stop the server" -ForegroundColor White
    
    # Start PHP server
    php -S localhost:8000
} catch {
    Write-Host "❌ PHP is not installed or not in PATH" -ForegroundColor Red
    Write-Host "💡 Download PHP from: https://windows.php.net/download/" -ForegroundColor Yellow
    Write-Host "💡 Or install XAMPP from: https://www.apachefriends.org/" -ForegroundColor Yellow
}