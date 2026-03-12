<?php
require_once 'includes/header.php';

$limit = 5;
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
if ($page < 1) $page = 1;
$offset = ($page - 1) * $limit;

$totalStmt = $pdo->query("SELECT COUNT(*) FROM posts");
$totalPosts = $totalStmt->fetchColumn();
$totalPages = ceil($totalPosts / $limit);

$stmt = $pdo->prepare("
    SELECT p.*, u.username, u.id as user_id 
    FROM posts p 
    JOIN users u ON p.user_id = u.id 
    ORDER BY p.created_at DESC 
    LIMIT :limit OFFSET :offset
");
$stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
$stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$posts = $stmt->fetchAll();
?>

<h1>Последние посты</h1>

<div class="posts">
    <?php if (empty($posts)): ?>
        <p>Пока нет ни одной статьи.</p>
    <?php else: ?>
        <?php foreach ($posts as $post): ?>
            <article class="post-card">
                <?php if ($post['image']): ?>
                    <img src="<?= h($post['image']) ?>" alt="<?= h($post['title']) ?>" class="post-image">
                <?php endif; ?>
                <h2><a href="post.php?id=<?= $post['id'] ?>"><?= h($post['title']) ?></a></h2>
                <div class="post-meta">
                    Автор: <?= h($post['username']) ?> | 
                    Дата: <?= date('d.m.Y H:i', strtotime($post['created_at'])) ?>
                </div>
                <p class="post-excerpt">
                    <?= h(substr($post['content'], 0, 200)) ?>...
                </p>
                <a href="post.php?id=<?= $post['id'] ?>" class="read-more">Читать далее</a>
            </article>
        <?php endforeach; ?>
    <?php endif; ?>
</div>

<?php if ($totalPages > 1): ?>
    <div class="pagination">
        <?php if ($page > 1): ?>
            <a href="?page=<?= $page - 1 ?>">« Предыдущая</a>
        <?php endif; ?>

        <?php for ($i = 1; $i <= $totalPages; $i++): ?>
            <?php if ($i == $page): ?>
                <span class="current"><?= $i ?></span>
            <?php else: ?>
                <a href="?page=<?= $i ?>"><?= $i ?></a>
            <?php endif; ?>
        <?php endfor; ?>

        <?php if ($page < $totalPages): ?>
            <a href="?page=<?= $page + 1 ?>">Следующая »</a>
        <?php endif; ?>
    </div>
<?php endif; ?>

<?php require_once 'includes/footer.php'; ?>