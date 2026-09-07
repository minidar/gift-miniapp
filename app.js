const tg = window.Telegram.WebApp;

// Сообщаем Telegram, что Mini App готов
tg.ready();
tg.expand();

let selectedGiftId = null;

// Получаем данные о пользователе
const user = tg.initDataUnsafe?.user || { id: 0, username: 'guest' };
console.log('User:', user);

// Заглушка: список подарков (в реальности их нужно получать от бота)
const gifts = [
    { id: 1, name: 'Happy Brownie', emoji: '🍫', price: '100⭐' },
    { id: 2, name: 'CryptoPunk', emoji: '👾', price: '500⭐' },
    { id: 3, name: 'Bored Ape', emoji: '🦧', price: '1000⭐' },
];

function renderGifts() {
    const container = document.getElementById('gift-list');
    container.innerHTML = '';

    gifts.forEach(gift => {
        const div = document.createElement('div');
        div.className = 'gift-item';
        div.dataset.id = gift.id;

        div.innerHTML = `
            <div class="gift-emoji">${gift.emoji}</div>
            <div class="gift-info">
                <div class="gift-name">${gift.name}</div>
                <div class="gift-price">${gift.price}</div>
            </div>
        `;

        div.addEventListener('click', () => {
            // Убираем выделение с предыдущего
            document.querySelectorAll('.gift-item').forEach(el => el.classList.remove('selected'));
            // Выделяем текущий
            div.classList.add('selected');
            selectedGiftId = gift.id;
            // Активируем кнопку отправки
            document.getElementById('sendBtn').disabled = false;
        });

        container.appendChild(div);
    });
}

function sendGift() {
    if (!selectedGiftId) {
        setStatus('⚠️ Выберите подарок', 'error');
        return;
    }

    // Отправляем данные боту
    const data = {
        action: 'send_gift',
        gift_id: selectedGiftId,
        user_id: user.id,
        username: user.username || 'guest'
    };

    console.log('Отправка данных:', data);
    tg.sendData(JSON.stringify(data));
    setStatus('✅ Подарок отправлен!', 'success');

    // Закрываем Mini App через секунду
    setTimeout(() => {
        tg.close();
    }, 1500);
}

function closeApp() {
    tg.close();
}

function setStatus(text, type = '') {
    const status = document.getElementById('status');
    status.textContent = text;
    status.className = 'status ' + type;
}

// Запускаем рендеринг
renderGifts();

// По умолчанию кнопка отправки неактивна
document.getElementById('sendBtn').disabled = true;