<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Health check endpoint
echo json_encode([
    'status' => 'OK',
    'service' => 'GupAI Backend (PHP)',
    'timestamp' => date('c'),
    'version' => '1.0.0'
]);