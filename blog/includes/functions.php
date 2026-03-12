<?php
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

function isAdmin() {
    return (isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin');
}

function h($str) {
    return htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
}

function getCurrentUser($pdo) {
    if (!isLoggedIn()) {
        return null;
    }
    $stmt = $pdo->prepare("SELECT id, username, email, role FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    return $stmt->fetch();
}
?>