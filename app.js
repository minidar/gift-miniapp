// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Переменные
let selectedGiftId = null;
let selectedGiftName = null;
let gifts = [];

// Получаем данные пользователя
const user = tg.initDataUnsafe?.user || { id: 0, username: 'guest' };
console.log('👤 Пользователь:', user);

// DOM элементы
const giftList = document.getElementById('gift-list');
const sendBtn = document.getElementById('sendBtn');
const statusDiv = document.getElementById('status');

// Загрузка подарков
async function loadGifts() {
    try {
        setStatus('⏳ Загрузка подарков...', 'loading');
        
        // Отправляем запрос боту
        const data = { action: 'get_gifts' };
        tg.sendData(JSON.stringify(data));
        
        // Бот отвечает через сообщение
        // В реальности нужно использовать ответ от бота
        // Пока используем заглушку
        setTimeout(() => {
            gifts = [
                { id: 1, name: 'Happy Brownie', emoji: '🍫', price: '100⭐' },
                { id: 2, name: 'CryptoPunk', emoji: '👾', price: '500⭐' },
                { id: 3, name: 'Bored Ape', emoji: '🦧', price: '1000⭐' },
            ];
            renderGifts();
            setStatus('✅ Выберите подарок для отправки', 'success');
        }, 500);
        
    } catch (error) {
        console.error('❌ Ошибка загрузки:', error);
        setStatus('❌ Ошибка загрузки подарков', 'error');
    }
}

// Отображение подарков
function renderGifts() {
    giftList.innerHTML = '';
    
    if (!gifts || gifts.length === 0) {
        giftList.innerHTML = '<div class="loading">📭 У вас нет подарков</div>';
        return;
    }
    
    gifts.forEach(gift => {
        const div = document.createElement('div');
        div.className = 'gift-item';
        div.dataset.id = gift.id;
        
        div.innerHTML = `
            <div class="gift-emoji">${gift.emoji || '🎁'}</div>
            <div class="gift-info">
                <div class="gift-name">${gift.name}</div>
                <div class="gift-price">${gift.price || 'Цена неизвестна'}</div>
            </div>
        `;
        
        div.addEventListener('click', () => {
            // Убираем выделение с предыдущего
            document.querySelectorAll('.gift-item').forEach(el => el.classList.remove('selected'));
            // Выделяем текущий
            div.classList.add('selected');
            selectedGiftId = gift.id;
            selectedGiftName = gift.name;
            // Активируем кнопку отправки
            sendBtn.disabled = false;
            setStatus(`✅ Выбран: ${gift.name}`, 'success');
        });
        
        giftList.appendChild(div);
    });
}

// Отправка подарка
function sendGift() {
    if (!selectedGiftId) {
        setStatus('⚠️ Сначала выберите подарок', 'error');
        return;
    }
    
    setStatus('⏳ Отправка...', 'loading');
    sendBtn.disabled = true;
    
    // Отправляем данные боту
    const data = {
        action: 'send_gift',
        gift_id: selectedGiftId,
        gift_name: selectedGiftName,
        user_id: user.id,
        username: user.username || 'guest'
    };
    
    console.log('📤 Отправка данных:', data);
    
    try {
        tg.sendData(JSON.stringify(data));
        setStatus('✅ Подарок отправлен!', 'success');
        
        // Закрываем Mini App через 2 секунды
        setTimeout(() => {
            tg.close();
        }, 2000);
        
    } catch (error) {
        console.error('❌ Ошибка отправки:', error);
        setStatus('❌ Ошибка отправки. Попробуйте снова.', 'error');
        sendBtn.disabled = false;
    }
}

// Закрытие Mini App
function closeApp() {
    tg.close();
}

// Установка статуса
function setStatus(text, type = '') {
    statusDiv.textContent = text;
    statusDiv.className = 'status ' + type;
}

// Обработка данных от бота (ответ)
tg.onEvent('data', (data) => {
    console.log('📥 Получены данные от бота:', data);
    try {
        const response = JSON.parse(data);
        if (response.gifts) {
            gifts = response.gifts;
            renderGifts();
            setStatus('✅ Выберите подарок для отправки', 'success');
        }
    } catch (e) {
        console.log('Не JSON ответ:', data);
    }
});

// Запуск
loadGifts();

// Экспорт функций для HTML
window.sendGift = sendGift;
window.closeApp = closeApp;
