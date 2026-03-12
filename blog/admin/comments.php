<?php
session_start();
require_once '../config/db.php';
require_once '../includes/functions.php';

if (!isAdmin()) {
    header('Location: ../login.php');
    exit;
}

if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    $stmt = $pdo->prepare("DELETE FROM comments WHERE id = ?");
    $stmt->execute([$id]);
    $_SESSION['message'] = 'Комментарий удален';
    header('Location: comments.php');
    exit;
}

$stmt = $pdo->query("
    SELECT c.*, u.username, p.title as post_title 
    FROM comments c 
    JOIN users u ON c.user_id = u.id 
    JOIN posts p ON c.post_id = p.id 
    ORDER BY c.created_at DESC
");
$comments = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Админ-панель - Комментарии</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f4f4f4;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }
        
        .container {
            width: 90%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 15px;
        }
        
        header {
            background: #333;
            color: #fff;
            padding: 1rem 0;
            flex-shrink: 0;
        }
        
        nav a {
            color: #fff;
            text-decoration: none;
            padding: 0.5rem 1rem;
        }
        
        nav a:hover {
            background: #555;
            border-radius: 4px;
        }
        
        main {
            flex: 1 0 auto;
            padding: 2rem 0;
        }
        
        h1 {
            margin-bottom: 1rem;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            background: #fff;
            margin: 1rem 0;
        }
        
        th {
            background: #333;
            color: #fff;
            padding: 0.5rem;
            text-align: left;
        }
        
        td {
            padding: 0.5rem;
            border-bottom: 1px solid #ddd;
        }
        
        tr:hover {
            background: #f9f9f9;
        }
        
        .btn {
            display: inline-block;
            background: #333;
            color: #fff;
            padding: 0.5rem 1rem;
            text-decoration: none;
            border-radius: 3px;
            margin-bottom: 1rem;
        }
        
        .btn:hover {
            background: #555;
        }
        
        .footer {
            background: #333;
            color: #fff;
            text-align: center;
            padding: 1rem 0;
            flex-shrink: 0;
            width: 100%;
        }
    </style>
</head>
<body>
    <header>
        <nav class="container">
            <a href="../index.php">На сайт</a> | 
            <a href="posts.php">Посты</a> | 
            <a href="comments.php">Комментарии</a> | 
            <a href="../logout.php">Выйти</a>
        </nav>
    </header>
    <main class="container">
        <h1>Управление комментариями</h1>
        
        <?php if (isset($_SESSION['message'])): ?>
            <p style="color: green;"><?= $_SESSION['message'] ?></p>
            <?php unset($_SESSION['message']); ?>
        <?php endif; ?>
        
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Комментарий</th>
                    <th>Автор</th>
                    <th>Пост</th>
                    <th>Дата</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($comments as $comment): ?>
                <tr>
                    <td><?= $comment['id'] ?></td>
                    <td><?= h(substr($comment['content'], 0, 100)) ?>...</td>
                    <td><?= h($comment['username']) ?></td>
                    <td><a href="../post.php?id=<?= $comment['post_id'] ?>"><?= h($comment['post_title']) ?></a></td>
                    <td><?= date('d.m.Y H:i', strtotime($comment['created_at'])) ?></td>
                    <td>
                        <a href="?delete=<?= $comment['id'] ?>" onclick="return confirm('Удалить комментарий?')">Удалить</a>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </main>
    <footer class="footer">
        <div class="container">
            <p>&copy; <?= date('Y') ?> Мой Блог. Все права защищены.</p>
        </div>
    </footer>
</body>
</html>