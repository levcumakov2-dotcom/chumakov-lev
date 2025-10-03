import { products } from './mockDB.js';

// Загрузка всех товаров
export function loadProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    container.innerHTML = products.map(product => `
        <div class="card" onclick="openProduct(${product.id})">
            <img src="${product.image}" alt="${product.name}">
            <div class="card-content">
                <h3>${product.name}</h3>
                <p>${product.description.substring(0, 100)}...</p>
                <div class="price">${product.price} ₽</div>
                <button class="btn-view" onclick="event.stopPropagation(); openProduct(${product.id})">
                    Подробнее
                </button>
            </div>
        </div>
    `).join('');
}

// Получение товара по ID
export function getProductById(productId) {
    return products.find(p => p.id === productId);
}

// Поиск товаров
export function searchProducts(query) {
    return products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
}