// checkout.js - функции для страницы оформления заказа

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCounts = document.querySelectorAll('.cart-count');
    cartCounts.forEach(element => {
        element.textContent = totalItems;
    });
}

function renderCheckout() {
    const cart = getCart();
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    
    if (!checkoutItems || !checkoutTotal) return;
    
    if (cart.length === 0) {
        checkoutItems.innerHTML = '<p>Корзина пуста</p>';
        checkoutTotal.textContent = 'Итого: 0 ₽';
        return;
    }
    
    let total = 0;
    let itemsHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        itemsHTML += `
            <div class="cart-item" style="margin-bottom: 15px; padding: 15px; border-bottom: 1px solid #eee;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+0KLQvtCx0LU8L3RleHQ+PC9zdmc+'">
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 5px 0; color: #2c3e50;">${item.name}</h4>
                        <p style="margin: 0; color: #666; font-size: 14px;">Количество: ${item.quantity}</p>
                    </div>
                    <div style="font-weight: bold; color: #e74c3c;">${itemTotal.toLocaleString()} ₽</div>
                </div>
            </div>
        `;
    });
    
    checkoutItems.innerHTML = itemsHTML;
    checkoutTotal.textContent = `Итого: ${total.toLocaleString()} ₽`;
}

function setupCheckoutForm() {
    const form = document.getElementById('checkout-form');
    const paymentMethods = document.querySelectorAll('.payment-method');
    const qrSection = document.getElementById('qr-payment-section');
    
    if (!form) return;
    
    // Обработчики для выбора способа оплаты
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            paymentMethods.forEach(m => m.classList.remove('active'));
            this.classList.add('active');
            const radio = this.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
            
            // Показать/скрыть секцию QR-кода
            if (radio.value === 'qr' && qrSection) {
                qrSection.style.display = 'block';
                document.getElementById('payment-status').textContent = 'Статус: выбран QR-код';
            } else if (qrSection) {
                qrSection.style.display = 'none';
            }
        });
    });
    
    // Обработчик отправки формы
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const cart = getCart();
        if (cart.length === 0) {
            alert('Корзина пуста!');
            return;
        }
        
        const formData = new FormData(this);
        const paymentMethod = formData.get('payment');
        
        const orderData = {
            customer: {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                address: formData.get('address'),
                comment: formData.get('comment')
            },
            payment: paymentMethod,
            items: cart,
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            orderId: 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
        };
        
        if (paymentMethod === 'qr') {
            // Для QR-кода
            await processQRPayment(orderData);
        } else {
            // Для других методов оплаты
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(orderData);
            localStorage.setItem('orders', JSON.stringify(orders));
            
            localStorage.removeItem('cart');
            updateCartCount();
            
            alert(`Заказ №${orderData.orderId} успешно оформлен!\n\nСумма: ${orderData.total.toLocaleString()} ₽\nСпособ оплаты: ${getPaymentMethodName(orderData.payment)}\n\nСпасибо за покупку!`);
            
            window.location.href = 'index.html';
        }
    });
}

function getPaymentMethodName(paymentMethod) {
    switch(paymentMethod) {
        case 'card': return 'Банковская карта';
        case 'cash': return 'Наличными при получении';
        case 'online': return 'Онлайн-банкинг';
        case 'qr': return 'QR-код';
        default: return 'Не указан';
    }
}

// Обработка оплаты QR-кодом
async function processQRPayment(orderData) {
    // Показываем секцию QR
    const qrSection = document.getElementById('qr-payment-section');
    if (qrSection) qrSection.style.display = 'block';
    
    // Генерируем QR-код локально (без сервера)
    generateQRCodeLocal(orderData);
    
    // Сохраняем заказ
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Очищаем корзину
    localStorage.removeItem('cart');
    updateCartCount();
    
    // Запускаем "симуляцию" оплаты
    simulatePaymentCheck(orderData.orderId);
}

// Локальная генерация QR-кода (без сервера)
function generateQRCodeLocal(orderData) {
    const qrPlaceholder = document.getElementById('qr-code-placeholder');
    if (!qrPlaceholder) return;
    
    // Формируем данные для QR (простой текст)
    const qrText = `Оплата заказа: ${orderData.orderId}\nСумма: ${orderData.total} ₽\nМагазин: Фмгрупп`;
    
    // Если есть библиотека qrcode.js, используем её:
    // QRCode.toCanvas(document.getElementById('qr-canvas'), qrText, ...)
    
    // Вместо этого покажем текстовую информацию
    qrPlaceholder.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="background: #fff; border: 2px dashed #3498db; padding: 20px; display: inline-block; margin-bottom: 15px;">
                <div style="font-size: 24px;">QR-код</div>
                <div style="font-size: 18px; margin: 10px 0;">Заказ №${orderData.orderId}</div>
                <div style="font-size: 22px; color: #e74c3c; font-weight: bold;">${orderData.total.toLocaleString()} ₽</div>
            </div>
            <p><strong>Скопируйте данные для оплаты:</strong></p>
            <textarea readonly style="width: 100%; height: 80px; padding: 10px; font-family: monospace; background: #f8f9fa; border: 1px solid #ddd; border-radius: 4px;">${qrText}</textarea>
            <p style="margin-top: 15px; color: #666; font-size: 14px;">1. Откройте приложение банка → 2. Выберите "Оплата по QR" → 3. Наведите камеру → 4. Подтвердите</p>
        </div>
    `;
    
    // Обновляем статус
    document.getElementById('payment-status').textContent = 'Статус: ожидание оплаты...';
}

// Симуляция проверки оплаты (в реальном приложении будет запрос к серверу)
function simulatePaymentCheck(orderId) {
    let seconds = 0;
    const statusElement = document.getElementById('payment-status');
    if (!statusElement) return;
    
    const interval = setInterval(() => {
        seconds += 5;
        statusElement.textContent = `Статус: ожидание оплаты... (${seconds} сек)`;
        
        // Через 30 секунд "принимаем" оплату (для демо)
        if (seconds >= 30) {
            clearInterval(interval);
            statusElement.innerHTML = '✅ <strong>Оплата подтверждена!</strong>';
            statusElement.style.color = '#27ae60';
            
            setTimeout(() => {
                alert('Оплата прошла успешно! Спасибо за покупку.');
                window.location.href = 'index.html';
            }, 2000);
        }
    }, 5000);
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('checkout-form')) {
        renderCheckout();
        setupCheckoutForm();
        updateCartCount();
    }
});