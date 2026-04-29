document.addEventListener('DOMContentLoaded', () => {
    const textToType = "Premium Smart Solutions";
    const typingSpeed = 100;
    const typingElement = document.getElementById('typing-text');
    let charIndex = 0;

    function typeText() {
        if (typingElement && charIndex < textToType.length) {
            typingElement.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeText, typingSpeed);
        }
    }

    setTimeout(typeText, 500);

    const canvas = document.getElementById('hero-canvas');
    const context = canvas.getContext('2d');
    const section = document.getElementById('hero-scroll-sequence');

    const frameCount = 144;
    const currentFrame = index => (
        `HomeFrames/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
    );

    const images = [];
    let currentFrameIndex = 0;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (images[currentFrameIndex] && images[currentFrameIndex].complete) {
            drawFrame(images[currentFrameIndex]);
        }
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let loadedImagesCount = 0;

    const preloadPromise = new Promise((resolve) => {
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.onload = () => {
                loadedImagesCount++;
                if (i === 0) {
                    requestAnimationFrame(() => drawFrame(img));
                }
                if (loadedImagesCount >= Math.min(10, frameCount) && i === 0) {
                    resolve();
                }
                if (loadedImagesCount === frameCount) resolve();
            };
            img.onerror = () => {
                loadedImagesCount++;
                if (loadedImagesCount === frameCount) resolve();
            };
            img.src = currentFrame(i);
            images.push(img);
        }
    });

    function drawFrame(img) {
        if (!img || !img.complete) return;

        const sWidth = img.width;
        const sHeight = img.height * 0.93;

        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = sWidth / sHeight;
        let drawWidth, drawHeight, offsetX = 0, offsetY = 0;

        if (canvasRatio > imgRatio) {
            drawWidth = canvas.width;
            drawHeight = drawWidth / imgRatio;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawHeight = canvas.height;
            drawWidth = drawHeight * imgRatio;
            offsetX = (canvas.width - drawWidth) / 2;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, sWidth, sHeight, offsetX, offsetY, drawWidth, drawHeight);
    }

    let animationScrollTop = 0;
    let isTicking = false;

    window.addEventListener('scroll', () => {
        animationScrollTop = window.scrollY;

        if (!isTicking) {
            window.requestAnimationFrame(() => {
                updateImageSequence();
                isTicking = false;
            });
            isTicking = true;
        }
    });

    function updateImageSequence() {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const scrollRange = sectionHeight - window.innerHeight;

        let scrollYOffset = animationScrollTop - sectionTop;

        if (scrollYOffset < 0) scrollYOffset = 0;
        if (scrollYOffset > scrollRange) scrollYOffset = scrollRange;

        let scrollFraction = scrollYOffset / scrollRange;
        if (isNaN(scrollFraction)) scrollFraction = 0;

        const frameIndex = Math.min(
            frameCount - 1,
            Math.floor(scrollFraction * frameCount)
        );
        currentFrameIndex = frameIndex;

        requestAnimationFrame(() => drawFrame(images[frameIndex]));
    }
    // Video Playback Logic
    const bgVideo = document.querySelector('.premium-bg-video');
    if (bgVideo) {
        const playVideo = () => {
            bgVideo.play().catch(() => { });
            document.removeEventListener('touchstart', playVideo);
            document.removeEventListener('click', playVideo);
        };
        document.addEventListener('touchstart', playVideo);
        document.addEventListener('click', playVideo);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    bgVideo.play().catch(() => { });
                }
            });
        }, { threshold: 0.1 });
        observer.observe(bgVideo);
    }

    // ── Struga Project Slider ─────────────────────────────────
    const track      = document.getElementById('slider-track');
    const dotsWrap   = document.getElementById('slider-dots');
    const prevBtn    = document.getElementById('prev-arrow');
    const nextBtn    = document.getElementById('next-arrow');
    const sliderEl   = document.getElementById('struga-slider');

    if (track && sliderEl) {
        const slides = Array.from(track.querySelectorAll('.slide'));
        const total  = slides.length;
        let current  = 0;
        let autoTimer = null;
        const INTERVAL = 2000; // 2 seconds

        // Per-slide captions
        const captions = [
            'Smart Building — Full KNX Integration',
            'Central KNX Distribution Panel',
            'Intelligent Lighting Control',
            'Motorised Blind & Shading System',
            'Smart Thermostat & Climate Control',
            'IP Security Camera Network',
            'Access Control & Smart Entry',
            'Intruder Alarm & Detection System',
            'Autonomous Garden Robot System',
            'Professional KNX Installation',
            'System Detail & Component View',
            'Structured Cable & Wiring',
            'Control Room & Programming',
            'Building Exterior & Facade',
            'Garden Automation & Landscaping',
        ];

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
            // Remove active Ken Burns from current
            slides[current].classList.remove('is-active');

            current = (index + total) % total;
            track.style.transform = `translateX(-${current * 100}%)`;

            // Update dots
            dots.forEach((d, i) => d.classList.toggle('active', i === current));

            // Apply Ken Burns to new slide
            slides[current].classList.add('is-active');
        }

        function startAuto() {
            stopAuto();
            autoTimer = setInterval(() => goTo(current + 1), INTERVAL);
        }

        function stopAuto() {
            if (autoTimer) {
                clearInterval(autoTimer);
                autoTimer = null;
            }
        }

        // Arrow buttons
        if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

        // Pause on hover
        sliderEl.addEventListener('mouseenter', stopAuto);
        sliderEl.addEventListener('mouseleave', startAuto);

        // Touch / swipe support
        let touchStartX = 0;
        sliderEl.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
            stopAuto();
        }, { passive: true });
        sliderEl.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
            startAuto();
        }, { passive: true });

        // Init
        goTo(0);
        startAuto();
    }
    // ─────────────────────────────────────────────────────────
});

