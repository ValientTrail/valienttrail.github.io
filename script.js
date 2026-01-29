/**
 * Raymond Zegles - Game Developer Portfolio
 * Main JavaScript file handling interactions and contact form
 */

/**
 * IMPORTANT: For emails to be sent successfully, ensure:
 * 
 * 1. EmailJS Dashboard Setup:
 *    - Service ID: service_clyiyig (created and verified)
 *    - Template ID: template_3rw4ljr (created and published)
 * 
 * 2. Template Variables in EmailJS:
 *    The template MUST contain these variables:
 *    - {{from_name}} - Visitor's name
 *    - {{from_email}} - Visitor's email
 *    - {{subject}} - Email subject
 *    - {{message}} - Email message body
 * 
 * 3. Template Recipient:
 *    - Set the recipient email in template settings (usually your email)
 *    - You must have a verified email address
 * 
 * 4. Service Configuration:
 *    - Email service (Gmail, Outlook, etc.) must be connected
 *    - Credentials must be valid and active
 * 
 * Form field names (must match template variables):
 *    - name → from_name
 *    - email → from_email
 *    - subject → subject
 *    - message → message
 */

/**
 * Test EmailJS connection (for debugging)
 * This function sends a test email to verify everything is set up correctly
 */
function testEmailJSConnection() {
    console.log('Testing EmailJS connection...');
    console.log('EmailJS available:', typeof emailjs !== 'undefined');
    
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS SDK not loaded');
        return;
    }

    // Create a test message
    const testData = {
        from_name: 'Portfolio Test',
        from_email: emailInput.value || 'test@example.com',
        subject: 'EmailJS Connection Test',
        message: 'This is a test message to verify EmailJS is working correctly.'
    };

    console.log('Sending test email with data:', testData);
    console.log('Service:', 'service_clyiyig');
    console.log('Template:', 'template_3rw4ljr');

    // Test the connection
    emailjs.send('service_clyiyig', 'template_3rw4ljr', testData)
        .then(response => {
            console.log('✓ Test email sent successfully!', response);
            alert('✓ EmailJS is working! Test email sent. Check your inbox.');
        })
        .catch(error => {
            console.error('✗ Test email failed:', error);
            console.error('Error text:', error.text);
            console.error('Status:', error.status);
            alert('✗ EmailJS test failed. Check console for details:\n' + (error.text || error.message || 'Unknown error'));
        });
}

// Make test function available in console
window.testEmailJS = testEmailJSConnection;

// Initialize contact form when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const formStatus = document.getElementById('formStatus');

    // Verify form exists
    if (!contactForm) {
        console.error('Contact form not found in DOM');
        return;
    }

    console.log('✓ Contact form initialized');

    // Validation functions
    function validateName() {
        const name = nameInput.value.trim();
        if (name.length < 2) {
            nameInput.classList.add('error');
            return false;
        }
        nameInput.classList.remove('error');
        return true;
    }

    function validateEmail() {
        const email = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            emailInput.classList.add('error');
            return false;
        }
        emailInput.classList.remove('error');
        return true;
    }

    function validateSubject() {
        const subject = subjectInput.value.trim();
        if (subject.length < 3) {
            subjectInput.classList.add('error');
            return false;
        }
        subjectInput.classList.remove('error');
        return true;
    }

    function validateMessage() {
        const message = messageInput.value.trim();
        if (message.length < 10) {
            messageInput.classList.add('error');
            return false;
        }
        messageInput.classList.remove('error');
        return true;
    }

    // Add real-time validation
    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmail);
    subjectInput.addEventListener('blur', validateSubject);
    messageInput.addEventListener('blur', validateMessage);

    // Form submission
    contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isSubjectValid = validateSubject();
    const isMessageValid = validateMessage();

    if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
        const submitBtn = contactForm.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        formStatus.className = 'form-status';
        formStatus.style.display = 'none';

        // Send email using EmailJS
        const serviceID = 'service_clyiyig';
        const templateID = 'template_3rw4ljr';

        // Log form data being sent
        const formData = {
            name: nameInput.value,
            email: emailInput.value,
            subject: subjectInput.value,
            message: messageInput.value
        };
        console.log('Sending form data:', formData);
        console.log('Service ID:', serviceID);
        console.log('Template ID:', templateID);

        emailjs.sendForm(serviceID, templateID, contactForm)
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                console.log('Email sent with response:', response);
                // Success
                formStatus.className = 'form-status success';
                formStatus.textContent = '✓ Thank you! Your message has been sent successfully.';
                formStatus.style.display = 'block';
                contactForm.reset();

                // Clear validation errors
                nameInput.classList.remove('error');
                emailInput.classList.remove('error');
                subjectInput.classList.remove('error');
                messageInput.classList.remove('error');

                // Remove loading state
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;

                // Hide success message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
            }, (error) => {
                console.error('FAILED...', error);
                console.error('Error details:', JSON.stringify(error, null, 2));
                console.error('Service ID:', serviceID);
                console.error('Template ID:', templateID);
                
                // Provide detailed error message
                let errorMessage = '✗ Sorry, there was an error sending your message.';
                if (error.text) {
                    errorMessage += ' ' + error.text;
                }
                if (error.status === 400) {
                    errorMessage += ' Please check your message content.';
                }
                
                // Error
                formStatus.className = 'form-status error';
                formStatus.textContent = errorMessage;
                formStatus.style.display = 'block';

                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            });
    } else {
        // Focus on first error
        if (!isNameValid) nameInput.focus();
        else if (!isEmailValid) emailInput.focus();
        else if (!isSubjectValid) subjectInput.focus();
        else if (!isMessageValid) messageInput.focus();
    }
    });
}); // End of DOMContentLoaded for contact form

// ============================================
// AUDIO PLAYER CONTROLS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const aboutAudio = document.getElementById('bgAudio');
    const aboutPlayPauseBtn = document.querySelector('.aboutPlayPauseBtn');
    const aboutVolumeSlider = document.querySelector('.aboutVolumeSlider');

    // Initialize audio volume
    if (aboutAudio) {
        aboutAudio.volume = 0.3;
    }

    // Play/Pause button event listener
    if (aboutPlayPauseBtn && aboutAudio) {
        aboutPlayPauseBtn.addEventListener('click', () => {
            if (aboutAudio.paused) {
                aboutAudio.play().catch(err => console.log('Audio playback unavailable:', err));
                aboutPlayPauseBtn.textContent = '⏸';
                aboutPlayPauseBtn.setAttribute('aria-pressed', 'true');
                aboutPlayPauseBtn.setAttribute('aria-label', 'Pause background music');
            } else {
                aboutAudio.pause();
                aboutPlayPauseBtn.textContent = '▶';
                aboutPlayPauseBtn.setAttribute('aria-pressed', 'false');
                aboutPlayPauseBtn.setAttribute('aria-label', 'Play background music');
            }
        });
    }

    // Volume slider event listener
    if (aboutVolumeSlider && aboutAudio) {
        aboutVolumeSlider.addEventListener('input', (e) => {
            const volumeValue = e.target.value;
            aboutAudio.volume = volumeValue / 100;
            // Update ARIA attributes for volume control
            aboutVolumeSlider.setAttribute('aria-valuenow', volumeValue);
            aboutVolumeSlider.setAttribute('aria-valuetext', `${volumeValue}%`);
        });
    }

    // Reset play button when audio finishes
    if (aboutAudio && aboutPlayPauseBtn) {
        aboutAudio.addEventListener('ended', () => {
            aboutPlayPauseBtn.textContent = '▶';
            aboutPlayPauseBtn.setAttribute('aria-pressed', 'false');
            aboutPlayPauseBtn.setAttribute('aria-label', 'Play background music');
        });
    }
});

// ============================================
// ============================================
// THEME TOGGLE
// ============================================

/**
 * Update theme toggle button text based on current theme
 * @param {string} theme - Current theme ('light' or 'dark')
 * @param {HTMLElement} themeToggle - The theme toggle button element
 */
function updateThemeToggleText(theme, themeToggle) {
    if (!themeToggle) return;
    
    themeToggle.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
    
    // Announce theme change to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `Theme changed to ${theme} mode`;
    document.body.appendChild(announcement);
    
    // Remove announcement after announcement
    setTimeout(() => announcement.remove(), 1000);
}

document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    if (!themeToggle) {
        console.warn('Theme toggle button not found');
        return;
    }

    // Load saved theme preference or default to 'dark'
    const currentTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', currentTheme);
    updateThemeToggleText(currentTheme, themeToggle);

    // Theme toggle event listener
    themeToggle.addEventListener('click', () => {
        const theme = html.getAttribute('data-theme');
        const newTheme = theme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeToggleText(newTheme, themeToggle);
        
        // Update ARIA pressed state
        themeToggle.setAttribute('aria-pressed', newTheme === 'dark' ? 'true' : 'false');
    });
});

// ============================================
// SMOOTH SCROLL NAVIGATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ============================================
// SCROLL ANIMATIONS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
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
});
