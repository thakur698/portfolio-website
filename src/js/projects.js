(() => {
  // Project Case Study Data Store for Interactive Modal (Synchronized with Resume)
  const PROJECTS_DATA = {
    'carpool': {
      title: 'Carpool — Peer-to-Peer Mobility & Dynamic Ridesharing Platform',
      client: 'PROPRIETARY MOBILITY BUILD • LIVE DEMO ON REQUEST',
      category: 'Mobile Systems & Spatial Routing',
      image: 'public/assets/images/carpool-project.jpg?v=2026.3',
      metric: 'Sub-Second GPS & Polyline Routing',
      timeline: 'Flutter & Firebase Architecture',
      deliverables: ['Google Maps Polyline Spatial Engine', 'Concurrent Seat Allocation State Machine', 'Sub-second GPS Telemetry Sync', 'Dynamic Fare-Calculation Algorithm', 'Hive Local Offline Cache'],
      overview: 'Architected a mobility platform enabling drivers to publish intercity journeys and passengers to book individual seats along dynamic travel corridors. Built a spatial route-matching engine using Google Maps Polyline APIs to match pickup/drop-off points along active routes within configurable detour radii. Implemented a concurrent seat allocation state machine with optimistic UI updates and server-side locks to eliminate race conditions and overbooking.',
      impact: 'Integrated real-time GPS telemetry and live route tracking, synchronizing driver location updates to passenger devices with sub-second latency. Designed an automated fare-calculation algorithm computing dynamic per-seat pricing based on distance segments, fuel rates, and co-traveler occupancy.'
    },
    'shivra': {
      title: 'Shivra Workout — Full-Stack AI Fitness & Telehealth Ecosystem',
      client: 'HEALTHTECH ECOSYSTEM • LIVE DEMO ON REQUEST',
      year: '2026',
      category: 'Multimodal AI Vision & BLE Telemetry',
      image: 'public/assets/images/shivra-project.jpg?v=2026.3',
      metric: '<1.8s Vision AI Nutritional Logging',
      timeline: 'Flutter, OpenRouter AI, Stripe',
      deliverables: ['Multimodal AI Vision Meal Scanner', 'USDA FoodData Central API Pipeline', 'BLE Wearable Telemetry Sync', 'Elder-Care & Physiotherapy Hub', 'Stripe Payment Gateway'],
      overview: 'Architected an end-to-end health ecosystem integrating multimodal AI vision tracking, real-time biometric telemetry, and telehealth scheduling. Engineered an automated meal-scanning engine using OpenRouter vision models to classify food captures, querying the USDA FoodData Central API for nutritional logging within 1.8 seconds. Designed an Elder-Care & Physiotherapy Telehealth Hub supporting calendar scheduling, role-based practitioner portals, and encrypted real-time video consultations.',
      impact: 'Integrated Bluetooth Low Energy (BLE) and wearable sensor telemetry to ingest live biometric data (heart rate, cadence, calories) into Cloud Firestore with local Hive offline caching. Implemented proximity-based gym discovery via Google Maps & Places SDK, community motivation feeds, and secure Stripe payment checkouts.'
    },
    'universal-ui': {
      title: 'Universal UI Skills — Open-Source AI Design System Framework',
      client: 'OPEN SOURCE • GITHUB: thakur698/universal-ui-skills',
      year: '2026',
      category: 'LLM Prompt Engineering & Design Systems',
      image: 'public/assets/images/universal-ui-project.jpg?v=2026.3',
      metric: 'Open-Source Framework • Deterministic AI',
      timeline: 'Creator & Core Maintainer',
      deliverables: ['Declarative Design Token Schemas', 'LLM System Prompt Constraint Architecture', 'Agentic Coding Recipes (Cursor/Claude)', 'Strict Widget Hierarchy Rules'],
      overview: 'Authored an open-source design constraint framework and system prompt architecture that eliminates redundant styling and visual anti-patterns in AI-generated user interfaces. Defined declarative design token schemas, component contracts, and accessibility rules to force LLMs into producing modular, clean-code UI layouts rather than unmaintainable boilerplate.',
      impact: 'Engineered deterministic prompt recipes for agentic coding tools (e.g., Cursor, Claude, Copilot) enforcing responsive flex/grid layouts, scalable typography scales, and strict semantic HTML/Flutter widget hierarchies across 30+ repositories.'
    },
    'mailofly': {
      title: 'Mailofly — Production Web Architecture & Microservices',
      client: 'MAILOFLY (mailofly.com)',
      year: '2026 — Present',
      category: 'Full-Stack Web & Microservices',
      image: 'public/assets/images/mailofly-project.jpg?v=2026.3',
      metric: '-25% First Contentful Paint (FCP)',
      timeline: 'Full-Stack Software Engineer — Core Team',
      deliverables: ['React.js Modular Web Architecture', 'Asynchronous RESTful APIs', 'Third-Party Webhook Ingestion Engine', 'Automated CI/CD Deployment Routines'],
      overview: 'Core team engineer architecting and deploying production web modules using React.js and Node.js, ensuring cross-device responsiveness and sub-second rendering performance. Developed modular, asynchronous RESTful API endpoints handling state synchronization, secure user session management, and third-party webhook events.',
      impact: 'Optimized client-side rendering pipelines and asset delivery, reducing First Contentful Paint (FCP) by 25% across primary dashboard views. Collaborated directly with core engineering leads on database schema design, endpoint rate-limiting, and automated CI/CD deployment routines.'
    },
    's2s-attribution': {
      title: 'Cryptographic S2S Postback & Attribution Engine',
      client: 'ENTERPRISE MICROSERVICE ARCHITECTURE',
      year: '2025 — 2026',
      category: 'Web & Backend Security',
      image: 'public/assets/images/s2s-project.jpg?v=2026.3',
      metric: '100% Cryptographic Verification',
      timeline: 'Backend Systems Build',
      deliverables: ['HMAC-SHA256 Cryptographic Verification', 'Idempotent Deduplication Engine', 'Server-to-Server (S2S) Webhooks', 'WebSocket State Broadcasts', 'JWT Authentication'],
      overview: 'Designed a high-throughput event ingestion microservice for attribution postbacks. Implemented strict HMAC-SHA256 cryptographic verification to ensure payload integrity, paired with an in-memory Redis deduplication cache to guarantee zero double-counting on network retries.',
      impact: 'Ensured 100% data integrity across high-concurrency event streams with sub-100ms response times and strict rate-limiting policies.'
    },
    'codechef': {
      title: 'CodeChef Algorithmic Rigor & Optimal Complexity Lab',
      client: 'COMPETITIVE PROGRAMMING & SYSTEM R&D',
      year: '2024 — 2026',
      category: 'Algorithms & Data Structures',
      image: 'public/assets/images/codechef-project.jpg?v=2026.3',
      metric: '100+ Algorithmic Challenges Solved',
      timeline: 'NIMS University & NPTEL Certified',
      deliverables: ['Graph & Spatial Routing Optimizations', 'Dynamic Programming Solutions', 'Asymptotic Time/Space Audits', 'NPTEL Python Programming Certification'],
      overview: 'Comprehensive algorithmic problem-solving across CodeChef and competitive platforms focusing on optimal time and space complexity. Translated theoretical graph theory and polygon geometry into production spatial routing algorithms for Carpool and concurrent state machines.',
      impact: 'Solved 100+ verified challenges, backed by NPTEL Certification in Python Programming and coursework in DSA, DBMS, and Operating Systems from NIMS University (B.Tech CSE Expected 2026).'
    }
  };

  // Optional Smooth Inertia Scroll (Lenis)
  let lenisInstance = null;
  if (typeof Lenis !== 'undefined') {
    lenisInstance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    function lenisRaf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(lenisRaf);
    }
    requestAnimationFrame(lenisRaf);
  }

  // Interactive Category Filter
  const filterButtons = document.querySelectorAll('.filter-tab-btn');
  const projectCards = document.querySelectorAll('.project-card');

  // ====================================================
  // ULTRA-SMOOTH HARDWARE-ACCELERATED STICKY STACKING ENGINE
  // ====================================================
  function initStickyCardStackingEngine() {
    const cards = Array.from(document.querySelectorAll('.projects-masonry-grid .project-card'));
    if (!cards.length) return null;

    const PIN_TOP = 96;

    // Apply incremental z-index so subsequent cards stack cleanly on top
    function updateZIndices() {
      const visibleCards = cards.filter(c => c.style.display !== 'none');
      visibleCards.forEach((card, index) => {
        card.style.zIndex = index + 10;
      });
    }
    updateZIndices();

    let windowHeight = window.innerHeight;
    window.addEventListener('resize', () => {
      windowHeight = window.innerHeight;
      updateStack();
    }, { passive: true });

    // Smooth Stacking Update - 100% GPU composited (scale & opacity)
    function updateStack() {
      const visibleCards = cards.filter(c => c.style.display !== 'none');
      const count = visibleCards.length;

      for (let i = 0; i < count; i++) {
        const card = visibleCards[i];
        const nextCard = visibleCards[i + 1];

        if (nextCard) {
          const nextRect = nextCard.getBoundingClientRect();
          const distanceToPin = nextRect.top - PIN_TOP;
          const travelZone = windowHeight - PIN_TOP;

          if (distanceToPin <= 0) {
            // Next card has arrived and locked over this card
            card.style.transform = 'scale(0.95) translate3d(0, 0, 0)';
            card.style.setProperty('--card-shade', '0.45');
          } else if (distanceToPin < travelZone) {
            // Next card is in transit sliding up towards pin point
            const progress = 1 - (distanceToPin / travelZone);
            const scale = 1 - (progress * 0.05); // scale down from 1.0 to 0.95
            const shade = (progress * 0.45).toFixed(3);
            card.style.transform = `scale(${scale.toFixed(4)}) translate3d(0, 0, 0)`;
            card.style.setProperty('--card-shade', shade);
          } else {
            // Next card has not reached transit zone
            card.style.transform = 'scale(1) translate3d(0, 0, 0)';
            card.style.setProperty('--card-shade', '0');
          }
        } else {
          // Top active card
          card.style.transform = 'scale(1) translate3d(0, 0, 0)';
          card.style.setProperty('--card-shade', '0');
        }
      }
    }

    // Passive throttled scroll listener (Zero CPU when idle)
    let isTicking = false;
    function requestTick() {
      if (!isTicking) {
        requestAnimationFrame(() => {
          updateStack();
          isTicking = false;
        });
        isTicking = true;
      }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
    if (lenisInstance) {
      lenisInstance.on('scroll', requestTick);
    }

    // Initial pass
    updateStack();

    // Interactive Cursor Spotlight Glare
    cards.forEach(card => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      }, { passive: true });
    });

    return () => {
      updateZIndices();
      updateStack();
    };
  }

  const triggerStackUpdate = initStickyCardStackingEngine();

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category') || '';
        
        if (filterValue === 'all' || cardCategory.includes(filterValue)) {
          card.style.display = 'grid';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 10);
        } else {
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });

      if (triggerStackUpdate) {
        setTimeout(triggerStackUpdate, 300);
      }
    });
  });

  // Modal elements
  const modalOverlay = document.getElementById('case-modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalImg = document.getElementById('modal-header-img');
  const modalClient = document.getElementById('modal-client');
  const modalYear = document.getElementById('modal-year');
  const modalTitle = document.getElementById('modal-title');
  const modalMetric = document.getElementById('modal-metric');
  const modalTimeline = document.getElementById('modal-timeline');
  const modalCategory = document.getElementById('modal-category');
  const modalDesc = document.getElementById('modal-desc');
  const modalImpact = document.getElementById('modal-impact');
  const modalTags = document.getElementById('modal-tags');

  // Open modal with project details
  function openProjectModal(projectId) {
    const data = PROJECTS_DATA[projectId];
    if (!data || !modalOverlay) return;

    modalImg.src = data.image;
    modalImg.alt = data.title;
    modalClient.textContent = data.client;
    modalYear.textContent = data.year;
    modalTitle.textContent = data.title;
    modalMetric.textContent = data.metric;
    modalTimeline.textContent = data.timeline;
    modalCategory.textContent = data.category;
    modalDesc.textContent = data.overview;
    modalImpact.textContent = data.impact;

    modalTags.innerHTML = '';
    data.deliverables.forEach(tag => {
      const pill = document.createElement('span');
      pill.className = 'modal-tag-pill';
      pill.textContent = tag;
      modalTags.appendChild(pill);
    });

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (lenisInstance) lenisInstance.stop();
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    if (lenisInstance) lenisInstance.start();
  }

  // Attach click listener to project cards
  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.getAttribute('data-project');
      if (projectId) {
        openProjectModal(projectId);
      }
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

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
})();

