import { auth } from './auth.js';

export function initApp() {
    initCart();
    
    if (!window.location.pathname.includes('login.html') && 
        !window.location.pathname.includes('admin.html')) {
        if (!auth.checkAuth()) {
            window.location.href = 'login.html';
            return;
        }
    }
    
    addAdminLink();
    addLogoutButton();
}

async function addAdminLink() {
    const isAdmin = await auth.isAdmin();
    if (isAdmin) {
        const nav = document.querySelector('nav');
        if (nav && !document.querySelector('a[href="admin.html"]')) {
            const adminLink = document.createElement('a');
            adminLink.href = 'admin.html';
            adminLink.textContent = 'Админка';
            adminLink.id = 'admin-link';
            
            if (window.location.pathname.includes('admin.html')) {
                adminLink.classList.add('active');
            }
            
            nav.appendChild(adminLink);
        }
    }
}

function addLogoutButton() {
    if (!document.querySelector('.logout-btn')) {
        const header = document.querySelector('header');
        const cartBtn = document.querySelector('.cart-btn');
        
        if (header && cartBtn) {
            const logoutBtn = document.createElement('button');
            logoutBtn.className = 'logout-btn';
            logoutBtn.textContent = 'Выйти';
            logoutBtn.onclick = () => auth.logout();
            
            header.insertBefore(logoutBtn, cartBtn);
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
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
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

    const sizes = document.querySelectorAll('.size');
    sizes.forEach(size => {
        size.addEventListener('click', function() {
            sizes.forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}