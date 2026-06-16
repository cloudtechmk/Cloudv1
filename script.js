document.addEventListener('DOMContentLoaded', () => {
    // ── Current language ──
    let currentLang = localStorage.getItem('cloudtech_lang') || 'en';

    // ── Language Switcher ──
    function switchLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('cloudtech_lang', lang);
        document.documentElement.lang = lang;

        // Update text content
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });

        // Update innerHTML content
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang] && translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });

        // Update meta description
        const metaDesc = document.getElementById('meta-description');
        if (metaDesc && translations[lang] && translations[lang].meta_desc) {
            metaDesc.setAttribute('content', translations[lang].meta_desc);
        }

        // Update active button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        // Restart typing animation
        restartTyping();

        // Re-send welcome message if chatbot is open
        const msgs = document.getElementById('chatbot-messages');
        if (msgs && msgs.children.length <= 1) {
            msgs.innerHTML = '';
            addBotMessage(translations[lang].chat_welcome);
        }
    }

    // Language button listeners
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchLanguage(btn.getAttribute('data-lang'));
        });
    });

    // ── Typing Animation ──
    const typingElement = document.getElementById('typing-text');
    let typingTimeout = null;
    let charIndex = 0;

    function restartTyping() {
        if (typingTimeout) clearTimeout(typingTimeout);
        charIndex = 0;
        if (typingElement) typingElement.textContent = '';
        setTimeout(typeText, 300);
    }

    function typeText() {
        const text = translations[currentLang]?.hero_subtext || 'Premium Smart Solutions';
        if (typingElement && charIndex < text.length) {
            typingElement.textContent += text.charAt(charIndex);
            charIndex++;
            typingTimeout = setTimeout(typeText, 100);
        }
    }



    // ── Struga Project Slider (MANUAL ONLY — no auto-play) ──
    const track = document.getElementById('slider-track');
    const dotsWrap = document.getElementById('slider-dots');
    const prevBtn = document.getElementById('prev-arrow');
    const nextBtn = document.getElementById('next-arrow');
    const sliderEl = document.getElementById('struga-slider');

    if (track && sliderEl) {
        const slides = Array.from(track.querySelectorAll('.slide'));
        const total = slides.length;
        let current = 0;

        // Build dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(dot);
        });

        const dots = Array.from(dotsWrap.querySelectorAll('.slider-dot'));

        function goTo(index) {
            slides[current].classList.remove('is-active');
            current = (index + total) % total;
            track.style.transform = `translateX(-${current * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === current));
            slides[current].classList.add('is-active');
        }

        // Arrow buttons — manual only
        if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

        // Touch / swipe support — manual only
        let touchStartX = 0;
        sliderEl.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        sliderEl.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
        }, { passive: true });

        goTo(0);
    }

    // ── Nav scroll effect ──
    const nav = document.getElementById('main-nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    // ── Scroll Reveal Animations ──
    const revealSections = document.querySelectorAll('.about-section, .technology-section, .project-showcase-section, .reviews-section, .capabilities-section');
    revealSections.forEach(s => s.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealSections.forEach(s => revealObserver.observe(s));

    // ── AI Chatbot ──
    const chatBubble = document.getElementById('chatbot-bubble');
    const chatWindow = document.getElementById('chatbot-window');
    const chatClose = document.getElementById('chatbot-close');
    const chatInput = document.getElementById('chatbot-input');
    const chatSend = document.getElementById('chatbot-send');
    const chatMessages = document.getElementById('chatbot-messages');
    const chatChips = document.getElementById('chatbot-chips');

    function addBotMessage(text) {
        const div = document.createElement('div');
        div.className = 'chat-msg bot';
        div.textContent = text;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addUserMessage(text) {
        const div = document.createElement('div');
        div.className = 'chat-msg user';
        div.textContent = text;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getBotResponse(input) {
        const t = translations[currentLang];
        const lower = input.toLowerCase();
        if (/knx|bus|protocol/i.test(lower)) return t.chat_knx;
        if (/home.?assistant|ha\b/i.test(lower)) return t.chat_ha;
        if (/price|cost|pricing|quote|how much|çmim|цен/i.test(lower)) return t.chat_pricing;
        if (/contact|whatsapp|email|phone|call|контакт|kontakt/i.test(lower)) return t.chat_contact;
        if (/hello|hi|hey|здраво|përshëndetje/i.test(lower)) return t.chat_welcome;
        return t.chat_fallback;
    }

    function handleUserInput() {
        const text = chatInput.value.trim();
        if (!text) return;
        addUserMessage(text);
        chatInput.value = '';
        setTimeout(() => addBotMessage(getBotResponse(text)), 500);
    }

    if (chatBubble && chatWindow) {
        // Open
        chatBubble.addEventListener('click', () => {
            chatWindow.classList.add('open');
            chatBubble.style.display = 'none';
            if (chatMessages.children.length === 0) {
                addBotMessage(translations[currentLang].chat_welcome);
            }
        });

        // Close
        chatClose.addEventListener('click', () => {
            chatWindow.classList.remove('open');
            chatBubble.style.display = 'flex';
        });

        // Send
        chatSend.addEventListener('click', handleUserInput);
        chatInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') handleUserInput();
        });

        // Chips
        chatChips.querySelectorAll('.chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const type = chip.getAttribute('data-chip');
                const t = translations[currentLang];
                addUserMessage(chip.textContent);
                setTimeout(() => {
                    if (type === 'knx') addBotMessage(t.chat_knx);
                    else if (type === 'pricing') addBotMessage(t.chat_pricing);
                    else if (type === 'ha') addBotMessage(t.chat_ha);
                    else if (type === 'contact') addBotMessage(t.chat_contact);
                }, 500);
            });
        });
    }

    // ── Reviews Slider ──
    const reviewsTrack = document.getElementById('reviews-track');
    const reviewsDotsWrap = document.getElementById('reviews-dots');
    const reviewPrevBtn = document.getElementById('review-prev-arrow');
    const reviewNextBtn = document.getElementById('review-next-arrow');
    const reviewsSliderEl = document.getElementById('reviews-slider');

    if (reviewsTrack && reviewsSliderEl) {
        const reviewSlides = Array.from(reviewsTrack.querySelectorAll('.review-slide'));
        const totalReviews = reviewSlides.length;
        let currentReview = 0;

        // Build dots
        reviewSlides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'reviews-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to review ${i + 1}`);
            dot.addEventListener('click', () => goToReview(i));
            reviewsDotsWrap.appendChild(dot);
        });

        const reviewDots = Array.from(reviewsDotsWrap.querySelectorAll('.reviews-dot'));

        function goToReview(index) {
            reviewSlides[currentReview].classList.remove('is-active');
            currentReview = (index + totalReviews) % totalReviews;
            reviewsTrack.style.transform = `translateX(-${currentReview * 100}%)`;
            reviewDots.forEach((d, i) => d.classList.toggle('active', i === currentReview));
            reviewSlides[currentReview].classList.add('is-active');
        }

        // Arrow buttons
        if (reviewPrevBtn) reviewPrevBtn.addEventListener('click', () => goToReview(currentReview - 1));
        if (reviewNextBtn) reviewNextBtn.addEventListener('click', () => goToReview(currentReview + 1));

        // Touch / swipe support
        let touchStartX = 0;
        reviewsSliderEl.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        reviewsSliderEl.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) goToReview(diff > 0 ? currentReview + 1 : currentReview - 1);
        }, { passive: true });

        goToReview(0);
    }

    // ── Initialize Language ──
    switchLanguage(currentLang);
});
