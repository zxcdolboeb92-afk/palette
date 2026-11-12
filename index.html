document.addEventListener('DOMContentLoaded', () => {
    
    // --- НАСТРОЙКИ ---
    const MAX_FAVORITES = 10; // Сколько палитр можно добавить в избранное
    let favoritesCount = 0;

    // --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Определяем, темный ли цвет (чтобы сделать текст белым)
    function isColorDark(hex) {
        const r = parseInt(hex.substr(1, 2), 16);
        const g = parseInt(hex.substr(3, 2), 16);
        const b = parseInt(hex.substr(5, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness < 128;
    }

    // Обновление счетчика в шапке
    function updateFavCounter() {
        const counter = document.getElementById('fav-counter');
        counter.innerText = `★ ${favoritesCount} / ${MAX_FAVORITES}`;
    }

    // Показ уведомления (Toast)
    function showToast(message) {
        const toast = document.createElement('div');
        toast.innerText = message;
        toast.style.cssText = 'position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:#c9ff34; color:#000; padding:10px 20px; border-radius:8px; font-weight:bold; z-index:1000; transition:opacity 0.3s; font-family:sans-serif;';
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    // --- СОЗДАНИЕ КАРТОЧКИ ПАЛИТРЫ ---
    function createPaletteCard() {
        // Генерируем от 2 до 6 цветов (как просили)
        const colorCount = Math.floor(Math.random() * 5) + 2; // 2, 3, 4, 5, 6
        const colors = [];
        for (let i = 0; i < colorCount; i++) {
            colors.push(getRandomColor());
        }

        const card = document.createElement('div');
        card.className = 'color-card';

        // 1. Создаем верхнюю часть (кружочки)
        let circlesHTML = '';
        colors.forEach(c => {
            circlesHTML += `<div class="color-swatch" style="background: ${c};" title="Кликни, чтобы скопировать"></div>`;
        });

        // 2. Создаем нижнюю часть (полоски с номерами)
        let stripsHTML = '';
        colors.forEach((c, index) => {
            const textColorClass = isColorDark(c) ? 'dark-text' : '';
            // Нумерация цветов (1, 2, 3...)
            stripsHTML += `<div class="color-strip ${textColorClass}" style="background: ${c};" data-color="${c}">
                ${index + 1}. ${c.toUpperCase()}
            </div>`;
        });

        // Собираем HTML карточки
        card.innerHTML = `
            <div class="card-header">
                <h3>Палитра #${Math.floor(Math.random() * 9000) + 1000}</h3>
                <button class="fav-btn" title="Добавить в избранное">☆</button>
            </div>
            
            <!-- Верхние кружочки -->
            <div class="swatches-row" style="display: flex; flex-wrap: wrap; gap: 10px;">
                ${circlesHTML}
            </div>
            
            <!-- Нижние полоски (скрыты) -->
            <div class="strip-container">
                ${stripsHTML}
            </div>
        `;

        return card;
    }

    // --- ОБРАБОТЧИКИ СОБЫТИЙ ---

    // 1. Кнопка "Создать палитру"
    const createBtn = document.getElementById('create-btn');
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            const container = document.getElementById('palette-container');
            const newCard = createPaletteCard();
            container.prepend(newCard);
            document.getElementById('palettes').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // 2. Глобальный клик (делегирование событий)
    document.addEventListener('click', (e) => {
        
        // --- Копирование цвета ---
        if (e.target.classList.contains('color-swatch')) {
            const color = e.target.style.backgroundColor;
            navigator.clipboard.writeText(color).then(() => {
                showToast(`Скопировано: ${color}`);
            });
        }

        // --- Развернуть/Свернуть полоски ---
        // Если кликнули по заголовку или по области кружочков (но не по самому кружочку)
        const swatchesRow = e.target.closest('.swatches-row');
        if (swatchesRow && !e.target.classList.contains('color-swatch')) {
            const card = swatchesRow.closest('.color-card');
            const stripContainer = card.querySelector('.strip-container');
            const circlesRow = card.querySelector('.swatches-row');

            // Переключаем класс
            const isActive = stripContainer.classList.toggle('active');
            
            // Скрываем/показываем кружочки для наглядности
            if (isActive) {
                circlesRow.style.display = 'none';
            } else {
                circlesRow.style.display = 'flex';
            }
        }

        // Если кликнули по полоске (чтобы свернуть обратно или скопировать)
        if (e.target.classList.contains('color-strip')) {
            const card = e.target.closest('.color-card');
            const stripContainer = card.querySelector('.strip-container');
            const circlesRow = card.querySelector('.swatches-row');
            
            // Копируем цвет полоски
            const color = e.target.getAttribute('data-color');
            navigator.clipboard.writeText(color).then(() => {
                showToast(`Скопировано: ${color}`);
            });
        }

        // --- Добавление в избранное ---
        if (e.target.classList.contains('fav-btn')) {
            const btn = e.target;
            
            if (!btn.classList.contains('active')) {
                // Добавляем
                if (favoritesCount < MAX_FAVORITES) {
                    btn.classList.add('active');
                    btn.innerText = '★';
                    favoritesCount++;
                    updateFavCounter();
                    showToast('Добавлено в избранное');
                } else {
                    // Лимит достигнут
                    showToast('Лимит избранного достигнут (10)');
                }
            } else {
                // Убираем
                btn.classList.remove('active');
                btn.innerText = '☆';
                favoritesCount--;
                updateFavCounter();
                showToast('Удалено из избранного');
            }
        }
    });

    // 3. Кнопка "Случайный цвет" (свечение)
    const randomBtn = document.getElementById('random-btn');
    if (randomBtn) {
        randomBtn.addEventListener('click', () => {
            const randomColor = getRandomColor();
            const glow = document.getElementById('glow');
            glow.style.background = `radial-gradient(circle, ${randomColor}80 0%, rgba(10, 10, 10, 0) 70%)`;
        });
    }

    // Инициализация: создаем пару палитр при загрузке
    const container = document.getElementById('palette-container');
    for (let i = 0; i < 3; i++) {
        container.appendChild(createPaletteCard());
    }
    updateFavCounter();
});
