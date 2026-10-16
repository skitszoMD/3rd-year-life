<?php
require_once '../config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['username']) || !isset($data['password']) || !isset($data['confirm'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Username, password, and confirm required']);
    exit;
}

if ($data['password'] !== $data['confirm']) {
    http_response_code(400);
    echo json_encode(['error' => "Passwords don't match"]);
    exit;
}

// Check if user exists
$stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
$stmt->execute([$data['username']]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(404);
    echo json_encode(['error' => 'No account with that username']);
    exit;
}

// Update password
$stmt = $pdo->prepare("UPDATE users SET password = ? WHERE username = ?");
$stmt->execute([password_hash($data['password'], PASSWORD_DEFAULT), $data['username']]);

echo json_encode(['success' => true]);
