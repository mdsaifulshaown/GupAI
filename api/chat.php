<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Only handle POST requests
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get the raw POST data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!isset($data['message'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Message is required']);
    exit;
}

$message = $data['message'];

// Simulate AI processing
sleep(1); // Simulate delay

// You can integrate with any AI service here
// For now, we'll just return a simulated response
$response = "🤖 GupAI Backend (PHP) Response:\n\nI received your message: \"{$message}\"\n\nThis is a simulated response from the PHP backend server.";

echo json_encode([
    'reply' => $response,
    'timestamp' => date('c')
]);
