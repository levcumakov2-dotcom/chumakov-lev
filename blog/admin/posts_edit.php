<?php
session_start();
require_once '../config/db.php';
require_once '../includes/functions.php';

if (!isAdmin()) {
    header('Location: ../login.php');
    exit;
}

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$post = ['title' => '', 'content' => '', 'image' => ''];
$isEdit = false;

if ($id > 0) {
    $isEdit = true;
    $stmt = $pdo->prepare("SELECT * FROM posts WHERE id = ?");
    $stmt->execute([$id]);
    $post = $stmt->fetch();
    if (!$post) {
        $_SESSION['message'] = 'Пост не найден';
        header('Location: posts.php');
        exit;
    }
}

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title'] ?? '');
    $content = trim($_POST['content'] ?? '');
    
    if (empty($title)) $errors[] = 'Заголовок не может быть пустым.';
    if (empty($content)) $errors[] = 'Текст не может быть пустым.';
    
    $imagePath = $post['image'];
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../uploads/';
        $fileName = time() . '_' . basename($_FILES['image']['name']);
        $uploadFile = $uploadDir . $fileName;
        
        $imageFileType = strtolower(pathinfo($uploadFile, PATHINFO_EXTENSION));
        $allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        
        if (!in_array($imageFileType, $allowedTypes)) {
            $errors[] = 'Разрешены только JPG, JPEG, PNG, GIF, WEBP.';
        } elseif (move_uploaded_file($_FILES['image']['tmp_name'], $uploadFile)) {
            $imagePath = 'uploads/' . $fileName;
        } else {
            $errors[] = 'Ошибка при загрузке файла.';
        }
    }
    
    if (empty($errors)) {
        if ($isEdit) {
            $stmt = $pdo->prepare("UPDATE posts SET title = ?, content = ?, image = ? WHERE id = ?");
            $stmt->execute([$title, $content, $imagePath, $id]);
            $_SESSION['message'] = 'Пост обновлен';
        } else {
            $stmt = $pdo->prepare("INSERT INTO posts (user_id, title, content, image) VALUES (?, ?, ?, ?)");
            $stmt->execute([$_SESSION['user_id'], $title, $content, $imagePath]);
            $_SESSION['message'] = 'Пост добавлен';
        }
        header('Location: posts.php');
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $isEdit ? 'Редактирование' : 'Добавление' ?> поста</title>
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
            <a href="posts.php">Назад к постам</a> | 
            <a href="../logout.php">Выйти</a>
        </nav>
    </header>
    <main class="container">
        <h1><?= $isEdit ? 'Редактировать пост' : 'Добавить новый пост' ?></h1>
        
        <?php if (!empty($errors)): ?>
            <div class="errors">
                <?php foreach ($errors as $error): ?>
                    <p><?= h($error) ?></p>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
        
        <form method="post" enctype="multipart/form-data" class="form">
            <div>
                <label for="title">Заголовок:</label>
                <input type="text" id="title" name="title" value="<?= h($_POST['title'] ?? $post['title']) ?>" required>
            </div>
            <div>
                <label for="content">Текст:</label>
                <textarea id="content" name="content" rows="10" required><?= h($_POST['content'] ?? $post['content']) ?></textarea>
            </div>
            <div>
                <label for="image">Картинка:</label>
                <input type="file" id="image" name="image" accept="image/*">
                <?php if ($post['image']): ?>
                    <p>Текущая картинка: <img src="../<?= h($post['image']) ?>" width="100" alt=""></p>
                <?php endif; ?>
            </div>
            <button type="submit">Сохранить</button>
        </form>
    </main>
    <footer class="footer">
        <div class="container">
            <p>&copy; <?= date('Y') ?> Мой Блог. Все права защищены.</p>
        </div>
    </footer>
</body>
</html>