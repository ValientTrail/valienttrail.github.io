// Portfolio JavaScript

// Audio Player functionality
const aboutAudio = document.getElementById('bgAudio');
const aboutPlayPauseBtn = document.querySelector('.aboutPlayPauseBtn');
const aboutVolumeSlider = document.querySelector('.aboutVolumeSlider');

// Set initial volume
if (aboutAudio) {
    aboutAudio.volume = 0.7;
}

// About section play/pause button
if (aboutPlayPauseBtn) {
    aboutPlayPauseBtn.addEventListener('click', () => {
        if (aboutAudio) {
            if (aboutAudio.paused) {
                aboutAudio.play().catch(err => console.log('Playback failed:', err));
                aboutPlayPauseBtn.textContent = '⏸';
            } else {
                aboutAudio.pause();
                aboutPlayPauseBtn.textContent = '▶';
            }
        }
    });
}

// About section volume slider
if (aboutVolumeSlider) {
    aboutVolumeSlider.addEventListener('input', (e) => {
        if (aboutAudio) {
            aboutAudio.volume = e.target.value / 100;
        }
    });
}

// Reset play button when audio ends
if (aboutAudio) {
    aboutAudio.addEventListener('ended', () => {
        if (aboutPlayPauseBtn) aboutPlayPauseBtn.textContent = '▶';
    });
}

// Theme Toggle functionality
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference or default to 'dark'
const currentTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', currentTheme);
updateThemeToggleText(currentTheme);

function updateThemeToggleText(theme) {
    if (theme === 'dark') {
        themeToggle.textContent = '☀️ Light';
    } else {
        themeToggle.textContent = '🌙 Dark';
    }
}

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggleText(newTheme);
});

// Add smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add animation to gallery items on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out';
        }
    });
}, observerOptions);

// Observe gallery items
document.querySelectorAll('.gallery-item, .project-card, .skill-card').forEach(el => {
    observer.observe(el);
});

// Add fade in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
