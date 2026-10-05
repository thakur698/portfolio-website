(() => {
  const TOTAL_FRAMES = 240;
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
  const loader = document.getElementById('loader');
  const loaderBar = document.getElementById('loader-bar');

  // Image storage and loading state
  const frames = new Array(TOTAL_FRAMES);
  const isLoaded = new Array(TOTAL_FRAMES).fill(false);
  let loadedCount = 0;

  // Animation & interpolation state
  let targetProgress = 0;
  let currentProgress = 0;
  const ease = 0.085; // Butter-smooth interpolation coefficient
  let currentFrameIndex = -1;
  let needsRedraw = false;

  // Build frame file path
  function getFramePath(index) {
    const frameNum = String(index + 1).padStart(3, '0');
    return `public/assets/frames/ezgif-frame-${frameNum}.jpg`;
  }

  // Cover image draw calculation
  function drawCoverImage(img) {
    if (!img) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || img.width || 1920;
    const ih = img.naturalHeight || img.height || 1080;

    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) * 0.5;
    const dy = (ch - dh) * 0.5;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  // Fallback to nearest loaded frame if current index is still buffering
  function getBestAvailableFrame(index) {
    if (isLoaded[index]) return frames[index];
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = index - offset;
      if (prev >= 0 && isLoaded[prev]) return frames[prev];
      const next = index + offset;
      if (next < TOTAL_FRAMES && isLoaded[next]) return frames[next];
    }
    return null;
  }

  function renderFrame(index) {
    const frame = getBestAvailableFrame(index);
    if (frame) {
      drawCoverImage(frame);
    }
  }

  // Handle window resizing and retina displays
  function handleResize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    needsRedraw = true;
  }

  window.addEventListener('resize', handleResize, { passive: true });
  handleResize();

  // Preload all frames
  function preloadImages() {
    // 1. Immediately load frame 0 for instant initial visual feedback
    const firstImg = new Image();
    firstImg.src = getFramePath(0);
    frames[0] = firstImg;
    firstImg.onload = () => {
      isLoaded[0] = true;
      loadedCount++;
      renderFrame(0);
      currentFrameIndex = 0;
    };

    // 2. Load all remaining frames
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (i === 0) continue;

      const img = new Image();
      img.src = getFramePath(i);
      frames[i] = img;

      img.onload = () => {
        isLoaded[i] = true;
        loadedCount++;

        const percent = Math.round((loadedCount / TOTAL_FRAMES) * 100);
        if (loaderBar) {
          loaderBar.style.width = `${percent}%`;
        }

        if (loadedCount === TOTAL_FRAMES) {
          setTimeout(() => {
            if (loader) loader.classList.add('hidden');
          }, 250);
        }
      };

      img.onerror = () => {
        console.warn(`Failed to load frame ${i + 1}`);
      };
    }
  }

  // Compute scroll progress: cut the scroll animation where the footer ends
  function updateScrollTarget() {
    const footer = document.getElementById('site-footer');
    let maxAnimScroll;

    if (footer) {
      // Scroll animation completes smoothly at frame 240 as the user reaches the footer
      const footerTop = footer.offsetTop;
      maxAnimScroll = Math.max(1, footerTop - (window.innerHeight * 0.3));
    } else {
      maxAnimScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    }

    const scrollY = window.scrollY || window.pageYOffset || 0;
    targetProgress = Math.min(1, Math.max(0, scrollY / maxAnimScroll));
  }

  window.addEventListener('scroll', updateScrollTarget, { passive: true });

  // Main 60/120fps Animation Loop with linear interpolation (Lerp)
  function loop() {
    updateScrollTarget();

    const diff = targetProgress - currentProgress;
    if (Math.abs(diff) > 0.00002) {
      currentProgress += diff * ease;
    } else {
      currentProgress = targetProgress;
    }

    const frameIndex = Math.min(
      TOTAL_FRAMES - 1,
      Math.max(0, Math.round(currentProgress * (TOTAL_FRAMES - 1)))
    );

    if (frameIndex !== currentFrameIndex || needsRedraw) {
      renderFrame(frameIndex);
      currentFrameIndex = frameIndex;
      needsRedraw = false;
    }

    requestAnimationFrame(loop);
  }

  // ====================================================
  // PARALLAX SCROLL EFFECT FOR HOME PROJECTS SHOWCASE
  // ====================================================
  function initHomeProjectsParallax() {
    const cards = Array.from(document.querySelectorAll('.designs-section .project-card'));
    if (!cards.length) return;

    const cardStates = cards.map((card, idx) => {
      const img = card.querySelector('.card-img');
      return {
        card,
        img,
        idx,
        targetY: 0,
        currentY: 0,
        targetImgY: 0,
        currentImgY: 0,
        tiltX: 0,
        tiltY: 0,
        targetTiltX: 0,
        targetTiltY: 0,
        isHovered: false
      };
    });

    let windowHeight = window.innerHeight;
    window.addEventListener('resize', () => { windowHeight = window.innerHeight; }, { passive: true });

    function renderLoop() {
      const viewportCenter = windowHeight / 2;
      const isDesktop = window.innerWidth > 900;

      cardStates.forEach(state => {
        const rect = state.card.getBoundingClientRect();

        if (rect.bottom >= -200 && rect.top <= windowHeight + 200) {
          const cardCenter = rect.top + rect.height / 2;
          const progress = (cardCenter - viewportCenter) / (windowHeight / 2);
          const clamped = Math.max(-1.4, Math.min(1.4, progress));

          // 1. Inner image parallax
          state.targetImgY = clamped * 50;

          // 2. Staggered card differential parallax on desktop
          if (isDesktop) {
            state.targetY = (state.idx % 2 === 1) ? (clamped * 35) : (clamped * -15);
          } else {
            state.targetY = 0;
          }
        }

        state.currentImgY += (state.targetImgY - state.currentImgY) * 0.12;
        state.currentY += (state.targetY - state.currentY) * 0.12;
        state.tiltX += (state.targetTiltX - state.tiltX) * 0.15;
        state.tiltY += (state.targetTiltY - state.tiltY) * 0.15;

        if (state.img) {
          const scale = state.isHovered ? 1.1 : 1.05;
          state.img.style.transform = `translate3d(0, ${state.currentImgY.toFixed(2)}px, 0) scale(${scale})`;
        }

        const hoverLift = state.isHovered ? -10 : 0;
        const totalY = state.currentY + hoverLift;
        state.card.style.transform = `perspective(1200px) rotateX(${state.tiltX.toFixed(2)}deg) rotateY(${state.tiltY.toFixed(2)}deg) translate3d(0, ${totalY.toFixed(2)}px, 0)`;
      });

      requestAnimationFrame(renderLoop);
    }

    requestAnimationFrame(renderLoop);

    // Interactive 3D Cursor Tilt & Spotlight Tracking
    cardStates.forEach(state => {
      state.card.addEventListener('mouseenter', () => {
        state.isHovered = true;
      });

      state.card.addEventListener('mousemove', (e) => {
        const rect = state.card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        state.card.style.setProperty('--mouse-x', `${x}px`);
        state.card.style.setProperty('--mouse-y', `${y}px`);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        state.targetTiltX = ((y - centerY) / centerY) * -5;
        state.targetTiltY = ((x - centerX) / centerX) * 5;
      });

      state.card.addEventListener('mouseleave', () => {
        state.isHovered = false;
        state.targetTiltX = 0;
        state.targetTiltY = 0;
      });
    });
  }

  // Real-time Jaipur / IST studio clock in footer
  function updateStudioClock() {
    const timeEl = document.getElementById('studio-time-text');
    if (!timeEl) return;
    try {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      timeEl.textContent = `Jaipur Time: ${timeStr} IST`;
    } catch (e) {
      // fallback
    }
  }

  updateStudioClock();
  setInterval(updateStudioClock, 1000);

  // ====================================================
  // CONTACT FORM HANDLER (API INTEGRATION)
  // ====================================================
  function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('scale-name').value;
      const email = document.getElementById('scale-email').value;
      const building = document.getElementById('scale-building').value;
      const timeline = document.getElementById('scale-timeline').value;
      const stack = document.getElementById('scale-stack').value;
      const summary = document.getElementById('scale-summary').value;
      const submitBtn = contactForm.querySelector('.scale-submit-btn');

      // Construct a unified message detailing their project context
      const message = `
What are we building: ${building}
Estimated timeline: ${timeline}
Core tech stack: ${stack}
Project Summary: ${summary}
      `.trim();

      try {
        if (submitBtn) submitBtn.style.opacity = '0.5';
        
        // Use relative URL if on same origin, or fallback to dev server port 5000
        const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000/api/contact' : '/api/contact';
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            subject: 'Portfolio Project Inquiry',
            message
          })
        });

        const data = await response.json();
        if (data.success) {
          alert('Inquiry received! I will reach out shortly.');
          contactForm.reset();
        } else {
          alert('Failed to send inquiry: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        console.error(err);
        alert('Could not send inquiry. Please ensure the backend is running or try again later.');
      } finally {
        if (submitBtn) submitBtn.style.opacity = '1';
      }
    });
  }

  // Initialize
  preloadImages();
  requestAnimationFrame(loop);
  initHomeProjectsParallax();
  initContactForm();
})();
