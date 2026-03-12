<?php
session_start();
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/functions.php';

$currentUser = getCurrentUser($pdo);
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Мой Блог</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <header>
        <nav class="navbar">
            <div class="container">
                <a href="index.php" class="logo">Мой Блог</a>
                <input type="checkbox" id="burger-toggle">
                <label for="burger-toggle" class="burger-icon">☰</label>
                <ul class="nav-menu">
                    <li><a href="index.php">Главная</a></li>
                    <?php if (isLoggedIn()): ?>
                        <li><a href="#">Привет, <?= h($currentUser['username']) ?></a></li>
                        <?php if (isAdmin()): ?>
                            <li><a href="/blog/admin/">Админ-панель</a></li>
                        <?php endif; ?>
                        <li><a href="logout.php">Выйти</a></li>
                    <?php else: ?>
                        <li><a href="login.php">Вход</a></li>
                        <li><a href="register.php">Регистрация</a></li>
                    <?php endif; ?>
                </ul>
            </div>
        </nav>
    </header>
    <main class="container">