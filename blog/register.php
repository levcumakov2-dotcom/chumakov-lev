<?php
require_once 'includes/header.php';

$errors = [];
$success = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $password_confirm = $_POST['password_confirm'] ?? '';

    if (empty($username)) $errors[] = 'Имя не может быть пустым.';
    if (empty($email)) $errors[] = 'Email не может быть пустым.';
    elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Неверный формат email.';
    
    if (empty($password)) $errors[] = 'Пароль не может быть пустым.';
    elseif (strlen($password) < 6) $errors[] = 'Пароль должен быть не менее 6 символов.';
    
    if ($password !== $password_confirm) $errors[] = 'Пароли не совпадают.';

    if (empty($errors)) {
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? OR username = ?");
        $stmt->execute([$email, $username]);
        if ($stmt->fetch()) {
            $errors[] = 'Пользователь с таким именем или email уже существует.';
        }
    }

    if (empty($errors)) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'user')");
        if ($stmt->execute([$username, $email, $hashedPassword])) {
            $success = true;
        } else {
            $errors[] = 'Ошибка при регистрации. Попробуйте позже.';
        }
    }
}
?>

<h2>Регистрация</h2>
<?php if ($success): ?>
    <p style="color: green;">Регистрация прошла успешно! <a href="login.php">Войдите</a> на сайт.</p>
<?php else: ?>
    <?php if (!empty($errors)): ?>
        <div class="errors">
            <?php foreach ($errors as $error): ?>
                <p style="color: red;"><?= h($error) ?></p>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
    <form method="post" class="form">
        <div>
            <label for="username">Имя:</label>
            <input type="text" id="username" name="username" value="<?= h($_POST['username'] ?? '') ?>" required>
        </div>
        <div>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" value="<?= h($_POST['email'] ?? '') ?>" required>
        </div>
        <div>
            <label for="password">Пароль (мин. 6 символов):</label>
            <input type="password" id="password" name="password" required>
        </div>
        <div>
            <label for="password_confirm">Подтверждение пароля:</label>
            <input type="password" id="password_confirm" name="password_confirm" required>
        </div>
        <button type="submit">Зарегистрироваться</button>
    </form>
<?php endif; ?>

<?php require_once 'includes/footer.php'; ?>