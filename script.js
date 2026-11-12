// Функция для генерации случайного цвета в формате HEX
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// 1. Кнопка "Случайный цвет" (меняет свечение на фоне)
document.getElementById('random-btn').addEventListener('click', () => {
    const randomColor = getRandomColor();
    const glow = document.getElementById('glow');
    
    // Меняем цвет градиента у свечения
    glow.style.background = `radial-gradient(circle, ${randomColor}40 0%, rgba(10, 10, 10, 0) 70%)`;
});

// 2. Кнопка "Создать палитру" (добавляет новую карточку)
document.getElementById('create-btn').addEventListener('click', () => {
    const container = document.getElementById('palette-container');
    
    // Генерируем 3 случайных цвета
    const c1 = getRandomColor();
    const c2 = getRandomColor();
    const c3 = getRandomColor();

    // Создаем HTML для новой карточки
    const newCard = document.createElement('div');
    newCard.className = 'color-card';
    newCard.innerHTML = `
        <div class="swatches-row">
            <div class="color-swatch" style="background: ${c1};" title="Кликни, чтобы скопировать"></div>
            <div class="color-swatch" style="background: ${c2};" title="Кликни, чтобы скопировать"></div>
            <div class="color-swatch" style="background: ${c3};" title="Кликни, чтобы скопировать"></div>
        </div>
        <h3>Сгенерированная</h3>
        <p>Новая случайная палитра</p>
    `;

    // Добавляем карточку в начало списка
    container.prepend(newCard);
    
    // Прокручиваем к палитрам, чтобы увидеть результат
    document.getElementById('palettes').scrollIntoView({ behavior: 'smooth' });
});

// 3. Копирование цвета при клике на кружок
document.addEventListener('click', (e) => {
    // Проверяем, что кликнули именно по кружку
    if (e.target.classList.contains('color-swatch')) {
        // Получаем цвет из инлайн-стиля
        const color = e.target.style.backgroundColor;
        
        // Преобразуем rgb(...) в hex (опционально, но удобнее для копирования)
        // Просто копируем то, что есть
        navigator.clipboard.writeText(color).then(() => {
            // Меняем курсор/показываем, что скопировано
            const originalBorder = e.target.style.border;
            e.target.style.border = '3px solid #fff';
            
            // Показываем всплывающее уведомление
            const toast = document.createElement('div');
            toast.innerText = `Скопировано: ${color}`;
            toast.style.position = 'fixed';
            toast.style.bottom = '20px';
            toast.style.left = '50%';
            toast.style.transform = 'translateX(-50%)';
            toast.style.background = '#c9ff34';
            toast.style.color = '#000';
            toast.style.padding = '10px 20px';
            toast.style.borderRadius = '8px';
            toast.style.fontWeight = 'bold';
            toast.style.zIndex = '1000';
            toast.style.transition = 'opacity 0.3s';
            document.body.appendChild(toast);

            // Убираем рамку и уведомление через 1.5 секунды
            setTimeout(() => {
                e.target.style.border = originalBorder;
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }, 1500);
        }).catch(err => {
            console.error('Ошибка копирования: ', err);
        });
    }
});