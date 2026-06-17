// cart.js - функции для страницы корзины

// Добавляем функции работы с корзиной
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCounts = document.querySelectorAll('.cart-count');
    cartCounts.forEach(element => {
        element.textContent = totalItems;
    });
}

function renderCart() {
    const cart = getCart();
    const cartContent = document.getElementById('cart-content');
    
    if (!cartContent) return;
    
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h2>Ваша корзина пуста</h2>
                <p>Добавьте товары из каталога</p>
                <a href="catalog.html" class="btn" style="margin-top: 20px;">Перейти в каталог</a>
            </div>
        `;
        return;
    }
    
    let total = 0;
    let itemsHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        itemsHTML += `
            <div class="cart-item">
                <img src="${item.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'}" 
                     alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>Артикул: ${item.id}</p>
                </div>
                <div class="cart-item-price">${item.price.toLocaleString()} ₽</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn-small" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn-small" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <div class="cart-item-total">${itemTotal.toLocaleString()} ₽</div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">×</button>
            </div>
        `;
    });
    
    cartContent.innerHTML = `
        <div class="cart-layout">
            <div class="cart-items">
                ${itemsHTML}
            </div>
            <div class="cart-summary">
                <div class="cart-total">Итого: ${total.toLocaleString()} ₽</div>
                <button class="btn checkout-btn" onclick="checkout()">Оформить заказ</button>
                <p style="text-align: center; margin-top: 15px; color: #666;">
                    Бесплатная доставка при заказе от 20 000 ₽
                </p>
            </div>
        </div>
    `;
}

function updateQuantity(id, change) {
    const cart = getCart();
    const item = cart.find(item => item.id === id);
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart.splice(cart.indexOf(item), 1);
        }
        saveCart(cart);
        renderCart();
        updateCartCount();
    }
}

function removeFromCart(id) {
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
        cart.splice(itemIndex, 1);
        saveCart(cart);
        renderCart();
        updateCartCount();
    }
}

// В cart.js замените функцию checkout на:
function checkout() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }
    
    // Перенаправляем на страницу оформления заказа
    window.location.href = 'checkout.html';
}

// Инициализация корзины при загрузке
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('cart-content')) {
        renderCart();
    }
    updateCartCount();
});