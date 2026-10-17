/* ============================================
   Birthday Wish App — Main Script
   ============================================ */

// ========== PERSONALIZATION — Edit this section ==========
const birthdayPerson = {
    name: "BESTIE",

    photos: [
        "photos/Noor1.jpeg",
        "photos/Noor2.jpeg",
        "photos/Noor3.jpeg",
        "photos/Noor4.jpeg",
        "photos/Noor5.jpeg",
    ],

    captions: [
        "Gorgeous ❤️",
        "Pretty 🦋",
        "Stunning ❤️",
        "Angel 🤍",
        "Ethreal 🦋"
    ]
};
// ==========================================================

const TOTAL_SCREENS = 10;
let currentScreen = 1;
let currentPhotoIndex = 0;
let musicStarted = false;
let musicMuted = true;
let celebrationActive = false;
let giftOpened = false;

const app = document.getElementById('app');
const progressIndicator = document.getElementById('progress-indicator');
const audio = document.getElementById('birthday-audio');
const musicToggle = document.getElementById('music-toggle');
const confettiLayer = document.getElementById('confetti-layer');
const fireworksLayer = document.getElementById('fireworks-layer');
const particlesLayer = document.getElementById('particles-layer');

document.addEventListener('DOMContentLoaded', init);

function init() {
    applyPersonalization();
    createBalloons();
    createExtraParticles();
    setupEventListeners();
    updateProgress();
    const firstScreen = document.querySelector('.screen[data-screen="1"]');
    if (firstScreen) updateProgressTheme(firstScreen);
    animateScreenCards(1);
}

function applyPersonalization() {
    const name = birthdayPerson.name;

    const revealName = document.getElementById('reveal-name');
    if (revealName) revealName.textContent = `${name}! ❤️`;

    const finalName = document.getElementById('final-name');
    if (finalName) finalName.innerHTML = `Happy Birthday,<br>${name}! 🎂`;

    const memoryPhoto = document.getElementById('memory-photo');
    const memoryCaption = document.getElementById('memory-caption');
    if (memoryPhoto && birthdayPerson.photos.length > 0) {
        memoryPhoto.src = birthdayPerson.photos[0];
        memoryPhoto.alt = `Memory with ${name}`;
        memoryPhoto.onerror = () => {
            memoryPhoto.style.background = 'linear-gradient(135deg, #ffb3c9, #ff6b9d)';
            memoryPhoto.removeAttribute('src');
        };
    }
    if (memoryCaption && birthdayPerson.captions.length > 0) {
        memoryCaption.textContent = birthdayPerson.captions[0];
    }
}

function setupEventListeners() {
    document.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', handleAction);
    });

    musicToggle.addEventListener('click', toggleMusic);

    const giftBox = document.getElementById('gift-box');
    if (giftBox) {
        giftBox.addEventListener('click', openGift);
        giftBox.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openGift();
            }
        });
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden && !musicMuted && audio.paused === false) {
            // Keep playing in background on Android when possible
        }
    });
}

function handleAction(e) {
    const btn = e.currentTarget;
    btn.classList.add('pressed');
    setTimeout(() => btn.classList.remove('pressed'), 150);

    const action = btn.dataset.action;

    if (btn.dataset.startMusic === 'true') {
        startMusic();
    }

    if (btn.dataset.confetti === 'true') {
        launchConfetti(60);
    }

    switch (action) {
        case 'next':
            if (currentScreen === 2) {
                launchBalloonsFast();
            }
            goToScreen(currentScreen + 1);
            break;
        case 'next-memory':
            nextMemory(btn);
            break;
        case 'open-gift':
            openGift();
            break;
        case 'celebrate':
            startCelebration(btn);
            break;
    }
}

function goToScreen(screenNum) {
    if (screenNum < 1 || screenNum > TOTAL_SCREENS) return;

    const current = document.querySelector(`.screen[data-screen="${currentScreen}"]`);
    const next = document.querySelector(`.screen[data-screen="${screenNum}"]`);

    if (!current || !next) return;

    current.classList.remove('active');
    current.classList.add('exit-left');

    setTimeout(() => {
        current.classList.remove('exit-left');
        next.classList.add('active');
        currentScreen = screenNum;
        updateProgress();
        updateProgressTheme(next);
        animateScreenCards(screenNum);

        if (screenNum === 2) {
            launchBalloonsFast();
        }
        if (screenNum === 8) {
            animateWishes();
        }
        if (screenNum === 10) {
            launchConfetti(40);
            createFloatingHearts();
        }
    }, 400);
}

function updateProgress() {
    progressIndicator.textContent = `${currentScreen} / ${TOTAL_SCREENS}`;
}

function updateProgressTheme(screen) {
    const isLight =
        screen.classList.contains('screen-light') ||
        screen.classList.contains('screen-quote');
    document.body.classList.toggle('theme-light', isLight);
    if (isLight) {
        progressIndicator.style.color = 'rgba(74, 25, 66, 0.5)';
        progressIndicator.style.background = 'rgba(255, 255, 255, 0.4)';
    } else {
        progressIndicator.style.color = 'rgba(255, 255, 255, 0.5)';
        progressIndicator.style.background = 'rgba(0, 0, 0, 0.2)';
    }
}

function animateScreenCards(screenNum) {
    const screen = document.querySelector(`.screen[data-screen="${screenNum}"]`);
    if (!screen) return;

    const cards = screen.querySelectorAll('.reveal-card');
    cards.forEach((card, i) => {
        card.classList.remove('visible');
        setTimeout(() => card.classList.add('visible'), 200 + i * 300);
    });
}

function animateWishes() {
    const wishes = document.querySelectorAll('.wish-item');
    wishes.forEach((wish, i) => {
        wish.classList.remove('visible');
        setTimeout(() => wish.classList.add('visible'), 150 + i * 250);
    });
}

function nextMemory(btn) {
    const polaroid = document.getElementById('polaroid');
    const photo = document.getElementById('memory-photo');
    const caption = document.getElementById('memory-caption');

    if (!polaroid || !photo || !caption) return;

    const nextIndex = currentPhotoIndex + 1;

    if (nextIndex >= birthdayPerson.photos.length) {
        goToScreen(5);
        return;
    }

    polaroid.classList.add('slide-out');

    setTimeout(() => {
        currentPhotoIndex = nextIndex;
        photo.src = birthdayPerson.photos[nextIndex];
        caption.textContent = birthdayPerson.captions[nextIndex] || '';

        polaroid.classList.remove('slide-out');
        polaroid.classList.remove('slide-in');
        void polaroid.offsetWidth;
        polaroid.classList.add('slide-in');

        if (nextIndex >= birthdayPerson.photos.length - 1) {
            btn.textContent = 'Keep Going ❤️';
            btn.dataset.action = 'next';
        }
    }, 400);
}

function openGift() {
    if (giftOpened) return;
    giftOpened = true;

    const giftBox = document.getElementById('gift-box');
    const openBtn = document.getElementById('open-gift-btn');
    const screen = document.querySelector('.screen[data-screen="9"]');

    if (giftBox) {
        giftBox.classList.add('shake');
        setTimeout(() => {
            giftBox.classList.remove('shake');
            giftBox.classList.add('open');
        }, 600);
    }

    if (screen) screen.classList.add('screen-glow');

    setTimeout(() => launchConfetti(100), 300);
    setTimeout(() => launchFireworks(5), 500);
    setTimeout(() => createFloatingHearts(), 400);
    setTimeout(() => launchBalloonsFast(), 600);

    if (openBtn) {
        openBtn.disabled = true;
        openBtn.textContent = 'Opening... 💖';
    }

    setTimeout(() => {
        goToScreen(10);
        launchConfetti(80);
        launchFireworks(8);
    }, 2000);
}

function startCelebration(btn) {
    if (celebrationActive) return;
    celebrationActive = true;

    btn.textContent = 'Happy Birthday! ❤️🎉';
    btn.classList.add('celebrating');

    launchConfetti(150);
    launchFireworks(12);
    createFloatingHearts();
    launchBalloonsFast();
    createExtraParticles();

    if (!musicStarted) startMusic();

    const celebrateInterval = setInterval(() => {
        if (!celebrationActive) {
            clearInterval(celebrateInterval);
            return;
        }
        launchConfetti(30);
        if (Math.random() > 0.5) launchFireworks(2);
    }, 2000);
}

// ========== MUSIC ==========

function startMusic() {
    musicStarted = true;
    musicMuted = false;
    audio.volume = 0.6;
    audio.play().catch(() => {
        musicMuted = true;
        updateMusicIcon();
    });
    updateMusicIcon();
}

function toggleMusic() {
    if (!musicStarted) {
        startMusic();
        return;
    }

    if (musicMuted) {
        musicMuted = false;
        audio.volume = 0.6;
        audio.play().catch(() => {});
    } else {
        musicMuted = true;
        audio.pause();
    }
    updateMusicIcon();
}

function updateMusicIcon() {
    if (musicStarted && !musicMuted && !audio.paused) {
        musicToggle.textContent = '🔊';
        musicToggle.classList.add('playing');
        musicToggle.setAttribute('aria-label', 'Mute music');
    } else {
        musicToggle.textContent = '🔇';
        musicToggle.classList.remove('playing');
        musicToggle.setAttribute('aria-label', 'Play music');
    }
}

audio.addEventListener('play', updateMusicIcon);
audio.addEventListener('pause', updateMusicIcon);

// ========== CONFETTI ==========

const confettiColors = ['#ff6b9d', '#ffd700', '#c44dff', '#ff4757', '#2ed573', '#ffa502', '#ff9ff3', '#54a0ff'];

function launchConfetti(count) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            piece.style.width = (6 + Math.random() * 6) + 'px';
            piece.style.height = (6 + Math.random() * 6) + 'px';
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            piece.style.animationDuration = (2 + Math.random() * 3) + 's';
            piece.style.animationDelay = Math.random() * 0.5 + 's';
            confettiLayer.appendChild(piece);

            setTimeout(() => piece.remove(), 5000);
        }, i * 20);
    }
}

// ========== FIREWORKS ==========

const fireworkColors = ['#ff6b9d', '#ffd700', '#c44dff', '#ff4757', '#54a0ff'];

function launchFireworks(count) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const fw = document.createElement('div');
            fw.className = 'firework';
            fw.style.left = (15 + Math.random() * 70) + '%';
            fw.style.top = (15 + Math.random() * 50) + '%';
            fw.style.color = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
            fireworksLayer.appendChild(fw);

            setTimeout(() => fw.remove(), 1500);
        }, i * 300);
    }
}

// ========== BALLOONS ==========

function createBalloons() {
    document.querySelectorAll('.balloons-container').forEach(container => {
        const balloons = ['🎈', '🎈', '🎈', '🎈', '🎈'];
        const colors = ['', '', '', '', ''];
        balloons.forEach((b, i) => {
            const el = document.createElement('div');
            el.className = 'balloon';
            el.textContent = b;
            el.style.filter = `hue-rotate(${i * 60}deg)`;
            container.appendChild(el);
        });
    });
}

function launchBalloonsFast() {
    document.querySelectorAll('.balloon').forEach(b => {
        b.classList.add('rise-fast');
    });
}

// ========== FLOATING HEARTS ==========

function createFloatingHearts() {
    const hearts = ['❤️', '💕', '💖', '💗', '💝'];
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}%;
                bottom: -30px;
                font-size: ${16 + Math.random() * 16}px;
                z-index: 880;
                pointer-events: none;
                animation: heart-float-up ${4 + Math.random() * 4}s ease-out forwards;
                opacity: 0.7;
            `;
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 8000);
        }, i * 200);
    }
}

const heartFloatStyle = document.createElement('style');
heartFloatStyle.textContent = `
    @keyframes heart-float-up {
        0% { transform: translateY(0) rotate(0deg); opacity: 0; }
        10% { opacity: 0.8; }
        100% { transform: translateY(-110vh) rotate(${Math.random() > 0.5 ? '' : '-'}25deg); opacity: 0; }
    }
`;
document.head.appendChild(heartFloatStyle);

// ========== PARTICLES ==========

function createExtraParticles() {
    const colors = ['rgba(255,107,157,0.6)', 'rgba(255,215,0,0.5)', 'rgba(196,77,255,0.5)', 'rgba(255,255,255,0.4)'];

    setInterval(() => {
        if (document.hidden) return;
        const activeScreen = document.querySelector('.screen.active');
        if (!activeScreen) return;

        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.bottom = '0';
        particle.style.width = (2 + Math.random() * 4) + 'px';
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDuration = (6 + Math.random() * 6) + 's';
        particlesLayer.appendChild(particle);

        setTimeout(() => particle.remove(), 12000);
    }, 800);
}

// Prevent pull-to-refresh and overscroll
document.body.addEventListener('touchmove', (e) => {
    if (e.target.closest('.screen-content')) {
        // Allow no scroll — full screen app
    }
}, { passive: false });

document.addEventListener('gesturestart', (e) => e.preventDefault());
