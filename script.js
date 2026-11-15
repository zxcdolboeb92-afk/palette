// 1. ТЕМА
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') document.body.classList.add('light-theme');

let savedPalettes = [];
try { savedPalettes = JSON.parse(localStorage.getItem('spacePalettes')) || []; } catch(e) { savedPalettes = []; }
const MAX_FAV = 20;

// 2. ЦВЕТА
function getRandomColor() {
    return hslToHex(Math.random() * 360, 50 + Math.random() * 30, 40 + Math.random() * 20);
}
function hexToHsl(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h * 360, s * 100, l * 100];
}
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}
function isDark(hex) {
    const r = parseInt(hex.substr(1, 2), 16), g = parseInt(hex.substr(3, 2), 16), b = parseInt(hex.substr(5, 2), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}
function showToast(msg) {
    const t = document.getElementById('toast');
    t.innerText = msg; t.style.display = 'block';
    setTimeout(() => { t.style.display = 'none'; }, 2000);
}

function toggleTheme() {
    const isLight = document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    document.getElementById('stars-container').innerHTML = '';
    initStars();
}

function switchTab(tab) {
    document.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active-tab'));
    document.getElementById('section-itten').classList.remove('active');
    document.getElementById('section-photo').classList.remove('active');
    document.getElementById('palettes').style.display = 'none';

    if (tab === 'itten') { document.getElementById('section-itten').classList.add('active'); }
    else if (tab === 'photo') { document.getElementById('section-photo').classList.add('active'); }
    else {
        document.getElementById('palettes').style.display = 'block';
        document.querySelectorAll('.card-wrapper').forEach(c => {
            if (tab === 'all' || c.getAttribute('data-fav') === 'true') c.classList.remove('hidden');
            else c.classList.add('hidden');
        });
    }
}

// 3. ГЕНЕРАЦИЯ
document.getElementById('colorWheel').addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    
    const count = parseInt(document.getElementById('colorCount').value);
    let colors = [];
    const angleStep = 360 / count;
    for (let i = 0; i < count; i++) {
        colors.push(hslToHex((angle + i * angleStep) % 360, 70, 50));
    }
    addPaletteToContainer(colors);
});

function generateItten(scheme) {
    const baseHex = getRandomColor();
    const count = parseInt(document.getElementById('colorCount').value);
    const [h, s, l] = hexToHsl(baseHex);
    let colors = [];
    if (scheme === 'complementary') colors = [hslToHex(h, s, l), hslToHex((h + 180) % 360, s, l)];
    else if (scheme === 'triad') colors = [hslToHex(h, s, l), hslToHex((h + 120) % 360, s, l), hslToHex((h + 240) % 360, s, l)];
    else if (scheme === 'tetrad') colors = [hslToHex(h, s, l), hslToHex((h + 90) % 360, s, l), hslToHex((h + 180) % 360, s, l), hslToHex((h + 270) % 360, s, l)];
    while (colors.length < count) colors.push(getRandomColor());
    addPaletteToContainer(colors.slice(0, count));
}

function generateNew() {
    const count = parseInt(document.getElementById('colorCount').value);
    let colors = [];
    for (let i = 0; i < count; i++) colors.push(getRandomColor());
    addPaletteToContainer(colors);
}

function addPaletteToContainer(colors) {
    const container = document.getElementById('palette-container');
    container.insertBefore(buildCard(colors), container.firstChild);
    document.getElementById('palettes').scrollIntoView({ behavior: 'smooth' });
    showToast('Создана палитра!');
}

// 4. ФОТО
document.getElementById('imageInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = 100; canvas.height = 100;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 100, 100);
            const data = ctx.getImageData(0, 0, 100, 100).data;
            const colorMap = {};
            for (let i = 0; i < data.length; i += 4) {
                if (data[i+3] < 128) continue;
                const q = v => Math.min(255, Math.round(v / 20) * 20);
                const hex = rgbToHex(q(data[i]), q(data[i+1]), q(data[i+2]));
                colorMap[hex] = (colorMap[hex] || 0) + 1;
            }
            const sorted = Object.keys(colorMap).sort((a, b) => colorMap[b] - colorMap[a]);
            const finalColors = [];
            for (let hex of sorted) {
                if (finalColors.length >= 5) break;
                let unique = true;
                for (let c of finalColors) if (Math.hypot(...[1,3,5].map(i => parseInt(c.substr(i,2),16) - parseInt(hex.substr(i,2),16))) < 40) { unique = false; break; }
                if (unique) finalColors.push(hex);
            }
            while (finalColors.length < 5) finalColors.push(getRandomColor());
            addPaletteToContainer(finalColors);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});
function rgbToHex(r, g, b) { return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase(); }

// 5. КАРТОЧКА
function buildCard(colors, isSaved = false, existingId = null) {
    let circlesHTML = '', stripsHTML = '', lockHTML = '';
    const cardId = existingId || 'id_' + Math.random().toString(36).substr(2, 9);

    colors.forEach((c, i) => {
        circlesHTML += `<div class="swatch-wrapper" id="swatch-${i}">
            <div class="color-swatch" style="background: ${c};">
                <input type="color" class="color-input" value="${c}" onchange="changeColor(this, ${i}, '${cardId}')">
            </div>
            <div class="lock-indicator">🔒</div>
        </div>`;
        stripsHTML += `<div class="color-strip ${isDark(c) ? 'dark' : ''}" style="background: ${c};" onclick="copyHex('${c}')">
            <span>${i + 1}. ${c}</span>
        </div>`;
        lockHTML += `<div class="lock-item" id="lock-item-${i}" onclick="toggleLock(${i}, this, event)">
            <div class="lock-color-dot" style="background: ${c};"></div>
            <div class="lock-number">${i + 1}</div>
            <div class="lock-icon-btn">🔒</div>
        </div>`;
    });

    const wrapper = document.createElement('div');
    wrapper.className = 'card-wrapper';
    wrapper.setAttribute('data-fav', isSaved ? 'true' : 'false');
    wrapper.setAttribute('data-colors', JSON.stringify(colors));
    wrapper.setAttribute('data-id', cardId);

    wrapper.innerHTML = `
        <div class="color-card">
            <div class="card-header">
                <h3>Палитра</h3>
                <div class="card-actions">
                    <button class="action-btn" onclick="openPreview(this)" title="Предпросмотр">👁</button>
                    <button class="action-btn fav-btn ${isSaved ? 'active' : ''}" onclick="toggleFav(this, '${cardId}')" title="В избранное">${isSaved ? '★' : '☆'}</button>
                    <button class="action-btn" onclick="downloadPalette(this)" title="Скачать">⬇</button>
                </div>
            </div>
            <div class="swatches-row" onclick="this.style.display='none'; this.nextElementSibling.classList.add('active');">${circlesHTML}</div>
            <div class="strip-container" onclick="if(!event.target.classList.contains('color-strip')) { this.previousElementSibling.style.display='flex'; this.classList.remove('active'); }">${stripsHTML}</div>
            <div class="lock-panel">${lockHTML}</div>
        </div>
    `;
    return wrapper;
}

function changeColor(input, index, cardId) {
    const wrapper = input.closest('.card-wrapper');
    const colors = JSON.parse(wrapper.getAttribute('data-colors'));
    colors[index] = input.value.toUpperCase();
    wrapper.setAttribute('data-colors', JSON.stringify(colors));
    wrapper.querySelectorAll('.color-swatch')[index].style.background = colors[index];
    const p = savedPalettes.find(p => p.id === cardId);
    if (p) { p.colors = colors; localStorage.setItem('spacePalettes', JSON.stringify(savedPalettes)); }
}

function copyHex(hex) { navigator.clipboard.writeText(hex).then(() => showToast(hex + ' скопирован!')); }

// 6. СКАЧИВАНИЕ
function downloadPalette(btn) {
    const colors = JSON.parse(btn.closest('.card-wrapper').getAttribute('data-colors'));
    document.fonts.ready.then(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 1000; canvas.height = 1000;
        const ctx = canvas.getContext('2d');
        
        const isLight = document.body.classList.contains('light-theme');
        ctx.fillStyle = isLight ? '#f4f4f5' : '#0a0a0a'; 
        ctx.fillRect(0, 0, 1000, 1000);
        
        const stripeHeight = 1000 / colors.length;
        colors.forEach((c, i) => {
            ctx.fillStyle = c; 
            ctx.fillRect(0, i * stripeHeight, 1000, stripeHeight);
            ctx.fillStyle = isDark(c) ? '#ffffff' : '#000000';
            ctx.font = 'bold 40px Inter, sans-serif'; 
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(c, 500, i * stripeHeight + stripeHeight / 2);
        });
        
        ctx.fillStyle = isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)'; 
        ctx.font = 'bold 30px Inter, sans-serif'; 
        ctx.textAlign = 'right';
        ctx.fillText('Palette Space', 950, 950);
        
        const link = document.createElement('a');
        link.download = 'palette.png'; 
        link.href = canvas.toDataURL('image/png'); 
        link.click();
        showToast('Картинка сохранена!');
    });
}

// 7. ПРЕДПРОСМОТР
function openPreview(btn) {
    const colors = JSON.parse(btn.closest('.card-wrapper').getAttribute('data-colors'));
    let vibrant = colors[0], maxSat = 0;
    colors.forEach(c => { let s = hexToHsl(c)[1]; if (s > maxSat) { maxSat = s; vibrant = c; } });

    const ui = document.getElementById('mockupUI');
    ui.style.backgroundColor = '#ffffff'; ui.style.color = '#000000';
    const btnMock = document.getElementById('mockupBtn');
    btnMock.style.backgroundColor = vibrant;
    btnMock.style.color = isDark(vibrant) ? '#ffffff' : '#000000';

    document.getElementById('previewCanvas').style.backgroundColor = '#ffffff';
    document.getElementById('previewModal').classList.add('active');
}

function closePreview() { document.getElementById('previewModal').classList.remove('active'); }
function setPreviewBg(color, btn) {
    document.querySelectorAll('.bg-color-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('previewCanvas').style.backgroundColor = color;
}

// 8. ИЗБРАННОЕ
function toggleFav(btn, cardId) {
    const wrapper = btn.closest('.card-wrapper');
    const isFav = wrapper.getAttribute('data-fav') === 'true';
    const colors = JSON.parse(wrapper.getAttribute('data-colors'));

    if (!isFav) {
        if (savedPalettes.length < MAX_FAV) {
            btn.classList.add('active'); btn.innerText = '★';
            wrapper.setAttribute('data-fav', 'true');
            savedPalettes.push({ id: cardId, colors });
            localStorage.setItem('spacePalettes', JSON.stringify(savedPalettes));
        } else showToast('Лимит 20');
    } else {
        btn.classList.remove('active'); btn.innerText = '☆';
        wrapper.setAttribute('data-fav', 'false');
        savedPalettes = savedPalettes.filter(p => p.id !== cardId);
        localStorage.setItem('spacePalettes', JSON.stringify(savedPalettes));
    }
    document.getElementById('fav-counter').innerText = `★ ${savedPalettes.length} / ${MAX_FAV}`;
}

function toggleLock(index, element, event) {
    event.stopPropagation();
    element.classList.toggle('locked');
    element.closest('.card-wrapper').querySelector(`#swatch-${index}`).classList.toggle('locked');
}

// 9. ЗВЕЗДЫ (Идеальная анимация)
function initStars() {
    const container = document.getElementById('stars-container');
    container.innerHTML = '';
    for (let i = 0; i < 60; i++) {
        const star = document.createElement('div'); 
        star.className = 'star';
        star.innerText = ['✦', '✧', '★', '☆'][Math.floor(Math.random() * 4)];
        star.style.left = (Math.random() * 90 + 5) + '%'; 
        star.style.top = (Math.random() * 80 + 10) + '%';
        star.style.fontSize = (Math.random() * 15 + 10) + 'px';
        star.style.color = ['#fff', '#b864ff', '#a1a1aa'][Math.floor(Math.random() * 3)];
        
        star.onclick = function(e) {
            e.stopPropagation();
            
            // Получаем текущее положение
            const rect = star.getBoundingClientRect();
            const parentRect = container.getBoundingClientRect();
            const startX = rect.left - parentRect.left;
            const startY = rect.top - parentRect.top;
            
            // Отключаем анимацию и фиксируем
            star.style.animation = 'none';
            star.style.left = startX + 'px';
            star.style.top = startY + 'px';
            star.style.transform = 'scale(1) rotate(0deg)';
            
            // Даем кадр
            requestAnimationFrame(() => {
                star.style.transition = 'all 0.8s ease-out';
                const moveX = (Math.random() - 0.5) * 300;
                const moveY = (Math.random() - 0.5) * 300;
                
                star.style.transform = `translate(${moveX}px, ${moveY}px) scale(3) rotate(360deg)`;
                star.style.opacity = '0';
                
                setTimeout(() => {
                    star.style.transition = 'none';
                    star.style.transform = 'none';
                    star.style.opacity = '0';
                    star.style.left = (Math.random() * 90 + 5) + '%';
                    star.style.top = (Math.random() * 80 + 10) + '%';
                    
                    setTimeout(() => {
                        star.style.transition = 'opacity 0.3s';
                        star.style.opacity = Math.random() * 0.5 + 0.3;
                        setTimeout(() => { 
                            star.style.animation = 'floatStar 4s infinite ease-in-out alternate'; 
                        }, 50);
                    }, 50);
                }, 800);
            });
        };
        container.appendChild(star);
    }
}

// 10. СТАРТ
window.onload = function() {
    const container = document.getElementById('palette-container');
    if (savedPalettes.length > 0) {
        savedPalettes.forEach(p => container.appendChild(buildCard(p.colors, true, p.id)));
    } else {
        for (let i = 0; i < 3; i++) {
            const colors = []; const count = Math.floor(Math.random() * 4) + 3;
            for (let j = 0; j < count; j++) colors.push(getRandomColor());
            container.appendChild(buildCard(colors));
        }
    }
    initStars(); 
    document.getElementById('fav-counter').innerText = `★ ${savedPalettes.length} / ${MAX_FAV}`;
};
