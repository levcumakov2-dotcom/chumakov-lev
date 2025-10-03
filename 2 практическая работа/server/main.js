import { auth } from './auth.js';

export function initApp() {
    // Инициализация корзины
    initCart();
    
    // Проверка авторизации для защищенных страниц
    if (!window.location.pathname.includes('login.html')) {
        if (!auth.checkAuth()) {
            window.location.href = 'login.html';
            return;
        }
    }
}

function initCart() {
    let cartCount = localStorage.getItem('cartCount') || 0;
    const cartButtons = document.querySelectorAll('.add-to-cart');
    const cartCounter = document.querySelector('.cart-count');
    
    if (cartCounter) {
        cartCounter.textContent = cartCount;
    }

    cartButtons.forEach(button => {
        button.addEventListener('click', function() {
            cartCount++;
            localStorage.setItem('cartCount', cartCount);
            if (cartCounter) {
                cartCounter.textContent = cartCount;
            }
            
            const originalText = this.textContent;
            this.textContent = 'Добавлено!';
            this.style.background = '#27ae60';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = '';
            }, 1500);
        });
    });

    // Обработчики для выбора размера
    const sizes = document.querySelectorAll('.size');
    sizes.forEach(size => {
        size.addEventListener('click', function() {
            sizes.forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}