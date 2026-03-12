<?php
session_start();
require_once '../config/db.php';
require_once '../includes/functions.php';

if (!isAdmin()) {
    header('Location: ../login.php');
    exit;
}

header('Location: posts.php');
exit;