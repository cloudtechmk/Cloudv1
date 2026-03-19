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

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (images[0] && images[0].complete) {
            drawFrame(images[0]);
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
});
