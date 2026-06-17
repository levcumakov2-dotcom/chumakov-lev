// script.js - общие функции для всего сайта

// БЛОКИРОВКА ПРОБЛЕМНОГО РАСШИРЕНИЯ
(function() {
    // Блокируем объекты расширения
    if (typeof window.we !== 'undefined') {
        Object.defineProperty(window, 'we', {
            value: {},
            writable: false,
            configurable: false
        });
    }
    
    // Блокируем создание устаревших обработчиков
    window.onunload = null;
    window.onbeforeunload = null;
    
    // Перехватываем addEventListener для блокировки unload событий
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'unload' || type === 'beforeunload') {
            console.log('Блокируем устаревшее событие от расширения:', type);
            return;
        }
        return originalAddEventListener.call(this, type, listener, options);
    };
})();

// Данные всех товаров
const productsData = {
    1: {
        id: 1,
        name: 'Угловой диван "Комфорт"',
        price: 25990,
        images: [
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        ],
        description: 'Просторный угловой диван "Комфорт" станет центральным элементом вашей гостиной. Модель отличается эргономичным дизайном и высоким уровнем комфорта.',
        features: [
            'Материал: Ткань велюр',
            'Цвет: Серый',
            'Размер: 220×160×90 см',
            'Механизм: Еврокнижка',
            'Наполнитель: ППУ, периотек',
            'Страна производства: Россия'
        ],
        advantages: [
            'Вместительные ящики для хранения белья',
            'Съемные чехлы для легкой чистки',
            'Ортопедическое основание',
            'Устойчивые ножки с регулировкой высоты'
        ],
        rating: 4,
        reviews: 24
    },
    2: {
        id: 2,
        name: 'Кровать двуспальная "Люкс"',
        price: 34500,
        images: [
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        ],
        description: 'Роскошная двуспальная кровать из массива дерева с ортопедическим основанием для комфортного сна.',
        features: [
            'Материал: Массив дерева',
            'Цвет: Натуральное дерево',
            'Размер: 200×160×110 см',
            'Основание: Ортопедическое',
            'Матрас: В комплекте',
            'Страна производства: Россия'
        ],
        advantages: [
            'Прочный каркас из массива дерева',
            'Ортопедическое основание',
            'Большое пространство для хранения',
            'Легкая сборка'
        ],
        rating: 5,
        reviews: 18
    },
    3: {
        id: 3,
        name: 'Обеденный стол "Модерн"',
        price: 15750,
        images: [
            'https://avatars.mds.yandex.net/i?id=4da16a783f75e2e008acd085a8da7d245ee7b3f6-3917045-images-thumbs&n=13',
        ],
        description: 'Элегантный обеденный стол из массива дуба с расширяемой столешницей для комфортных приемов пищи.',
        features: [
            'Материал: Массив дуба',
            'Цвет: Светлое дерево',
            'Размер: 120×80×75 см',
            'Тип: Расширяемый',
            'Форма: Прямоугольная',
            'Страна производства: Беларусь'
        ],
        advantages: [
            'Расширяемая столешница',
            'Прочный массив дуба',
            'Легко чистится',
            'Устойчивая конструкция'
        ],
        rating: 4,
        reviews: 32
    },
    4: {
        id: 4,
        name: 'Детская кровать "Радуга"',
        price: 18900,
        images: [
            'https://avatars.mds.yandex.net/i?id=03d80a766ce6af36efa599e952899c074c5326d8-6489726-images-thumbs&n=13',
        ],
        description: 'Безопасная и яркая детская кровать с бортиками для комфортного сна вашего ребенка.',
        features: [
            'Материал: Массив березы',
            'Цвет: Натуральное дерево',
            'Размер: 160×80×90 см',
            'Бортики: Съемные',
            'Возраст: 3-10 лет',
            'Страна производства: Россия'
        ],
        advantages: [
            'Безопасные закругленные углы',
            'Съемные защитные бортики',
            'Экологичные материалы',
            'Яркий дизайн'
        ],
        rating: 5,
        reviews: 15
    },
    5: {
        id: 5,
        name: 'Кресло кожаное "Престиж"',
        price: 18900,
        images: [
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        ],
        description: 'Элегантное кожаное кресло для гостиной или кабинета с высокой спинкой и комфортной посадкой.',
        features: [
            'Материал: Натуральная кожа',
            'Цвет: Коричневый',
            'Размер: 85×95×105 см',
            'Каркас: Массив дерева',
            'Наполнитель: ППУ высокой плотности',
            'Страна производства: Италия'
        ],
        advantages: [
            'Натуральная кожа премиум-класса',
            'Эргономичная спинка',
            'Прочный деревянный каркас',
            'Стильный классический дизайн'
        ],
        rating: 4,
        reviews: 27
    },
    6: {
        id: 6,
        name: 'Шкаф-купе 3-дверный',
        price: 42300,
        images: [
            'https://avatars.mds.yandex.net/i?id=62b4b3fa573c124b34701f433ae03749082eca15-16547823-images-thumbs&n=13',
        ],
        description: 'Вместительный шкаф-купе с зеркальными дверями для организации пространства в спальне или прихожей.',
        features: [
            'Материал: ЛДСП',
            'Цвет: Белый/зеркало',
            'Размер: 240×60×220 см',
            'Двери: Раздвижные',
            'Внутреннее наполнение: Регулируемое',
            'Страна производства: Россия'
        ],
        advantages: [
            'Зеркальные двери экономят пространство',
            'Вместительные отделения',
            'Регулируемые полки',
            'Плавный ход дверей'
        ],
        rating: 4,
        reviews: 21
    },
    7: {
        id: 7,
        name: 'Кухонный гарнитур "Лайн"',
        price: 32400,
        images: [
            'https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        ],
        description: 'Современный кухонный гарнитур с барной стойкой для создания функционального и стильного интерьера.',
        features: [
            'Материал: МДФ с пленкой',
            'Цвет: Серый матовый',
            'Размер: 300×60×220 см',
            'Фурнитура: Blum',
            'Столешница: Искусственный камень',
            'Страна производства: Германия'
        ],
        advantages: [
            'Современный дизайн',
            'Качественная фурнитура',
            'Удобная барная стойка',
            'Легкость в уходе'
        ],
        rating: 5,
        reviews: 19
    },
    8: {
        id: 8,
        name: 'Детский письменный стол',
        price: 12400,
        images: [
            'https://avatars.mds.yandex.net/i?id=2eeacfb293651c695702f51f258bb804c59e8d6c-4078442-images-thumbs&n=13',
        ],
        description: 'Эргономичный детский письменный стол с регулируемой высотой для школьников.',
        features: [
            'Материал: ЛДСП',
            'Цвет: Белый/синий',
            'Размер: 110×60×75 см',
            'Регулировка высоты: 60-80 см',
            'Наклон столешницы: 0-30 градусов',
            'Страна производства: Россия'
        ],
        advantages: [
            'Регулируемая высота',
            'Наклонная столешница',
            'Встроенные полки',
            'Эргономичный дизайн'
        ],
        rating: 4,
        reviews: 23
    },
    9: {
        id: 9,
        name: 'Детский стул "Малыш"',
        price: 8600,
        images: [
            'https://avatars.mds.yandex.net/i?id=21a4b86b89c9de1d7a9542a38b2659f13ea5ba2c-4390197-images-thumbs&n=13',
        ],
        description: 'Комфортный детский стул с регулировкой высоты для правильной осанки ребенка.',
        features: [
            'Материал: Пластик, металл',
            'Цвет: Разноцветный',
            'Высота: 30-50 см',
            'Спинка: Ортопедическая',
            'Возраст: 3-12 лет',
            'Страна производства: Россия'
        ],
        advantages: [
            'Регулировка по высоте',
            'Ортопедическая спинка',
            'Яркий дизайн',
            'Легкий и прочный'
        ],
        rating: 4,
        reviews: 17
    }
};

// Функция для загрузки данных товара
function loadProductData() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId && productsData[productId]) {
        const product = productsData[productId];
        updateProductPage(product);
    } else {
        // Если товар не найден, показываем первый товар
        const product = productsData[1];
        updateProductPage(product);
    }
}

// Функция обновления страницы товара
function updateProductPage(product) {
    // Обновляем заголовок страницы
    document.title = `${product.name} | Фмгрупп`;
    
    // Обновляем хлебные крошки
    const breadcrumbs = document.querySelector('.breadcrumbs span');
    if (breadcrumbs) {
        breadcrumbs.textContent = product.name;
    }
    
    // Обновляем галерею
    const mainImage = document.querySelector('.main-image img');
    const thumbnails = document.querySelector('.thumbnails');
    
    if (mainImage && product.images.length > 0) {
        mainImage.src = product.images[0];
        mainImage.alt = product.name;
    }
    
    if (thumbnails) {
        thumbnails.innerHTML = '';
        product.images.forEach((image, index) => {
            const thumb = document.createElement('img');
            thumb.src = image;
            thumb.alt = `${product.name} - вид ${index + 1}`;
            thumb.classList.toggle('active', index === 0);
            thumb.addEventListener('click', function() {
                mainImage.src = this.src;
                document.querySelectorAll('.thumbnails img').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
            thumbnails.appendChild(thumb);
        });
    }
    
    // Обновляем информацию о товаре
    const productName = document.querySelector('.product-info-detail h1');
    const productRating = document.querySelector('.product-rating');
    const productPrice = document.querySelector('.product-price-large');
    const featuresList = document.querySelector('.product-features ul');
    const description = document.querySelector('.product-description-detail');
    
    if (productName) productName.textContent = product.name;
    if (productRating) productRating.innerHTML = `${'★'.repeat(product.rating)}${'☆'.repeat(5-product.rating)} <span class="rating-count">(${product.reviews} отзыва)</span>`;
    if (productPrice) productPrice.textContent = `${product.price.toLocaleString()} ₽`;
    
    if (featuresList) {
        featuresList.innerHTML = '';
        product.features.forEach(feature => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${feature.split(':')[0]}:</strong> ${feature.split(':')[1]}`;
            featuresList.appendChild(li);
        });
    }
    
    if (description) {
        description.innerHTML = `
            <h2>Описание товара</h2>
            <p>${product.description}</p>
            ${product.advantages ? `
            <h3>Преимущества:</h3>
            <ul>
                ${product.advantages.map(adv => `<li>${adv}</li>`).join('')}
            </ul>
            ` : ''}
        `;
    }
    
    // Обновляем обработчик добавления в корзину
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.onclick = function() {
            addToCartFromProduct(
                product.id, 
                product.name, 
                product.price, 
                product.images[0]
            );
        };
    }
}

// Функции для корзины
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

function addToCartFromData(productData, button) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productData.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productData.id,
            name: productData.name,
            price: productData.price,
            image: productData.image,
            quantity: 1
        });
    }
    
    saveCart(cart);
    
    // Визуальный фидбэк
    if (button) {
        const originalText = button.textContent;
        button.textContent = 'Добавлено!';
        button.style.background = '#27ae60';
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }
}

function addToCartFromProduct(productId, productName, productPrice, productImage) {
    const quantityInput = document.getElementById('product-quantity');
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: quantity
        });
    }
    
    saveCart(cart);
    
    // Визуальный фидбэк
    const button = document.querySelector('.add-to-cart-large');
    if (button) {
        const originalText = button.textContent;
        button.textContent = 'Добавлено в корзину!';
        button.style.background = '#27ae60';
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем данные товара если мы на странице товара
    if (window.location.pathname.includes('product.html')) {
        loadProductData();
    }
    
    updateCartCount();
    
    // Обработчики для кнопок "В корзину"
    const addToCartButtons = document.querySelectorAll('.add-to-cart[data-product]');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            try {
                const productData = JSON.parse(this.getAttribute('data-product'));
                addToCartFromData(productData, this);
            } catch (e) {
                console.error('Ошибка парсинга данных товара:', e);
            }
        });
    });
    
    // Управление количеством на странице товара
    const quantityInput = document.querySelector('.quantity-input');
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    
    if (quantityInput && quantityBtns) {
        quantityBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                let value = parseInt(quantityInput.value);
                if (this.textContent === '+') {
                    value++;
                } else if (this.textContent === '-' && value > 1) {
                    value--;
                }
                quantityInput.value = value;
            });
        });
    }
    
    // Смена изображений в галерее
    const thumbnails = document.querySelectorAll('.thumbnails img');
    const mainImage = document.querySelector('.main-image img');
    
    if (thumbnails.length > 0 && mainImage) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                mainImage.src = this.src;
                // Убираем активный класс у всех и добавляем текущему
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    // Фильтрация в каталоге
    const filterBtn = document.querySelector('.filter-btn');
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            const category = document.getElementById('category').value;
            const price = document.getElementById('price').value;
            const material = document.getElementById('material').value;
            const productCards = document.querySelectorAll('.product-card');
            
            productCards.forEach(card => {
                let show = true;
                
                if (category !== 'all' && card.dataset.category !== category) {
                    show = false;
                }
                
                if (material !== 'all' && card.dataset.material !== material) {
                    show = false;
                }
                
                if (price !== 'all') {
                    const cardPrice = parseInt(card.dataset.price);
                    if (price === '0-10000' && cardPrice > 10000) show = false;
                    if (price === '10000-30000' && (cardPrice < 10000 || cardPrice > 30000)) show = false;
                    if (price === '30000-50000' && (cardPrice < 30000 || cardPrice > 50000)) show = false;
                    if (price === '50000+' && cardPrice < 50000) show = false;
                }
                
                card.style.display = show ? 'block' : 'none';
            });
        });
    }
    
    // Пагинация
    const pageBtns = document.querySelectorAll('.page-btn');
    pageBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('next')) {
                pageBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Обработчик для кнопки добавления в корзину на странице товара
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            // Теперь эта кнопка работает через loadProductData()
        });
    }

    // Обработчики для кнопок "В корзину" в похожих товарах на странице продукта
    const relatedAddToCartButtons = document.querySelectorAll('.related-products .add-to-cart[data-product]');
    relatedAddToCartButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            try {
                const productData = JSON.parse(this.getAttribute('data-product'));
                addToCartFromData(productData, this);
            } catch (e) {
                console.error('Ошибка парсинга данных товара:', e);
            }
        });
    });
});