<?php
require_once 'includes/header.php';

if (isLoggedIn()) {
    header('Location: index.php');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        $error = 'Заполните все поля.';
    } else {
        $stmt = $pdo->prepare("SELECT id, username, password, role FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            // Успешный вход
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_role'] = $user['role'];
            $_SESSION['user_name'] = $user['username'];
            header('Location: index.php');
            exit;
        } else {
            $error = 'Неверный email или пароль.';
        }
    }
}
?>

<h2>Вход на сайт</h2>
<?php if ($error): ?>
    <p style="color: red;"><?= h($error) ?></p>
<?php endif; ?>
<form method="post" class="form">
    <div>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
    </div>
    <div>
        <label for="password">Пароль:</label>
        <input type="password" id="password" name="password" required>
    </div>
    <button type="submit">Войти</button>
</form>

<?php require_once 'includes/footer.php'; ?>