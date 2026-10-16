<?php
require_once '../config.php';

header('Content-Type: application/json');

session_start();

// Check authentication for write operations
$method = $_SERVER['REQUEST_METHOD'];
if (in_array($method, ['POST', 'PUT', 'DELETE']) && !isset($_SESSION['is_admin'])) {
    http_response_code(403);
    echo json_encode(['error' => 'Admin access required']);
    exit;
}

switch ($method) {
    case 'GET':
        $category = $_GET['category'] ?? '';
        if ($category && in_array($category, ['flowers', 'coffee'])) {
            $stmt = $pdo->prepare("SELECT * FROM products WHERE category = ? ORDER BY created_at DESC");
            $stmt->execute([$category]);
        } else {
            $stmt = $pdo->query("SELECT * FROM products ORDER BY created_at DESC");
        }
        $products = $stmt->fetchAll();
        echo json_encode(array_map(function($p) {
            return [
                'id' => $p['id'],
                'cat' => $p['category'],
                'name' => $p['name'],
                'desc' => $p['description'],
                'price' => number_format($p['price'], 2),
                'img' => $p['image'],
                'pos' => [
                    'z' => (float)$p['zoom'],
                    'x' => (float)$p['x'],
                    'y' => (float)$p['y'],
                    'ar' => (float)$p['aspect_ratio']
                ]
            ];
        }, $products));
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = 'p' . time();

        $stmt = $pdo->prepare("INSERT INTO products (id, category, name, description, price, image, zoom, x, y, aspect_ratio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $id,
            $data['cat'],
            $data['name'],
            $data['desc'],
            $data['price'],
            $data['img'] ?? '',
            $data['pos']['z'] ?? 1,
            $data['pos']['x'] ?? 0,
            $data['pos']['y'] ?? 0,
            $data['pos']['ar'] ?? 1.333333
        ]);

        echo json_encode(['success' => true, 'id' => $id]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'] ?? '';

        $stmt = $pdo->prepare("UPDATE products SET category = ?, name = ?, description = ?, price = ?, image = ?, zoom = ?, x = ?, y = ?, aspect_ratio = ? WHERE id = ?");
        $stmt->execute([
            $data['cat'],
            $data['name'],
            $data['desc'],
            $data['price'],
            $data['img'] ?? '',
            $data['pos']['z'] ?? 1,
            $data['pos']['x'] ?? 0,
            $data['pos']['y'] ?? 0,
            $data['pos']['ar'] ?? 1.333333,
            $id
        ]);

        echo json_encode(['success' => true]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? '';
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Product ID required']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
