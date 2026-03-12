<?php
require_once 'includes/header.php';

$postId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

$stmt = $pdo->prepare("
    SELECT p.*, u.username 
    FROM posts p 
    JOIN users u ON p.user_id = u.id 
    WHERE p.id = ?
");
$stmt->execute([$postId]);
$post = $stmt->fetch();

if (!$post) {
    http_response_code(404);
    echo "<h1>Пост не найден</h1>";
    require_once 'includes/footer.php';
    exit;
}

$stmtComments = $pdo->prepare("
    SELECT c.*, u.username 
    FROM comments c 
    JOIN users u ON c.user_id = u.id 
    WHERE c.post_id = ? 
    ORDER BY c.created_at DESC
");
$stmtComments->execute([$postId]);
$comments = $stmtComments->fetchAll();
?>

<article class="post-full">
    <h1><?= h($post['title']) ?></h1>
    <div class="post-meta">
        Автор: <?= h($post['username']) ?> | 
        Дата: <?= date('d.m.Y H:i', strtotime($post['created_at'])) ?>
    </div>
    <?php if ($post['image']): ?>
        <img src="<?= h($post['image']) ?>" alt="<?= h($post['title']) ?>" class="post-full-image">
    <?php endif; ?>
    <div class="post-content">
        <?= nl2br(h($post['content'])) ?>
    </div>
</article>

<section class="comments-section">
    <h3>Комментарии (<span id="comments-count"><?= count($comments) ?></span>)</h3>
    
    <div id="comments-list">
        <?php foreach ($comments as $comment): ?>
            <div class="comment" id="comment-<?= $comment['id'] ?>">
                <div class="comment-meta">
                    <strong><?= h($comment['username']) ?></strong> | 
                    <?= date('d.m.Y H:i', strtotime($comment['created_at'])) ?>
                </div>
                <div class="comment-content">
                    <?= nl2br(h($comment['content'])) ?>
                </div>
                <button class="like-btn" data-id="<?= $comment['id'] ?>" data-type="comment">❤️ <span>0</span></button>
            </div>
        <?php endforeach; ?>
    </div>

    <?php if (isLoggedIn()): ?>
        <form id="comment-form" class="comment-form">
            <input type="hidden" name="post_id" value="<?= $postId ?>">
            <div>
                <label for="comment-content">Ваш комментарий:</label>
                <textarea id="comment-content" name="content" rows="4" required></textarea>
            </div>
            <button type="submit">Отправить</button>
        </form>
    <?php else: ?>
        <p>Чтобы оставить комментарий, <a href="login.php">войдите</a> на сайт.</p>
    <?php endif; ?>
</section>

<script>
document.getElementById('comment-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const response = await fetch('ajax/add_comment.php', {
        method: 'POST',
        body: formData
    });
    
    if (response.ok) {
        const newComment = await response.json();
        const commentsList = document.getElementById('comments-list');
        const newCommentHtml = `
            <div class="comment" id="comment-${newComment.id}">
                <div class="comment-meta">
                    <strong>${newComment.username}</strong> | ${newComment.date}
                </div>
                <div class="comment-content">
                    ${newComment.content.replace(/\n/g, '<br>')}
                </div>
                <button class="like-btn" data-id="${newComment.id}" data-type="comment">❤️ <span>0</span></button>
            </div>
        `;
        commentsList.insertAdjacentHTML('afterbegin', newCommentHtml);
        
        const countSpan = document.getElementById('comments-count');
        countSpan.textContent = parseInt(countSpan.textContent) + 1;
        
        document.getElementById('comment-content').value = '';
    } else {
        alert('Ошибка при добавлении комментария');
    }
});

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('like-btn')) {
        e.preventDefault();
        const span = e.target.querySelector('span');
        if (span) {
            span.textContent = parseInt(span.textContent) + 1;
        }
    }
});
</script>

<?php require_once 'includes/footer.php'; ?>