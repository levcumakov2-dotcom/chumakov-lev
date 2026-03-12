<?php
session_start();
require_once '../config/db.php';
require_once '../includes/functions.php';

header('Content-Type: application/json');

if (!isLoggedIn()) {
    http_response_code(403);
    echo json_encode(['error' => 'Не авторизован']);
    exit;
}

$postId = isset($_POST['post_id']) ? (int)$_POST['post_id'] : 0;
$content = trim($_POST['content'] ?? '');

if (empty($content)) {
    http_response_code(400);
    echo json_encode(['error' => 'Комментарий не может быть пустым']);
    exit;
}

$stmt = $pdo->prepare("SELECT id FROM posts WHERE id = ?");
$stmt->execute([$postId]);
if (!$stmt->fetch()) {
    http_response_code(404);
    echo json_encode(['error' => 'Пост не найден']);
    exit;
}

$stmt = $pdo->prepare("INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)");
if ($stmt->execute([$postId, $_SESSION['user_id'], $content])) {
    $commentId = $pdo->lastInsertId();
    $stmt = $pdo->prepare("SELECT username FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();
    
    echo json_encode([
        'id' => $commentId,
        'username' => $user['username'],
        'content' => htmlspecialchars($content, ENT_QUOTES),
        'date' => date('d.m.Y H:i')
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка сохранения']);
}
?>