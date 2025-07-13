// 心形花瓣SVG数据
const heartSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <path fill="CURRENT_COLOR" d="M50,89.6 C44.4,84.2 15,60.2 15,40.2 C15,27.4 24.4,20 33,20 C40,20 46,24 50,29.2 C54,24 60,20 67,20 C75.6,20 85,27.4 85,40.2 C85,60.2 55.6,84.2 50,89.6 Z"/>
</svg>`;

// 花瓣数组
let petals = [];
let mouseX = 0;
let mouseY = 0;
let audio = null;
let wave1 = null;
let wave2 = null;

// 音频状态
let audioInitialized = false;
let audioPlaying = false;

// 初始化页面
function init() {
    createCustomCursor();
    createPetals();
    initAudio();
    initWaves();

    // 监听鼠标移动
    document.addEventListener('mousemove', handleMouseMove);

    // 波浪区域点击事件
    document.querySelector('.waves-container').addEventListener('click', handleWaveClick);
}

// 创建自定义鼠标指针
function createCustomCursor() {
    const cursor = document.querySelector('.cursor');
    document.addEventListener('mousemove', e => {
        cursor.style.left = e.pageX + 'px';
        cursor.style.top = e.pageY + 'px';
    });
}

// 创建花瓣
function createPetals() {
    // 创建初始花瓣
    for (let i = 0; i < 25; i++) {
        createPetal();
    }
}

// 创建单个花瓣
function createPetal() {
    const petal = document.createElement('div');
    petal.classList.add('petal');

    // 随机设置花瓣属性
    const size = Math.random() * 30 + 20;
    const startLeft = Math.random() * 100;
    const startTop = Math.random() * 100;
    const duration = Math.random() * 10 + 15;
    const delay = Math.random() * 5;

    // 粉色系颜色
    const pinkColors = ['#ffb6c1', '#ffc0cb', '#ffd1dc', '#f8c8dc', '#ffb8d1', '#ff9ebb'];
    const color = pinkColors[Math.floor(Math.random() * pinkColors.length)];

    const rotation = Math.random() * 360;
    const scale = Math.random() * 0.5 + 0.7; // 缩放变化

    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    petal.style.left = `${startLeft}%`;
    petal.style.top = `${startTop}%`;
    petal.style.transform = `rotate(${rotation}deg) scale(${scale})`;
    petal.style.color = color;
    petal.innerHTML = heartSVG.replace('CURRENT_COLOR', color);

    document.body.appendChild(petal);

    // 保存花瓣对象
    petals.push({
        element: petal,
        x: startLeft,
        y: startTop,
        size: size,
        rotation: rotation,
        scale: scale,
        scaleDirection: Math.random() > 0.5 ? 1 : -1,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: Math.random() * 0.3 + 0.1,
        rotationSpeed: (Math.random() - 0.5) * 0.5
    });

    // 花瓣落地后重置
    setTimeout(() => {
        resetPetal(petal);
    }, (duration + delay) * 1000);
}

// 重置花瓣位置
function resetPetal(petalElement) {
    const petalIndex = petals.findIndex(p => p.element === petalElement);
    if (petalIndex !== -1) {
        petals[petalIndex].x = Math.random() * 100;
        petals[petalIndex].y = -10;
        petals[petalIndex].rotation = Math.random() * 360;
        petals[petalIndex].scale = Math.random() * 0.5 + 0.7;
    }
}

// 初始化音频
function initAudio() {
    try {
        // 使用用户提供的本地路径
        audio = new Audio('../assets/wave.mp3');
        audio.loop = true;
        audio.volume = 0.6;

        // 添加错误处理
        audio.addEventListener('error', (e) => {
            console.error('音频加载错误:', e);
        });

        // 绑定页面点击事件来触发首次音频播放
        document.body.addEventListener('click', handleFirstInteraction);

    } catch (error) {
        console.error('音频初始化失败:', error);
    }
}

// 处理首次交互
function handleFirstInteraction() {
    // 如果音频还未初始化或未播放，则播放
    if (!audioPlaying) {
        audio.play()
            .then(() => {
                audioPlaying = true;
                audioInitialized = true;
            })
            .catch(error => {
                console.error('音频播放失败:', error);
            });
    }

    // 移除首次点击监听器
    document.body.removeEventListener('click', handleFirstInteraction);
}

// 初始化波浪
function initWaves() {
    wave1 = document.querySelector('.wave-1');
    wave2 = document.querySelector('.wave-2');
}

// 波浪点击处理
function handleWaveClick() {
    if (!audioInitialized) {
        handleFirstInteraction();
        return;
    }

    // 重置音频当前时间为0（从头播放）
    audio.currentTime = 0;

    // 如果音频已暂停则播放
    if (audio.paused) {
        audio.play();
        audioPlaying = true;
    }
}

// 处理鼠标移动
function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // 更新波浪效果
    updateWaves(e.clientX, e.clientY);
}

// 更新花瓣位置
function updatePetals() {
    const disturbance = 100 / 200; // 固定扰动值

    petals.forEach(petal => {
        // 计算花瓣中心位置
        const petalRect = petal.element.getBoundingClientRect();
        const petalCenterX = petalRect.left + petalRect.width / 2;
        const petalCenterY = petalRect.top + petalRect.height / 2;

        // 计算与鼠标的距离
        const dx = mouseX - petalCenterX;
        const dy = mouseY - petalCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 扰动效果 - 离鼠标越近，影响越大
        let forceX = 0;
        let forceY = 0;

        if (distance < 300) {
            const force = (1 - distance / 300) * disturbance;
            forceX = (dx / distance) * force;
            forceY = (dy / distance) * force;
        }

        // 更新花瓣位置
        petal.x += petal.speedX + forceX;
        petal.y += petal.speedY + forceY;
        petal.rotation += petal.rotationSpeed;

        // 添加轻微缩放动画
        petal.scale += 0.01 * petal.scaleDirection;
        if (petal.scale > 1.1 || petal.scale < 0.6) {
            petal.scaleDirection *= -1;
        }

        // 边界检查 - 如果花瓣飘出屏幕底部，重置到顶部
        if (petal.y > 100) {
            petal.y = -5;
            petal.x = Math.random() * 100;
        }

        // 更新花瓣样式
        petal.element.style.left = `${petal.x}%`;
        petal.element.style.top = `${petal.y}%`;
        petal.element.style.transform = `rotate(${petal.rotation}deg) scale(${petal.scale})`;
    });

    requestAnimationFrame(updatePetals);
}

// 更新波浪效果
function updateWaves(x, y) {
    const waveSensitivity = 60 / 100; // 降低灵敏度

    // 根据鼠标位置计算波浪偏移
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // 计算鼠标位置在屏幕中的比例
    const mouseRatioX = x / windowWidth;
    const mouseRatioY = y / windowHeight;

    // 计算波浪偏移 - 使用正弦函数创造更自然的波浪效果
    const waveOffsetX = Math.sin(mouseRatioX * Math.PI * 2) * 30 * waveSensitivity;
    const waveOffsetY = Math.cos(mouseRatioY * Math.PI) * 15 * waveSensitivity;

    // 应用波浪偏移 - 使用更平滑的过渡
    wave1.style.transform = `translateX(${-50 + waveOffsetX}%) translateY(${waveOffsetY * 0.3}px)`;
    wave2.style.transform = `translateX(${-50 - waveOffsetX * 0.7}%) translateY(${waveOffsetY * 0.5}px)`;
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', () => {
    init();
    setTimeout(() => {
        updatePetals();
    }, 1000);
});