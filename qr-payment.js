// qr-payment.js - простой генератор QR-кодов для демо

class QRPaymentSystem {
    constructor() {
        this.supportedBanks = ['Сбербанк', 'Тинькофф', 'ВТБ', 'Альфа-Банк', 'Газпромбанк'];
    }

    // Простая генерация QR данных (без реального API)
    generateSimpleQR(orderData) {
        return {
            orderId: orderData.orderId,
            amount: orderData.total,
            currency: 'RUB',
            purpose: `Оплата заказа ${orderData.orderId}`,
            merchant: 'Фмгрупп',
            timestamp: new Date().toISOString()
        };
    }

    // Получить инструкции для банка
    getBankInstructions(bankName) {
        const instructions = {
            'Сбербанк': 'Откройте приложение СберБанк Онлайн → Камера → QR-код',
            'Тинькофф': 'Приложение Тинькофф → Платежи → QR-код',
            'ВТБ': 'ВТБ Онлайн → Оплата → По QR-коду',
            'Альфа-Банк': 'Альфа-Банк → Камера → Считать QR',
            'Газпромбанк': 'ГПБ → Платежи → QR-код'
        };
        return instructions[bankName] || 'Откройте приложение банка и выберите оплату по QR-коду';
    }
}

// Показать выбор банка при клике на QR-оплату
document.addEventListener('DOMContentLoaded', function() {
    const qrMethod = document.querySelector('.payment-method input[value="qr"]');
    if (qrMethod) {
        qrMethod.closest('.payment-method').addEventListener('click', function() {
            // Показываем дополнительную информацию о банках
            console.log('QR оплата выбрана. Поддерживаемые банки:', 
                new QRPaymentSystem().supportedBanks);
        });
    }
});