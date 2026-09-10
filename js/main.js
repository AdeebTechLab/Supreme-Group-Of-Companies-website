/**
 * Supreme Group of Companies - Modern Enterprise Interactive Scripts
 * Quality Standard: Apple / Linear / Stripe grade responsive interactions & motion
 */

document.addEventListener('DOMContentLoaded', () => {
  const initModules = [
    initMobileMenu,
    initStickyNavbar,
    initCounterAnimation,
    initHeroParallax,
    initButtonInteractions,
    initNavbarDropdowns,
    initAboutScrollReveal,
    initLeadershipScrollReveal,
    initCompaniesFiltering,
    initCompaniesScrollReveal,
    initCompanyModal,
    initServicesScrollReveal,
    initServiceCollectionModal,
    initDocumentViewerModal,
    initCredentialVaultOrbit,
    initVaultScrollReveal,
    initCareersJourney,
    initCareersScrollReveal,
    initBusinessOfficeSelector,
    initClipboardCopy,
    initContactFormValidation,
    initContactScrollReveal,
    initFooter
  ];

  initModules.forEach(fn => {
    if (typeof fn === 'function') {
      try {
        fn();
      } catch (err) {
        console.warn('Module init error:', fn.name, err);
      }
    }
  });
});

/**
 * 1. Mobile Menu Drawer Toggle (< 992px)
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const servicesToggle = document.getElementById('mobileServicesToggle');
  const servicesSubmenu = document.getElementById('mobileServicesSubmenu');

  if (!menuBtn || !drawer) return;

  function closeMobileDrawer() {
    drawer.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open navigation menu');
    menuBtn.classList.remove('is-active');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    
    // Reset services accordion state on drawer close
    if (servicesToggle && servicesSubmenu) {
      const parentItem = servicesToggle.closest('.mobile-dropdown-item');
      if (parentItem) parentItem.classList.remove('is-open');
      servicesToggle.setAttribute('aria-expanded', 'false');
      servicesSubmenu.setAttribute('aria-hidden', 'true');
      const badge = servicesToggle.querySelector('.mobile-toggle-badge');
      if (badge) badge.textContent = '+';
    }
  }

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = drawer.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', isOpen.toString());
    menuBtn.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    menuBtn.classList.toggle('is-active', isOpen);
    drawer.setAttribute('aria-hidden', (!isOpen).toString());
    document.body.classList.toggle('menu-open', isOpen);
  });

  // Mobile Services Accordion Toggle
  if (servicesToggle && servicesSubmenu) {
    servicesToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parentItem = servicesToggle.closest('.mobile-dropdown-item');
      if (!parentItem) return;

      const isSubmenuOpen = parentItem.classList.toggle('is-open');
      servicesToggle.setAttribute('aria-expanded', isSubmenuOpen.toString());
      servicesSubmenu.setAttribute('aria-hidden', (!isSubmenuOpen).toString());
      const badge = servicesToggle.querySelector('.mobile-toggle-badge');
      if (badge) {
        badge.textContent = isSubmenuOpen ? '−' : '+';
      }
    });
  }

  // Mobile Submenu service links click handler
  const subLinks = drawer.querySelectorAll('.mobile-sub-link');
  subLinks.forEach((subLink) => {
    subLink.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const serviceId = subLink.getAttribute('data-service-id') || subLink.getAttribute('href');
      
      // 1. Immediately close mobile submenu and reset toggle
      const parentItem = servicesToggle ? servicesToggle.closest('.mobile-dropdown-item') : null;
      if (parentItem) parentItem.classList.remove('is-open');
      if (servicesToggle) servicesToggle.setAttribute('aria-expanded', 'false');
      if (servicesSubmenu) servicesSubmenu.setAttribute('aria-hidden', 'true');
      const badge = servicesToggle ? servicesToggle.querySelector('.mobile-toggle-badge') : null;
      if (badge) badge.textContent = '+';

      // 2. Immediately close main mobile navigation drawer
      closeMobileDrawer();

      // 3. Remove any active focus/touch state
      if (document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
      }

      // 4. Smoothly scroll to target service without delays or overlays
      navigateToService(serviceId);
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('is-open') && !drawer.contains(e.target) && !menuBtn.contains(e.target)) {
      closeMobileDrawer();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeMobileDrawer();
    }
  });

  // Close mobile drawer when clicking regular mobile nav links
  const mobileLinks = drawer.querySelectorAll('.mobile-nav-link:not(.mobile-dropdown-toggle)');
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileDrawer();
    });
  });

  // Close mobile drawer if resized to desktop > 1060px
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1060 && drawer.classList.contains('is-open')) {
      closeMobileDrawer();
    }
  });

  window.closeMobileDrawer = closeMobileDrawer;
}

/**
 * 2. Sticky Navbar Scroll State & Active Nav Link Spy
 */
function initStickyNavbar() {
  const navbar = document.getElementById('mainNavbar');
  if (!navbar) return;

  const sections = document.querySelectorAll('section[id], main');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link[href^="#"]');

  function onScroll() {
    const scrollPos = window.scrollY;

    // Toggle elevated glassmorphic shadow & compact layout on scroll
    if (scrollPos > 30) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }

    // Active link highlighting on scroll
    let currentId = '';
    if (scrollPos < 200) {
      currentId = '#';
    } else {
      sections.forEach((sec) => {
        const top = sec.offsetTop - 130;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentId = '#' + sec.getAttribute('id');
        }
      });
    }

    if (currentId) {
      // Desktop nav links
      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if ((currentId === '#' && (href === '#' || href === '#home' || href === '')) || href === currentId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Mobile nav links
      mobileNavLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if ((currentId === '#' && (href === '#' || href === '#home' || href === '')) || href === currentId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  // Smooth scroll for navbar links with sticky offset
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      if (link.classList.contains('dropdown-toggle')) return;
      const href = link.getAttribute('href');
      if (!href) return;
      
      if (href === '#' || href === '#home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (href.startsWith('#')) {
        let target = document.querySelector(href);
        if (!target && href === '#companies') {
          target = document.getElementById('our-companies');
        }
        if (target) {
          e.preventDefault();
          const navHeight = 85;
          const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
          window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
      }
    });
  });

  // Smooth scroll for Hero Navigation Beacon Indicator
  const scrollIndicator = document.getElementById('scrollIndicator');
  if (scrollIndicator) {
    const beaconLink = scrollIndicator.querySelector('a');
    if (beaconLink) {
      beaconLink.addEventListener('click', (e) => {
        const href = beaconLink.getAttribute('href');
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            const navHeight = 75;
            const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
          }
        }
      });
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/**
 * 3. Animated Number Counters (Cubic Eased)
 */
function initCounterAnimation() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (!statNumbers.length) return;

  let animated = false;
  const statsContainer = document.getElementById('heroStats');

  function startCounters() {
    statNumbers.forEach((el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.textContent.includes('+') ? '+' : (el.textContent.includes('%') ? '%' : '');
      const duration = 1600; // ms
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.floor(easeProgress * target);

        el.textContent = currentCount + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = target + suffix;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  if ('IntersectionObserver' in window && statsContainer) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          startCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(statsContainer);
  } else {
    startCounters();
  }
}

/**
 * 4. Hero Visual Parallax & Interactive Glow Follower
 */
function initHeroParallax() {
  const heroSection = document.querySelector('.hero-main-section');
  const collageStage = document.getElementById('collageStage');
  const glowCircle = document.querySelector('.glow-top-right');

  if (!heroSection || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let ticking = false;

  heroSection.addEventListener('mousemove', (e) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const rect = heroSection.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        if (collageStage && window.innerWidth >= 992) {
          collageStage.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
        }

        if (glowCircle) {
          glowCircle.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
        }

        ticking = false;
      });
      ticking = true;
    }
  });

  heroSection.addEventListener('mouseleave', () => {
    if (collageStage) {
      collageStage.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
      collageStage.style.transition = 'transform 0.6s var(--ease-spring)';
      setTimeout(() => {
        collageStage.style.transition = '';
      }, 600);
    }
    if (glowCircle) {
      glowCircle.style.transform = 'translate(0px, 0px)';
      glowCircle.style.transition = 'transform 0.6s var(--ease-spring)';
      setTimeout(() => {
        glowCircle.style.transition = '';
      }, 600);
    }
  });
}

/**
 * 5. Button Micro-interactions
 */
function initButtonInteractions() {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach((btn) => {
    btn.addEventListener('mouseenter', function () {
      this.style.transition = 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });
}

/**
 * 6. Navbar Dropdowns Controller (e.g., Services 2-Column Mega Dropdown)
 */
function initNavbarDropdowns() {
  const dropdownParents = document.querySelectorAll('.nav-item.dropdown');

  dropdownParents.forEach((dropdown) => {
    const toggleBtn = dropdown.querySelector('.dropdown-toggle');
    const menu = dropdown.querySelector('.dropdown-menu');

    if (!toggleBtn || !menu) return;

    function closeThisDropdown() {
      dropdown.classList.remove('is-open', 'active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }

    function openThisDropdown() {
      dropdown.classList.remove('is-navigating');
      // Close other dropdowns first
      dropdownParents.forEach(d => {
        if (d !== dropdown) {
          d.classList.remove('is-open', 'active');
          const t = d.querySelector('.dropdown-toggle');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });

      dropdown.classList.add('is-open', 'active');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }

    // Toggle on click
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isOpen = dropdown.classList.contains('is-open') || dropdown.classList.contains('active');
      if (isOpen) {
        closeThisDropdown();
      } else {
        openThisDropdown();
      }
    });

    // Reset is-navigating flag on mouseenter/mouseleave
    dropdown.addEventListener('mouseenter', () => {
      dropdown.classList.remove('is-navigating');
    });

    dropdown.addEventListener('mouseleave', () => {
      dropdown.classList.remove('is-navigating');
    });

    // Keyboard accessibility on toggle button
    toggleBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isOpen = dropdown.classList.contains('is-open') || dropdown.classList.contains('active');
        if (isOpen) {
          closeThisDropdown();
        } else {
          openThisDropdown();
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        openThisDropdown();
        const firstItem = menu.querySelector('a, button, [tabindex="0"]');
        if (firstItem) firstItem.focus();
      }
    });

    // Dropdown items click & keyboard handling
    const serviceItems = menu.querySelectorAll('.dropdown-service-item, .dropdown-item');
    serviceItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const serviceId = item.getAttribute('data-service-id') || item.getAttribute('href');

        // 1. Force close this dropdown immediately and apply is-navigating
        dropdown.classList.add('is-navigating');
        dropdownParents.forEach(d => {
          d.classList.remove('is-open', 'active');
          const t = d.querySelector('.dropdown-toggle');
          if (t) t.setAttribute('aria-expanded', 'false');
        });

        // 2. Remove focus to prevent any sticky focus/hover ring
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
          document.activeElement.blur();
        }

        // 3. Smooth scroll to destination
        navigateToService(serviceId);

        // 4. Release is-navigating once scroll animation has finished
        setTimeout(() => {
          dropdown.classList.remove('is-navigating');
        }, 1200);
      });

      item.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = serviceItems[index + 1];
          if (next) next.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = serviceItems[index - 1];
          if (prev) {
            prev.focus();
          } else {
            toggleBtn.focus();
          }
        } else if (e.key === 'Escape') {
          closeThisDropdown();
          toggleBtn.focus();
        }
      });
    });
  });

  // Close all open dropdowns on outside click
  document.addEventListener('click', (e) => {
    dropdownParents.forEach(dropdown => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('is-open', 'active', 'is-navigating');
        const toggleBtn = dropdown.querySelector('.dropdown-toggle');
        if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close all open dropdowns on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdownParents.forEach(dropdown => {
        dropdown.classList.remove('is-open', 'active', 'is-navigating');
        const toggleBtn = dropdown.querySelector('.dropdown-toggle');
        if (toggleBtn) {
          toggleBtn.setAttribute('aria-expanded', 'false');
          toggleBtn.focus();
        }
      });
    }
  });
}

/**
 * Global Helper: Smoothly navigate/scroll to a service element with navbar offset
 * and apply a subtle temporary 1.4s blue highlight pulse.
 */
function navigateToService(serviceId) {
  if (!serviceId) return;

  // Clean string (e.g. "#service-janitorial" -> "service-janitorial")
  const cleanId = serviceId.replace(/^#/, '').trim();

  // 1. Check direct ID in DOM
  let targetEl = document.getElementById(cleanId);

  // 2. Check data-service-alias attribute
  if (!targetEl) {
    targetEl = document.querySelector(`[data-service-alias~="${cleanId}"]`);
  }

  // 3. Fallback map for aliases
  if (!targetEl) {
    const aliasMap = {
      'service-manpower': 'service-employment',
      'service-trading': 'contact',
      'service-online-trading': 'contact'
    };
    if (aliasMap[cleanId]) {
      targetEl = document.getElementById(aliasMap[cleanId]) || document.querySelector(`[data-service-alias~="${aliasMap[cleanId]}"]`);
    }
  }

  // 4. Ultimate fallback to services section
  if (!targetEl) {
    targetEl = document.getElementById('services');
  }

  if (!targetEl) return;

  // Calculate sticky navbar height offset (wrapper + top margin + padding)
  const navWrapper = document.querySelector('.navbar-wrapper');
  const navHeight = navWrapper ? navWrapper.getBoundingClientRect().height + 26 : 100;
  const targetRect = targetEl.getBoundingClientRect();
  const targetY = targetRect.top + window.pageYOffset - navHeight;

  // Smooth scroll to comfortable position
  window.scrollTo({
    top: Math.max(0, targetY),
    behavior: 'smooth'
  });

  // Trigger subtle temporary blue highlight pulse
  targetEl.classList.remove('service-highlight-pulse');
  // Trigger DOM reflow to restart CSS animation if already active
  void targetEl.offsetWidth;
  targetEl.classList.add('service-highlight-pulse');

  // Clean up pulse class after animation completion (1.4s)
  setTimeout(() => {
    targetEl.classList.remove('service-highlight-pulse');
  }, 1450);

  // Update URL hash smoothly without default jumping
  if (window.history && window.history.pushState) {
    window.history.pushState(null, '', '#' + cleanId);
  }
}

// Expose navigateToService globally
window.navigateToService = navigateToService;

/**
 * 7. Section 2 (About Us) Elegant Scroll Reveal System
 */
function initAboutScrollReveal() {
  const aboutSection = document.getElementById('about');
  if (!aboutSection) return;

  const intro = aboutSection.querySelector('.about-intro-group');
  const image = aboutSection.querySelector('.about-image-col');
  const details = aboutSection.querySelector('.about-details-group');

  const elements = [intro, image, details].filter(Boolean);
  if (!elements.length) return;

  let revealed = false;

  function revealAll() {
    if (revealed) return;
    revealed = true;
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('is-revealed');
      }, index * 120);
    });
  }

  // Trigger immediately if section is already in viewport on load/refresh
  const rect = aboutSection.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
    revealAll();
    return;
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealAll();
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });

    observer.observe(aboutSection);
  } else {
    revealAll();
  }
}

/**
 * 8. Section 3 (Our Group Companies) Interactive Filter System
 */
function initCompaniesFiltering() {
  const filterWrapper = document.querySelector('.companies-filter-wrapper');
  if (!filterWrapper) return;

  const filterButtons = filterWrapper.querySelectorAll('.filter-pill');
  const compactCards = document.querySelectorAll('.compact-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');

      // Update active state
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Filter compact cards
      compactCards.forEach(card => {
        const cardCategories = (card.getAttribute('data-category') || '').toLowerCase().split(' ');
        
        if (filterValue === 'all' || cardCategories.includes(filterValue.toLowerCase())) {
          card.classList.remove('is-filtered-out');
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px) scale(0.98)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 20);
        } else {
          card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.classList.add('is-filtered-out');
          }, 240);
        }
      });
    });
  });
}

/**
 * 9. Section 3 (Our Group Companies) Staggered Scroll Reveal System
 */
function initCompaniesScrollReveal() {
  const section = document.getElementById('our-companies') || document.getElementById('companies');
  if (!section) return;

  const revealElements = section.querySelectorAll('.companies-reveal');
  if (!revealElements.length) return;

  let revealed = false;

  function revealAll() {
    if (revealed) return;
    revealed = true;
    revealElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('is-revealed');
      }, index * 60);
    });
  }

  // Trigger immediately if already in viewport
  const rect = section.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
    revealAll();
    return;
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealAll();
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -40px 0px'
    });

    observer.observe(section);
  } else {
    revealAll();
  }
}



/**
 * 10. Exact 12 Group Companies Verified Data Registry & Modal Controller
 */
const GROUP_COMPANIES_DATA = {
  'ts-urban': {
    id: 'ts-urban',
    name: 'TS URBAN ALLIED SERVICES & ENTERPRISES (PRIVATE) LIMITED',
    category: 'Allied Services & Facility Management',
    badge: 'Flagship Group Entity',
    reference: 'Ref. No. 0340772',
    icon: 'facility',
    positioning: '“A GROUP OF COMPANIES DELIVERING EXCELLENCE ACROSS BORDERS”',
    intro: 'TS Urban Allied Services & Enterprises (Private) Limited serves as the premier flagship enterprise of the group, providing integrated facility management, specialized janitorial maintenance, security operations, manpower supply, and electro-mechanical engineering solutions across Pakistan and internationally.',
    services: [
      'Janitorial & Cleaning Services',
      'Security Services',
      'Manpower Supply',
      'Facility Management',
      'Waste Management',
      'Pest Control Services',
      'Gardening & Landscaping',
      'Electro-Mechanical Services'
    ],
    highlights: [
      { label: 'Registration Ref.', value: '0340772' },
      { label: 'Entity Status', value: 'Primary Group Entity' },
      { label: 'Operational Scope', value: 'Domestic & International Facility Care' }
    ]
  },
  'ts-travel': {
    id: 'ts-travel',
    name: 'TS TRAVEL AND TOURS & VISA CONSULTANT (PRIVATE) LIMITED',
    category: 'Travel, Tourism & Visa Facilitation',
    badge: 'Corporate Travel & Tours',
    reference: 'Corporate Unique ID: 0344506',
    icon: 'travel',
    positioning: '“Comprehensive Travel, Tourism & Visa Facilitation Services”',
    intro: 'A licensed travel and visa facilitation enterprise providing domestic and international air ticketing, corporate travel management, customized tour packages, hotel reservations, and official document authentication.',
    services: [
      'Air Ticketing — Domestic & International',
      'Tour Packages',
      'Visa Consultancy',
      'Hotel Reservations',
      'Umrah & Hajj Services',
      'Travel Insurance',
      'Corporate Travel Management',
      'Passport & Document Assistance'
    ],
    highlights: [
      { label: 'Corporate UID', value: '0344506' },
      { label: 'Core Services', value: 'Air Ticketing, Tour Packages & Visa Facilitation' }
    ]
  },
  'buraq-travel': {
    id: 'buraq-travel',
    name: 'BURAQ TRAVEL & TOURS INTERNATIONAL',
    category: 'Travel, Tourism & Visa Facilitation Services',
    badge: 'Tourism & Excursions',
    reference: 'Incorporation CUID: 0107143 (Buraq International Tours Operators (Pvt) Ltd)',
    icon: 'travel',
    positioning: '“Delivering Excellence in Travel, Tourism & Visa Facilitation Services with Trust and Professionalism.”',
    intro: 'Specialized international tourism and excursion management enterprise, delivering trusted travel bookings, personalized visa consultation, and seamless group and corporate travel solutions.',
    leadership: 'Col. Mulazim Hussain Tasnim (CEO)',
    services: [
      'International Travel Facilitation',
      'Tourism Management & Excursions',
      'Visa Consultation Services',
      'Group Tour Operations',
      'Ticket Reservation Assistance'
    ],
    highlights: [
      { label: 'Leadership', value: 'Col. Mulazim Hussain Tasnim (CEO)' },
      { label: 'Incorporation Ref.', value: 'Universal ID: 0107143' }
    ]
  },
  'concord': {
    id: 'concord',
    name: 'CONCORD OVERSEAS EMPLOYMENT',
    category: 'Overseas Employment & Manpower Recruitment',
    badge: 'Overseas Employment Promoter',
    icon: 'employment',
    positioning: '“Delivering Excellence in Overseas Employment & Manpower Recruitment Services with Trust and Professionalism.”',
    intro: 'An official Overseas Employment Promoter (OEP) specializing in ethical talent sourcing, candidate verification, and authorized workforce deployment across international partner markets.',
    leadership: 'Col. Mulazim Hussain Tasnim & Tanveer Saleem (Co-Partners)',
    authorizedRegions: 'Saudi Arabia, UAE, Malaysia, Europe, Tajikistan, Azerbaijan, Kyrgyzstan (Documented Authorization Scope)',
    services: [
      'Overseas Employment Promotion',
      'Global Manpower Recruitment',
      'Workforce Deployment Solutions',
      'Skilled & Technical Workforce Sourcing',
      'Candidate Screening & Mobilization',
      'International Compliance Support'
    ],
    highlights: [
      { label: 'Co-Partners', value: 'Col. Mulazim Hussain Tasnim & Tanveer Saleem' },
      { label: 'Official Status', value: 'Overseas Employment Promoter (OEP)' },
      { label: 'Documented Regions', value: 'Saudi Arabia, UAE, Malaysia, Europe, Tajikistan, Azerbaijan, Kyrgyzstan' }
    ]
  },
  'dolphin-shippers': {
    id: 'dolphin-shippers',
    name: 'DOLPHIN SHIPPERS (PVT) LTD',
    category: 'Shipping & Logistics',
    badge: 'IATA Accredited',
    icon: 'logistics',
    positioning: '“Packers, International Freight Forwarders, Customs Clearing Agents, Importer, Exporter, Consolidator, Transport Operations & Cranage Services”',
    intro: 'A recognized logistics and freight management company providing air, sea, and land cargo solutions, packing, customs clearance, and heavy transport cranage operations.',
    accreditation: 'IATA Accredited — Meets the professional standards of the International Air Transport Association for international air cargo transportation (Validity: 2026).',
    services: [
      'Packing & Consolidation',
      'International Freight Forwarding',
      'Customs Clearing Agents',
      'Import Operations',
      'Export Operations',
      'Consolidator Services',
      'Transport Operations',
      'Cranage Services'
    ],
    highlights: [
      { label: 'Accreditation', value: 'IATA Accredited (Validity: 2026)' },
      { label: 'Industry Scope', value: 'Freight Forwarding, Customs Clearing & Cranage' }
    ]
  },
  'alamdar-security': {
    id: 'alamdar-security',
    name: 'ALAMDAR SECURITY (PVT) LTD',
    category: 'Private Security Services',
    badge: 'Manned Guarding',
    icon: 'security',
    positioning: '“Professional Security Solutions”',
    intro: 'Delivering professional security solutions, trained security personnel, and guarding services with integrity, discipline and vigilance.',
    services: [
      'Professional Security Solutions',
      'Trained Security Personnel',
      'Guarding & Protection Services',
      'Commercial & Residential Premises Safety'
    ],
    highlights: [
      { label: 'Core Mission', value: 'Professional Security Solutions' },
      { label: 'Personnel', value: 'Trained Security Personnel & Guarding' }
    ]
  },
  'fajar-janitorial': {
    id: 'fajar-janitorial',
    name: 'FAJAR JANITORIAL SERVICES (PVT) LTD',
    category: 'Janitorial & Facility Management',
    badge: 'Facility & Hygiene',
    icon: 'janitorial',
    positioning: '“We Don\'t Just Clean, We Care!”',
    intro: 'Comprehensive cleaning and facility management enterprise operating out of Islamabad, delivering total hygiene solutions, verified manpower, security, and waste management.',
    location: 'Koral Chowk, Islamabad',
    services: [
      '1. Cleaning & Janitorial Services — Daily cleaning, dusting, mopping, vacuuming & complete hygiene maintenance',
      '2. Manpower Supply — Skilled, semi-skilled and unskilled staff for business needs',
      '3. Security Services — Trained security personnel for safety and peace of mind',
      '4. Facility Management — Complete facility management solutions under one roof',
      '5. Waste Management — Proper waste collection, segregation and disposal',
      '6. Specialized Services — Floor care, carpet cleaning, window cleaning & specialized solutions'
    ],
    whyChoose: [
      'Trained & Verified Staff',
      'Quality Assurance',
      'On Time Service',
      'Modern Equipment',
      'Customer Satisfaction',
      'Trusted by Leading Clients'
    ],
    highlights: [
      { label: 'Office Location', value: 'Koral Chowk, Islamabad' },
      { label: 'Tagline', value: '“We Don\'t Just Clean, We Care!”' }
    ]
  },
  'niazi-rozgar': {
    id: 'niazi-rozgar',
    name: 'NIAZI ROZGAR (PVT) LTD',
    category: 'Employment & Manpower Solutions',
    badge: 'Talent & Recruitment',
    icon: 'employment',
    positioning: '“BRIDGING TALENT, CREATING OPPORTUNITIES”',
    intro: 'Empowering people through meaningful employment and reliable manpower solutions worldwide. Connecting skilled candidates with international business opportunities through streamlined recruitment and documentation.',
    leadership: 'Rafique Ahmad Khan Niazi (CEO)',
    coreMotto: '“Right People, Right Jobs, Better Futures.” — Trusted, Experienced, Reliable, Success.',
    services: [
      'Overseas Employment — Connecting skilled and unskilled workers with global opportunities',
      'Recruitment Solutions — End-to-end recruitment services tailored to needs',
      'Manpower Supply — Providing reliable and efficient manpower solutions worldwide',
      'Career Consultancy — Guidance and support for a better career tomorrow',
      'Visa & Documentation — Hassle-free visa processing and documentation support'
    ],
    highlights: [
      { label: 'Leadership', value: 'Rafique Ahmad Khan Niazi (CEO)' },
      { label: 'Guiding Principle', value: '“Right People, Right Jobs, Better Futures”' }
    ]
  },
  'leon-security': {
    id: 'leon-security',
    name: 'LEON SECURITY SERVICES (PVT) LIMITED',
    category: 'Security Services',
    badge: 'Licensed & Verified',
    icon: 'security',
    positioning: '“SAFEGUARDING WHAT MATTERS MOST”',
    intro: 'Delivering professional security solutions with integrity, vigilance and excellence. Providing manned guarding, advanced CCTV monitoring, access management, and security risk assessment.',
    leadership: 'Usman Khalid (CEO)',
    compliance: 'Official Government Security Licensing & NOC Verified documentation on record.',
    services: [
      'Manned Guarding — Trained & Professional Security Guards',
      'Surveillance Systems — Advanced CCTV Monitoring Solutions',
      'Access Control — Smart & Reliable Access Management',
      'Mobile Patrol — Regular Patrols for Maximum Safety',
      'Event Security — Safe & Secure Events Management',
      'Risk Assessment — Identify Risks, Ensure Safety'
    ],
    highlights: [
      { label: 'Leadership', value: 'Usman Khalid (CEO)' },
      { label: 'Official Compliance', value: 'Security Licensing & Government NOC Verified' }
    ]
  },
  'zoha-apparel': {
    id: 'zoha-apparel',
    name: 'ZOHA APPAREL (PVT) LTD',
    category: 'Uniform Manufacturing & Corporate Apparel',
    badge: 'Apparel Manufacturer',
    icon: 'apparel',
    positioning: '“Premium Uniform Manufacturers & Corporate Apparel Solutions”',
    intro: 'Creating Quality, Stitching Excellence. Specialized uniform manufacturer providing high-grade customized apparel, corporate attire, and industrial workwear with full in-house automated production.',
    products: [
      'Security Guard Uniforms',
      'Polo Shirts',
      'Cargo Pants',
      'Corporate Uniforms',
      'School Uniforms',
      'Hospital Uniforms',
      'Industrial Workwear',
      'Customized Uniform Solutions'
    ],
    manufacturing: [
      'Automatic Cutting Machine',
      'Industrial Sewing Machines',
      'Overlock / Safety Stitch',
      'Button Attach Machine',
      'Embroidery Machine',
      'Steam Ironing & Finishing Table'
    ],
    qualityControl: [
      'Premium Quality Fabrics',
      'In-house Quality Checks',
      'Skilled Quality Inspection',
      'Final Quality Assurance'
    ],
    whyChoose: [
      'Premium Quality Products',
      'Customized Designs',
      'Competitive Prices',
      'Timely Delivery',
      'Experienced & Skilled Team',
      'Customer Satisfaction Guaranteed',
      'After Sales Support'
    ],
    clientSectors: [
      'Corporate Offices',
      'Security Companies',
      'Schools & Colleges',
      'Hospitals & Clinics',
      'Industrial Areas & Factories',
      'Hotels & Restaurants',
      'Event Management',
      'NGOs & Organizations'
    ],
    highlights: [
      { label: 'Tagline', value: '“Creating Quality, Stitching Excellence”' },
      { label: 'Manufacturing', value: 'Automated Cutting, Industrial Sewing & Embroidery' }
    ]
  },
  'ts-usa': {
    id: 'ts-usa',
    name: 'TS URBAN ALLIED SERVICES LLC — TEXAS, USA',
    category: 'Allied Services & Facility Solutions',
    badge: 'United States Entity',
    icon: 'global',
    location: 'Texas, USA',
    positioning: '“Delivering Allied Services & Facility Solutions in the United States”',
    intro: 'The US-based operational entity of Supreme Group of Companies, providing allied facility solutions, building maintenance, janitorial operations, and support services in Texas and surrounding regions.',
    services: [
      'Janitorial & Cleaning Services',
      'Building Maintenance',
      'Security Solutions',
      'Facility Management',
      'Waste Management',
      'Manpower Supply'
    ],
    highlights: [
      { label: 'Jurisdiction', value: 'Texas, USA' },
      { label: 'Scope', value: 'Facility Solutions & Allied Operations' }
    ]
  },
  'ts-uk': {
    id: 'ts-uk',
    name: 'TS URBAN ALLIED SERVICE & ENTERPRISES LTD — UK',
    category: 'Allied Services & Enterprise Solutions',
    badge: 'United Kingdom Entity',
    icon: 'global',
    location: 'United Kingdom',
    positioning: '“Delivering Allied Services & Enterprise Solutions in the United Kingdom”',
    intro: 'The United Kingdom operational entity of Supreme Group of Companies, delivering enterprise facility management, commercial cleaning, security solutions, and building maintenance across the UK.',
    services: [
      'Facility Management',
      'Cleaning Services',
      'Security Services',
      'Manpower Solutions',
      'Building Maintenance',
      'Support Services'
    ],
    highlights: [
      { label: 'Jurisdiction', value: 'United Kingdom' },
      { label: 'Scope', value: 'Enterprise Solutions & Facility Management' }
    ]
  }
};

/**
 * Helper to get Category SVGs (All Blue Palette)
 */
function getCompanyIconSvg(iconType) {
  switch (iconType) {
    case 'facility':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
    case 'travel':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`;
    case 'employment':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>`;
    case 'logistics':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`;
    case 'security':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`;
    case 'janitorial':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
    case 'apparel':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>`;
    case 'global':
    default:
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
  }
}

/**
 * 11. Interactive Company Modal Controller (Open, Render, Close, Scroll-Lock)
 */
function initCompanyModal() {
  const backdrop = document.getElementById('companyModalBackdrop');
  const dialog = document.getElementById('companyModalDialog');
  const contentSlot = document.getElementById('modalContentSlot');
  const closeBtn = document.getElementById('modalCloseBtn');
  const exploreButtons = document.querySelectorAll('.explore-modal-btn');

  if (!backdrop || !dialog || !contentSlot) return;

  let lastActiveTrigger = null;

  function renderModalContent(company) {
    const iconSvg = getCompanyIconSvg(company.icon);

    let html = `
      <div class="modal-header-hero">
        <div class="modal-icon-badge" aria-hidden="true">
          ${iconSvg}
        </div>
        <div class="modal-title-wrap">
          <div class="modal-tag-row">
            <span class="modal-cat-tag">${company.category}</span>
            ${company.badge ? `<span class="modal-ref-tag">${company.badge}</span>` : ''}
            ${company.reference ? `<span class="modal-ref-tag">${company.reference}</span>` : ''}
          </div>
          <h3 class="modal-company-title" id="modalCompanyName">${company.name}</h3>
          ${company.positioning ? `<p class="modal-positioning-quote">${company.positioning}</p>` : ''}
        </div>
      </div>

      <div class="modal-body-layout">
        <!-- Introduction -->
        <div class="modal-section">
          <div class="modal-section-title">Company Overview</div>
          <p class="modal-intro-text">${company.intro}</p>
        </div>
    `;

    // Services
    if (company.services && company.services.length) {
      html += `
        <div class="modal-section">
          <div class="modal-section-title">Key Services &amp; Capabilities</div>
          <div class="modal-services-grid">
            ${company.services.map(s => `
              <div class="modal-service-item">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 8l3 3 7-7"/>
                </svg>
                <span>${s}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Products (for Zoha Apparel)
    if (company.products && company.products.length) {
      html += `
        <div class="modal-section">
          <div class="modal-section-title">Product Portfolio</div>
          <div class="modal-services-grid">
            ${company.products.map(p => `
              <div class="modal-service-item">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="8" cy="8" r="4" fill="currentColor"/>
                </svg>
                <span>${p}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Manufacturing & Quality (for Zoha Apparel)
    if (company.manufacturing && company.manufacturing.length) {
      html += `
        <div class="modal-section">
          <div class="modal-section-title">Manufacturing Infrastructure &amp; Quality Control</div>
          <div class="modal-highlights-grid">
            <div class="modal-highlight-card">
              <span class="modal-highlight-label">Equipment Capabilities</span>
              <p class="modal-highlight-val">${company.manufacturing.join(' • ')}</p>
            </div>
            <div class="modal-highlight-card">
              <span class="modal-highlight-label">Quality Assurance</span>
              <p class="modal-highlight-val">${company.qualityControl.join(' • ')}</p>
            </div>
          </div>
        </div>
      `;
    }

    // Why Choose (Fajar or Zoha)
    if (company.whyChoose && company.whyChoose.length) {
      html += `
        <div class="modal-section">
          <div class="modal-section-title">Why Choose ${company.name.split('(')[0].trim()}</div>
          <div class="modal-services-grid">
            ${company.whyChoose.map(w => `
              <div class="modal-service-item">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                <span>${w}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Leadership, Accreditation, Location & Highlights
    const metaCards = [];
    if (company.leadership) {
      metaCards.push({ label: 'Leadership', value: company.leadership });
    }
    if (company.accreditation) {
      metaCards.push({ label: 'Official Accreditation', value: company.accreditation });
    }
    if (company.compliance) {
      metaCards.push({ label: 'Regulatory Compliance', value: company.compliance });
    }
    if (company.authorizedRegions) {
      metaCards.push({ label: 'Authorized Regions', value: company.authorizedRegions });
    }
    if (company.location) {
      metaCards.push({ label: 'Office Location', value: company.location });
    }
    if (company.highlights && company.highlights.length) {
      company.highlights.forEach(h => {
        // avoid duplicating if already in metaCards
        if (!metaCards.some(m => m.label === h.label)) {
          metaCards.push(h);
        }
      });
    }

    if (metaCards.length) {
      html += `
        <div class="modal-section">
          <div class="modal-section-title">Key Information &amp; Verification</div>
          <div class="modal-highlights-grid">
            ${metaCards.map(m => `
              <div class="modal-highlight-card">
                <span class="modal-highlight-label">${m.label}</span>
                <p class="modal-highlight-val">${m.value}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Action Bar
    html += `
        <div class="modal-action-bar">
          <span class="modal-footer-note">Part of Supreme Group of Companies Ecosystem</span>
          <a href="#contact" class="modal-inquire-btn" id="modalInquireBtn">
            <span>Contact This Entity</span>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;">
              <path d="M3 8h10M9 4l4 4-4 4"/>
            </svg>
          </a>
        </div>
      </div>
    `;

    contentSlot.innerHTML = html;

    // Attach listener to Contact Entity button to close modal and scroll smoothly
    const inquireBtn = contentSlot.querySelector('#modalInquireBtn');
    if (inquireBtn) {
      inquireBtn.addEventListener('click', () => {
        closeModal();
      });
    }
  }

  function openModal(companyId, triggerElement) {
    const company = GROUP_COMPANIES_DATA[companyId];
    if (!company) return;

    lastActiveTrigger = triggerElement || null;
    renderModalContent(company);

    backdrop.classList.add('is-open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Set focus to close button
    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 80);
    }
  }

  function closeModal() {
    if (!backdrop.classList.contains('is-open')) return;

    backdrop.classList.remove('is-open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (lastActiveTrigger && typeof lastActiveTrigger.focus === 'function') {
      lastActiveTrigger.focus();
    }
  }

  // Explore button triggers
  exploreButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const companyId = btn.getAttribute('data-company');
      openModal(companyId, btn);
    });
  });

  // Card-level triggers for full accessibility & ease of interaction
  const companyCards = document.querySelectorAll('.compact-card');
  companyCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const companyId = card.getAttribute('data-company-id');
      const btn = card.querySelector('.explore-modal-btn');
      openModal(companyId, btn || card);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const companyId = card.getAttribute('data-company-id');
        const btn = card.querySelector('.explore-modal-btn');
        openModal(companyId, btn || card);
      }
    });
  });

  // Close button trigger
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });
  }

  // Backdrop outside click
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });

  // Escape key trigger
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Expose global openCompanyModal helper
  window.openCompanyModal = openModal;
}

/**
 * 12. Verified Service Collections Data Registry (7 Main Collections)
 * Strictly sourced from official group portfolio documentation
 */
const SERVICE_COLLECTIONS_DATA = {
  'facility-allied': {
    id: 'facility-allied',
    number: '01',
    category: 'Facility & Allied Services',
    title: 'Facility & Allied Services',
    quote: '“Comprehensive facility solutions designed to support clean, safe and efficiently managed environments.”',
    providers: ['TS Urban Allied Services & Enterprises (Pvt) Ltd', 'Fajar Janitorial Services (Pvt) Ltd'],
    count: '08 Services',
    services: [
      {
        num: '01',
        title: 'Janitorial & Cleaning Services',
        desc: 'Professional corporate janitorial maintenance, deep cleaning, and daily hygiene programs.'
      },
      {
        num: '02',
        title: 'Security Services',
        desc: 'Trained manned security guards, asset protection, and perimeter surveillance systems.'
      },
      {
        num: '03',
        title: 'Manpower Supply',
        desc: 'Skilled, semi-skilled, and technical workforce deployment for diverse industrial projects.'
      },
      {
        num: '04',
        title: 'Facility Management',
        desc: 'Comprehensive single-point facility operations, maintenance, and environmental governance.'
      },
      {
        num: '05',
        title: 'Waste Management',
        desc: 'Eco-compliant commercial waste disposal, collection routines, and sanitation management.'
      },
      {
        num: '06',
        title: 'Pest Control',
        desc: 'Targeted fumigation, insect elimination, and scheduled preventive pest treatments.'
      },
      {
        num: '07',
        title: 'Gardening & Landscaping',
        desc: 'Commercial groundskeeping, lawn care, landscape design, and horticulture maintenance.'
      },
      {
        num: '08',
        title: 'Electro-Mechanical Services',
        desc: 'Electrical repairs, HVAC system maintenance, generators, and plumbing infrastructure.'
      }
    ]
  },

  'travel-tourism': {
    id: 'travel-tourism',
    number: '02',
    category: 'Travel & Tourism',
    title: 'Travel, Tourism & Visa Facilitation',
    quote: '“Complete corporate travel management, customized leisure excursions, and global visa advisory.”',
    providers: ['TS Travel & Tours & Visa Consultant (Pvt) Ltd', 'Buraq Travel & Tours International'],
    count: '10 Services',
    services: [
      {
        num: '01',
        title: 'Air Ticketing — Domestic & International',
        desc: 'Real-time domestic and global airline ticketing across premier carriers with best fares.'
      },
      {
        num: '02',
        title: 'Tour Packages',
        desc: 'Customized international and domestic leisure excursions, guided tours, and family holidays.'
      },
      {
        num: '03',
        title: 'Visa Consultancy',
        desc: 'Comprehensive tourist, business, study, and family visa application processing and embassy guidance.'
      },
      {
        num: '04',
        title: 'Hotel Reservations',
        desc: 'Worldwide accommodations from luxury business hotels to budget suites at preferred corporate rates.'
      },
      {
        num: '05',
        title: 'Umrah & Hajj Services',
        desc: 'Dedicated pilgrimage itineraries, visa processing, direct flights, and Makkah/Madinah hospitality.'
      },
      {
        num: '06',
        title: 'Travel Insurance',
        desc: 'Schengen & international coverage for medical emergencies, cancellations, and lost baggage.'
      },
      {
        num: '07',
        title: 'Corporate Travel Management',
        desc: 'Strategic business travel coordination, executive itineraries, and corporate billing accounts.'
      },
      {
        num: '08',
        title: 'Passport & Document Assistance',
        desc: 'Official documentation verification, MOFA attestations, and embassy appointment scheduling.'
      },
      {
        num: '09',
        title: 'Travel & Tourism Services',
        desc: 'Turnkey leisure and commercial travel services across leading destinations worldwide.'
      },
      {
        num: '10',
        title: 'Visa Facilitation Services',
        desc: 'Full documentation, translation, and biometric submission facilitation.'
      }
    ]
  },

  'employment-manpower': {
    id: 'employment-manpower',
    number: '03',
    category: 'Employment & Manpower',
    title: 'Workforce and Overseas Employment Solutions',
    quote: '“Connecting skilled and unskilled workers with verified global opportunities.”',
    providers: ['Concord Overseas Employment (OEP Lic. 3160/RWP)', 'Niazi Rozgar (Pvt) Ltd'],
    count: '06 Services',
    services: [
      {
        num: '01',
        title: 'Overseas Employment',
        desc: 'Connecting skilled and unskilled workers with global opportunities.'
      },
      {
        num: '02',
        title: 'Overseas Manpower Recruitment',
        desc: 'Government-licensed recruitment campaigns across GCC and international markets.'
      },
      {
        num: '03',
        title: 'Recruitment Solutions',
        desc: 'End-to-end recruitment services tailored to employer needs.'
      },
      {
        num: '04',
        title: 'Manpower Supply',
        desc: 'Reliable and efficient manpower solutions worldwide.'
      },
      {
        num: '05',
        title: 'Career Consultancy',
        desc: 'Guidance and support for better career opportunities.'
      },
      {
        num: '06',
        title: 'Visa & Documentation',
        desc: 'Visa processing and documentation support.'
      }
    ]
  },

  'security-solutions': {
    id: 'security-solutions',
    number: '04',
    category: 'Security Solutions',
    title: 'Professional Protection & Security Solutions',
    quote: '“Disciplined manned guarding, advanced CCTV surveillance, and specialized threat assessments.”',
    providers: ['Alamdar Security Services (Pvt) Ltd', 'Leon Security (Private) Limited'],
    count: '09 Services',
    services: [
      {
        num: '01',
        title: 'Professional Security Solutions',
        desc: 'Professional security solutions delivered with integrity and discipline (Alamdar Security).'
      },
      {
        num: '02',
        title: 'Trained Security Personnel',
        desc: 'Rigorously vetted, disciplined armed and unarmed security personnel (Alamdar Security).'
      },
      {
        num: '03',
        title: 'Guarding Services',
        desc: 'Static site defense, entry checkpoint screening, and perimeter protection (Alamdar Security).'
      },
      {
        num: '04',
        title: 'Manned Guarding',
        desc: 'Trained & Professional Security Guards (Leon Security).'
      },
      {
        num: '05',
        title: 'Surveillance Systems',
        desc: 'Advanced CCTV Monitoring Solutions (Leon Security).'
      },
      {
        num: '06',
        title: 'Access Control',
        desc: 'Smart & Reliable Access Management (Leon Security).'
      },
      {
        num: '07',
        title: 'Mobile Patrol',
        desc: 'Regular Patrols for Maximum Safety (Leon Security).'
      },
      {
        num: '08',
        title: 'Event Security',
        desc: 'Safe & Secure Events Management (Leon Security).'
      },
      {
        num: '09',
        title: 'Risk Assessment',
        desc: 'Identify Risks, Ensure Safety (Leon Security).'
      }
    ]
  },

  'logistics-shipping': {
    id: 'logistics-shipping',
    number: '05',
    category: 'Logistics & Shipping',
    title: 'Freight, Customs and Transport Solutions',
    quote: '“IATA accredited cargo handling, freight forwarding, customs clearance, transport and cranage operations.”',
    providers: ['Dolphin Shippers (Pvt) Ltd (IATA Accredited)'],
    count: '08 Services',
    trustBadge: 'IATA Accredited',
    services: [
      {
        num: '01',
        title: 'Packers',
        desc: 'Professional commercial packing, cargo securing, and specialized export packaging services.'
      },
      {
        num: '02',
        title: 'International Freight Forwarders',
        desc: 'Global air cargo and international freight forwarding across documented trade corridors.'
      },
      {
        num: '03',
        title: 'Customs Clearing Agents',
        desc: 'Authorized customs clearance facilitation, port documentation, and regulatory agency processing.'
      },
      {
        num: '04',
        title: 'Importer Operations',
        desc: 'Commercial import clearance, consignment logistics, and delivery coordination.'
      },
      {
        num: '05',
        title: 'Exporter Operations',
        desc: 'Export documentation management, freight booking, and international cargo dispatch.'
      },
      {
        num: '06',
        title: 'Consolidator Services',
        desc: 'Cargo consolidation, grouped freight logistics, and distribution management.'
      },
      {
        num: '07',
        title: 'Transport Operations',
        desc: 'Domestic logistics transport, cargo movement, and commercial vehicle fleet operations.'
      },
      {
        num: '08',
        title: 'Cranage Services',
        desc: 'Heavy lift cranage operations, industrial loading, and specialized equipment handling.'
      }
    ]
  },

  'janitorial-support': {
    id: 'janitorial-support',
    number: '06',
    category: 'Janitorial & Support',
    title: 'Cleaning, Staffing and Support Solutions',
    quote: '“Premium hygiene standards delivered with hospital-grade equipment and vetted professionals.”',
    providers: ['Fajar Janitorial Services (Pvt) Ltd'],
    count: '18+ Services',
    services: [
      {
        num: '01',
        title: 'Cleaning & Janitorial Services',
        desc: 'Daily scheduled commercial office cleaning, deep sanitization, and restroom upkeep.'
      },
      {
        num: '02',
        title: 'Manpower Supply',
        desc: 'Skilled janitorial crews, utility assistants, and facility support manpower.'
      },
      {
        num: '03',
        title: 'Security Services',
        desc: 'Static guarding, access monitoring, and round-the-clock site protection.'
      },
      {
        num: '04',
        title: 'Facility Management',
        desc: 'Total building operations, hygiene governance, and maintenance coordination.'
      },
      {
        num: '05',
        title: 'Waste Management',
        desc: 'Commercial solid waste collection, sorting, and municipal disposal routines.'
      },
      {
        num: '06',
        title: 'Specialized Services',
        desc: 'Specialized corporate cleaning, chemical sanitization, and deep maintenance.'
      },
      {
        num: '07',
        title: 'Floor Care',
        desc: 'Marble crystallization, terrazzo resurfacing, tile scrubbing, and anti-slip treatments.'
      },
      {
        num: '08',
        title: 'Carpet Cleaning',
        desc: 'Hot-water extraction carpet shampooing, spot stain removal, and sofa renewal.'
      },
      {
        num: '09',
        title: 'Window Cleaning',
        desc: 'High-rise glass facade rope-access cleaning and internal partition washing.'
      },
      {
        num: '10',
        title: 'HR & Manpower Providing Services',
        desc: 'Structured workforce sourcing, background verification, and personnel deployment.'
      },
      {
        num: '11',
        title: 'Uniform Stitching & Uniform Supply Services',
        desc: 'Corporate, industrial, and housekeeping uniform production and supply.'
      },
      {
        num: '12',
        title: 'Event Support & Management Services',
        desc: 'Pre-event setup, continuous venue sanitation, crowd marshaling, and turnaround.'
      },
      {
        num: '13',
        title: 'Maid & Domestic Support Staff',
        desc: 'Vetted domestic maids, housekeepers, and residential attendants.'
      },
      {
        num: '14',
        title: 'Housekeeping Services',
        desc: 'Comprehensive institutional housekeeping and workplace hygiene management.'
      },
      {
        num: '15',
        title: 'Cooks & Kitchen Staff',
        desc: 'Verified culinary staff, corporate kitchen cooks, and pantry assistants.'
      },
      {
        num: '16',
        title: 'Drivers & Transport Staff',
        desc: 'Experienced commercial and executive transport chauffeurs.'
      },
      {
        num: '17',
        title: 'Office & General Support Staff',
        desc: 'Office boys, messenger staff, document runners, and administrative assistants.'
      },
      {
        num: '18',
        title: 'Facility Management Services',
        desc: 'Integrated building operations, MEP maintenance, and facility oversight.'
      }
    ]
  },

  'apparel-uniforms': {
    id: 'apparel-uniforms',
    number: '07',
    category: 'Apparel & Uniforms',
    title: 'Corporate and Professional Apparel Solutions',
    quote: '“Premium Uniform Manufacturers & Corporate Apparel Solutions”',
    providers: ['Zoha Apparel (Pvt) Ltd'],
    count: '08 Services',
    services: [
      {
        num: '01',
        title: 'Security Guard Uniforms',
        desc: 'Professional security attire, heavy-duty uniform shirts, trousers, badges, and accessories.'
      },
      {
        num: '02',
        title: 'Polo Shirts',
        desc: 'Knitted polo shirts and corporate casuals with custom logo embroidery.'
      },
      {
        num: '03',
        title: 'Cargo Pants',
        desc: 'Multi-pocket utilitarian cargo trousers with durable stitching and reinforced construction.'
      },
      {
        num: '04',
        title: 'Corporate Uniforms',
        desc: 'Tailored executive attire, corporate blazers, trousers, and professional suiting.'
      },
      {
        num: '05',
        title: 'School Uniforms',
        desc: 'Institutional school apparel including shirts, blazers, skirts, trousers, and sports sets.'
      },
      {
        num: '06',
        title: 'Hospital Uniforms',
        desc: 'Medical healthcare scrubs, laboratory coats, patient gowns, and institutional linens.'
      },
      {
        num: '07',
        title: 'Industrial Workwear',
        desc: 'Industrial workwear, protective boiler suits, safety jackets, and durable utility overalls.'
      },
      {
        num: '08',
        title: 'Customized Uniform Solutions',
        desc: 'Custom garment pattern design, tailored sizing, specialized stitching, and embroidery.'
      }
    ]
  }
};

/**
 * 13. Section 4 (Our Services) Staggered Scroll Reveal System
 */
function initServicesScrollReveal() {
  const section = document.getElementById('services');
  if (!section) return;

  const revealElements = section.querySelectorAll('.services-reveal');
  if (!revealElements.length) return;

  let revealed = false;

  function revealAll() {
    if (revealed) return;
    revealed = true;
    revealElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('is-revealed');
      }, index * 40);
    });
  }

  // Trigger immediately if already in viewport
  const rect = section.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
    revealAll();
    return;
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealAll();
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -40px 0px'
    });

    observer.observe(section);
  } else {
    revealAll();
  }
}

/**
 * 14. Service Collection Details Modal Controller & Render System
 */
function initServiceCollectionModal() {
  const backdrop = document.getElementById('serviceModalBackdrop');
  const dialog = document.getElementById('serviceModalDialog');
  const contentSlot = document.getElementById('serviceModalContentSlot');
  const closeBtn = document.getElementById('serviceModalCloseBtn');
  const collectionRows = document.querySelectorAll('.service-collection-row');

  if (!backdrop || !dialog || !contentSlot) return;

  let lastActiveTrigger = null;

  function renderCollectionModal(collection) {
    let html = `
      <div class="sc-modal-header">
        <div class="sc-modal-icon-badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2"/>
            <polyline points="2 17 12 22 22 17"/>
            <polyline points="2 12 12 17 22 12"/>
          </svg>
        </div>
        <div class="sc-modal-title-wrap">
          <div class="sc-modal-tag-row">
            <span class="sc-modal-collection-num">COLLECTION ${collection.number}</span>
            <span class="sc-modal-count-tag">${collection.count}</span>
            ${collection.trustBadge ? `<span class="sc-modal-count-tag" style="background:#1459D9; color:#fff; border-color:#1459D9;">${collection.trustBadge}</span>` : ''}
          </div>
          <h3 class="sc-modal-title" id="modalServiceName">${collection.title}</h3>
          ${collection.quote ? `<p class="sc-modal-quote">${collection.quote}</p>` : ''}
        </div>
      </div>

      <div class="sc-modal-body">
        <!-- Provided By Group Companies -->
        <div class="sc-modal-providers-bar">
          <span class="sc-modal-prov-label">Delivered by:</span>
          ${collection.providers.map(p => `<span class="sc-modal-prov-tag">${p}</span>`).join('')}
        </div>

        <!-- Global Hubs (For Global Services) -->
        ${collection.globalHubs ? `
          <div class="sc-modal-providers-bar" style="background: #EAF4FF; border-color: rgba(20, 89, 217, 0.16);">
            <span class="sc-modal-prov-label">Operating Territories:</span>
            ${collection.globalHubs.map(h => `<span class="sc-modal-prov-tag" style="font-weight: 800; color: #1459D9;">${h}</span>`).join('')}
          </div>
        ` : ''}

        <!-- Service Directory -->
        <div>
          <div class="sc-modal-section-title">Complete Service Directory (${collection.count})</div>
          <div class="sc-modal-services-grid">
            ${collection.services.map(svc => `
              <div class="sc-modal-service-card">
                <span class="sc-modal-svc-num">${svc.num}</span>
                <div class="sc-modal-svc-content">
                  <h4 class="sc-modal-svc-name">${svc.title}</h4>
                  <p class="sc-modal-svc-desc">${svc.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Manufacturing Capabilities (Secondary Area for Apparel) -->
        ${collection.manufacturing ? `
          <div>
            <div class="sc-modal-section-title">In-House Manufacturing Capabilities</div>
            <div class="sc-modal-secondary-grid">
              ${collection.manufacturing.map(m => `
                <div class="sc-modal-secondary-item">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="8" cy="8" r="6"/>
                    <polyline points="8 5 8 8 10 10"/>
                  </svg>
                  <span>${m}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Quality Processes (Secondary Area for Apparel) -->
        ${collection.quality ? `
          <div>
            <div class="sc-modal-section-title">Quality Control &amp; Value Addition</div>
            <div class="sc-modal-secondary-grid">
              ${collection.quality.map(q => `
                <div class="sc-modal-secondary-item">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 8l3 3 7-7"/>
                  </svg>
                  <span>${q}</span>
                </div>
              `).join('')}
              ${collection.valueAdds ? collection.valueAdds.map(v => `
                <div class="sc-modal-secondary-item" style="border-color: rgba(20, 89, 217, 0.2); background: #F0F6FC;">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="8 2 10 6 14 6.5 11 9.5 12 14 8 11.5 4 14 5 9.5 2 6.5 6 6 8 2"/>
                  </svg>
                  <span>${v}</span>
                </div>
              `).join('') : ''}
            </div>
          </div>
        ` : ''}

        <!-- Action Bar -->
        <div class="sc-modal-action-bar">
          <span style="font-size: 13px; color: #5E6C84; font-weight: 500;">Inquire regarding specialized services from this collection:</span>
          <a href="#contact" class="sc-modal-inquire-btn" id="modalInquireBtn">
            <span>Inquire About Services</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    `;

    contentSlot.innerHTML = html;

    const inquireBtn = contentSlot.querySelector('#modalInquireBtn');
    if (inquireBtn) {
      inquireBtn.addEventListener('click', () => {
        closeModal();
      });
    }
  }

  function openModal(collectionId, triggerEl) {
    const collection = SERVICE_COLLECTIONS_DATA[collectionId];
    if (!collection) return;

    lastActiveTrigger = triggerEl;
    renderCollectionModal(collection);

    backdrop.classList.add('is-open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 80);
    }
  }

  function closeModal() {
    if (!backdrop.classList.contains('is-open')) return;

    backdrop.classList.remove('is-open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (lastActiveTrigger && typeof lastActiveTrigger.focus === 'function') {
      lastActiveTrigger.focus();
    }
  }

  // Row click listeners
  collectionRows.forEach(row => {
    row.addEventListener('click', (e) => {
      const collectionId = row.getAttribute('data-collection');
      openModal(collectionId, row);
    });

    // Keyboard support (Enter / Space)
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const collectionId = row.getAttribute('data-collection');
        openModal(collectionId, row);
      }
    });
  });

  // Close button trigger
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });
  }

  // Backdrop outside click trigger
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });

  // Escape key trigger
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Expose global openServiceCollectionModal helper
  window.openServiceCollectionModal = openModal;
}

/**
 * 15. Verified Credentials & Certifications Data Registry (10 Official Entries)
 * Strictly sourced from official group portfolio documentation
 */
const CREDENTIALS_DATA = {
  'ts-urban-incorporation': {
    id: 'ts-urban-incorporation',
    number: '01',
    company: 'TS URBAN ALLIED SERVICES & ENTERPRISES (PRIVATE) LIMITED',
    documentTitle: 'Certificate of Incorporation',
    category: 'Corporate Registration',
    badge: 'SECP REGISTERED',
    image: 'assets/images/01-ts-urban-allied-incorporation.png',
    issuedBy: 'Securities and Exchange Commission of Pakistan (SECP)',
    fileNumber: '0340772 (Corporate Unique Identification No.)',
    legalBasis: 'Section 16 of the Companies Act, 2017 (XIX of 2017)',
    date: '15 June 2026',
    validity: 'Permanent Corporate Registration',
    status: 'Official Electronically Generated Certificate',
    notes: 'Primary group enterprise incorporation under SECP regulatory jurisdiction.'
  },

  'ts-travel-incorporation': {
    id: 'ts-travel-incorporation',
    number: '02',
    company: 'TS TRAVEL AND TOURS & VISA CONSULTANT (PRIVATE) LIMITED',
    documentTitle: 'Certificate of Incorporation',
    category: 'Corporate Registration',
    badge: 'SECP REGISTERED',
    image: 'assets/images/02-ts-travel-tours-incorporation.png',
    issuedBy: 'Securities and Exchange Commission of Pakistan (SECP)',
    fileNumber: '0344506 (Corporate Unique Identification No.)',
    legalBasis: 'Section 16 of the Companies Act, 2017 (XIX of 2017)',
    date: '8 July 2026',
    validity: 'Permanent Corporate Registration',
    status: 'Official Electronically Generated Certificate',
    notes: 'Authorized travel, tourism and visa facilitation enterprise incorporation.'
  },

  'ts-texas-filing': {
    id: 'ts-texas-filing',
    number: '03',
    company: 'TS URBAN ALLIED SERVICES LLC',
    documentTitle: 'Certificate of Filing',
    category: 'International Corporate Filing',
    badge: 'TEXAS — USA',
    image: 'assets/images/03-ts-urban-allied-texas-filing.png',
    issuedBy: 'Office of the Secretary of State, State of Texas, USA',
    fileNumber: '806746305 (State of Texas Filing No.)',
    legalBasis: 'Texas Business Organizations Code (BOC)',
    date: '13 August 2026',
    validity: 'Effective from 13 August 2026',
    status: 'Officially Filed Domestic Limited Liability Company',
    notes: 'International enterprise registration establishing authorized operations in Texas, United States.'
  },

  'buraq-incorporation': {
    id: 'buraq-incorporation',
    number: '04',
    company: 'BURAQ INTERNATIONAL TOURS OPERATORS (PRIVATE) LIMITED',
    documentTitle: 'Certificate of Incorporation',
    category: 'Corporate Registration',
    badge: 'SECP REGISTERED',
    image: 'assets/images/04-buraq-international-tours-incorporation.png',
    issuedBy: 'Securities and Exchange Commission of Pakistan (SECP)',
    fileNumber: '0107143 (Corporate Universal Identification No.)',
    legalBasis: 'Companies Ordinance, 1984',
    date: '4 April 2017',
    validity: 'Permanent Corporate Registration',
    status: 'Registered Private Limited Company',
    notes: 'Operating entity for international tourism, excursion and travel bookings.'
  },

  'concord-incorporation': {
    id: 'concord-incorporation',
    number: '05',
    company: 'CONCORD OVERSEAS EMPLOYMENT (PRIVATE) LIMITED',
    documentTitle: 'Certificate of Incorporation',
    category: 'Corporate Registration',
    badge: 'SECP REGISTERED',
    image: 'assets/images/05-concord-overseas-employment-incorporation.png',
    issuedBy: 'Securities and Exchange Commission of Pakistan (CRO Rawalpindi)',
    fileNumber: '0075714 (Corporate Universal Identification No.)',
    legalBasis: 'Section 32 of the Companies Ordinance, 1984 (XLVII of 1984)',
    date: '27 April 2011',
    validity: 'Permanent Corporate Registration',
    status: 'Registered Corporate Entity',
    notes: 'Corporate backbone for international overseas recruitment and workforce placement.'
  },

  'concord-licence-renewal': {
    id: 'concord-licence-renewal',
    number: '06',
    company: 'CONCORD OVERSEAS EMPLOYMENT',
    documentTitle: "Overseas Employment Promoter's Licence Renewal",
    category: 'Overseas Employment Licence',
    badge: 'LICENCE RENEWED — 2026',
    isFeatured: true,
    image: 'assets/images/06-concord-overseas-employment-license-renewal.png',
    issuedBy: 'Government of Pakistan — Ministry of Overseas Pakistanis & Human Resource Development',
    fileNumber: 'Licence No: 3160 / RWP',
    legalBasis: 'Emigration Ordinance, 1979 & Rules Framed Thereunder',
    date: '30/01/2026 (Valid 01/01/2026 – 31/12/2026)',
    validity: 'Renewed through 31 December 2026',
    status: 'Active Government-Licensed Overseas Employment Promoter (OEP)',
    notes: 'Featured Credential: Authorized deployment of skilled and professional human capital to Saudi Arabia, UAE, Malaysia, and European partner territories.',
    supportingDocs: 'Official Authority Letter & Special Power of Attorney verified on record.'
  },

  'dolphin-iata-accreditation': {
    id: 'dolphin-iata-accreditation',
    number: '07',
    company: 'DOLPHIN SHIPPERS (PRIVATE) LIMITED',
    documentTitle: 'IATA Certificate of Accreditation',
    category: 'Industry Accreditation',
    badge: 'IATA ACCREDITED',
    isFeatured: true,
    image: 'assets/images/07-dolphin-shippers-iata-accreditation-2026.png',
    issuedBy: 'International Air Transport Association (IATA)',
    fileNumber: 'IATA Numeric Code: 27326080003',
    legalBasis: 'IATA Cargo Intermediary Professional Standards',
    date: 'Calendar Year 2026',
    validity: 'Valid Calendar Year 2026',
    status: 'Active IATA Cargo Intermediary Accreditation',
    notes: 'Featured Credential: Met the professional global standards of the International Air Transport Association to promote, sell and handle international air cargo transportation.'
  },

  'fajar-incorporation': {
    id: 'fajar-incorporation',
    number: '08',
    company: 'FAJAR JANITORIAL SERVICES (PRIVATE) LIMITED',
    documentTitle: 'Certificate of Incorporation',
    category: 'Corporate Registration',
    badge: 'SECP REGISTERED',
    image: 'assets/images/08-fajar-janitorial-incorporation.png',
    issuedBy: 'Securities and Exchange Commission of Pakistan (SECP)',
    fileNumber: '0316087 (Corporate Unique Identification No.)',
    legalBasis: 'Section 16 of the Companies Act, 2017 (XIX of 2017)',
    date: '20 November 2025',
    validity: 'Permanent Corporate Registration',
    status: 'Official Electronically Generated Certificate',
    notes: 'Incorporation of specialized commercial janitorial and facility hygiene enterprise.'
  },

  'leon-developers-incorporation': {
    id: 'leon-developers-incorporation',
    number: '09',
    company: 'LEON DEVELOPERS (PRIVATE) LIMITED',
    documentTitle: 'Certificate of Incorporation',
    category: 'Corporate Registration',
    badge: 'SECP REGISTERED',
    image: 'assets/images/09-leon-developers-incorporation.png',
    issuedBy: 'Securities and Exchange Commission of Pakistan (SECP)',
    fileNumber: '0233294 (Corporate Unique Identification No.)',
    legalBasis: 'Section 16 of the Companies Act, 2017 (XIX of 2017)',
    date: '26 June 2023',
    location: 'Lahore',
    validity: 'Permanent Corporate Registration',
    status: 'Official Electronically Generated Certificate',
    notes: 'Incorporation of corporate development and infrastructure enterprise registered with SECP Lahore.'
  },

  'leon-security-licence': {
    id: 'leon-security-licence',
    number: '10',
    company: 'LEON SECURITY SERVICES (PVT) LIMITED',
    documentTitle: 'Private Security Company Licence & Official NOC',
    category: 'Security Licence',
    badge: 'ICT LICENCE & MOI NOC',
    isFeatured: true,
    image: 'assets/images/09-leon-security-ict-license.png',
    issuedBy: 'Office of the Chief Commissioner ICT & Ministry of Interior',
    fileNumber: 'ICT Licence (12 Apr 2023) | MOI Ref: U.O. No. 4/8/2020-CD | NOC: 2(146)-Home/2000',
    legalBasis: 'ICT Private Security Companies Regulation & Federal Security Vetting Framework',
    date: '12 April 2023 / Verified NOC',
    validity: 'Authorized Regulatory Licence & Clearance',
    status: 'Licensed Private Security Company & Approved NOC',
    notes: 'Featured Credential: Consolidated official security authorization including ICT Chief Commissioner Operating Licence and Federal Ministry of Interior vetting NOC.',
    documents: [
      {
        title: 'ICT Private Security Company Licence',
        subtitle: 'Issued through Office of the Chief Commissioner, Islamabad Capital Territory (12 April 2023)',
        image: 'assets/images/09-leon-security-ict-license.png'
      },
      {
        title: 'Ministry of Interior — No Objection Certificate (NOC)',
        subtitle: 'Federal Security Clearance Ref: U.O. No. 4/8/2020-CD | Home Dept: HP-1/11-699/2020 | Islamabad NOC: 2(146)-Home/2000',
        image: 'assets/images/10-leon-security-ministry-interior-noc.png'
      }
    ],
    supportingDocs: 'Official licence terms, conditions and operational clearance available on record.'
  }
};

/**
 * 16. Section 5: The Credential Vault & Interactive Orbit Controller
 */
const CREDENTIAL_NODES_ORDER = [
  'dolphin-iata-accreditation',
  'ts-urban-incorporation',
  'ts-travel-incorporation',
  'ts-texas-filing',
  'leon-developers-incorporation',
  'leon-security-licence',
  'fajar-incorporation',
  'concord-licence-renewal',
  'concord-incorporation',
  'buraq-incorporation'
];

let activeCredentialId = 'dolphin-iata-accreditation';

function initCredentialVaultOrbit() {
  const section = document.getElementById('certifications');
  if (!section) return;

  const nodes = section.querySelectorAll('.vault-node');
  const mobileChips = section.querySelectorAll('.mobile-cred-chip');
  const lines = section.querySelectorAll('.orbit-fiber-line');
  
  const coreCatTag = document.getElementById('coreCatTag');
  const coreBrandName = document.getElementById('coreBrandName');
  const coreDocTitle = document.getElementById('coreDocTitle');
  const coreYearPill = document.getElementById('coreYearPill');
  const coreStatusPill = document.getElementById('coreStatusPill');
  const coreViewDocBtn = document.getElementById('coreViewDocBtn');
  const coreEmblem = document.getElementById('vaultCoreEmblem');

  const inspectorCatLabel = document.getElementById('inspectorCatLabel');
  const inspectorCompanyTitle = document.getElementById('inspectorCompanyTitle');
  const inspectorDocDesc = document.getElementById('inspectorDocDesc');
  const inspectorAuthority = document.getElementById('inspectorAuthority');
  const inspectorRef = document.getElementById('inspectorRef');
  const inspectorCounter = document.getElementById('inspectorCounter');
  const inspectorViewBtn = document.getElementById('inspectorViewBtn');
  const inspectorPrevBtn = document.getElementById('inspectorPrevBtn');
  const inspectorNextBtn = document.getElementById('inspectorNextBtn');

  function updateActiveCredential(docId, triggerEl) {
    const doc = CREDENTIALS_DATA[docId];
    if (!doc) return;

    activeCredentialId = docId;
    const currentIndex = CREDENTIAL_NODES_ORDER.indexOf(docId);

    // 1. Update Core Emblem with subtle transition
    if (coreEmblem) {
      coreEmblem.style.transform = 'translate(-50%, -50%) scale(0.97)';
      coreEmblem.style.opacity = '0.7';
      setTimeout(() => {
        if (coreCatTag) coreCatTag.textContent = doc.category;
        if (coreBrandName) coreBrandName.textContent = doc.company.replace(' (PRIVATE) LIMITED', '').replace(' (PVT) LTD', '').replace(' (PVT.) LTD', '');
        if (coreDocTitle) coreDocTitle.textContent = doc.documentTitle;
        if (coreYearPill) coreYearPill.textContent = doc.validity || doc.date;
        if (coreStatusPill) coreStatusPill.textContent = doc.badge;

        coreEmblem.style.transform = 'translate(-50%, -50%) scale(1)';
        coreEmblem.style.opacity = '1';
      }, 100);
    }

    // 2. Update Orbit Active Nodes
    nodes.forEach(node => {
      const isTarget = node.getAttribute('data-doc-id') === docId;
      node.classList.toggle('is-active', isTarget);
      node.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    // 3. Update Connecting SVG Ray Lines
    lines.forEach(line => {
      const targetLineId = `line-${docId}`;
      line.classList.toggle('is-active', line.id === targetLineId);
    });

    // 4. Update Mobile Selector Chips
    mobileChips.forEach(chip => {
      const isTarget = chip.getAttribute('data-doc-id') === docId;
      chip.classList.toggle('is-active', isTarget);
      chip.setAttribute('aria-selected', isTarget ? 'true' : 'false');
      if (isTarget) {
        chip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });

    // 5. Update Secondary Inspector Panel
    if (inspectorCatLabel) inspectorCatLabel.textContent = doc.category;
    if (inspectorCompanyTitle) inspectorCompanyTitle.textContent = doc.company;
    if (inspectorDocDesc) inspectorDocDesc.textContent = doc.notes || `${doc.issuedBy} • ${doc.legalBasis}`;
    if (inspectorAuthority) inspectorAuthority.textContent = doc.issuedBy;
    if (inspectorRef) inspectorRef.textContent = doc.fileNumber;
    if (inspectorCounter && currentIndex !== -1) {
      const numStr = String(currentIndex + 1).padStart(2, '0');
      const totalStr = String(CREDENTIAL_NODES_ORDER.length).padStart(2, '0');
      inspectorCounter.textContent = `${numStr} / ${totalStr}`;
    }
  }

  // Node event listeners
  nodes.forEach(node => {
    const docId = node.getAttribute('data-doc-id');
    node.addEventListener('click', () => updateActiveCredential(docId, node));
    node.addEventListener('mouseenter', () => updateActiveCredential(docId, node));
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        updateActiveCredential(docId, node);
      }
    });
  });

  // Mobile chips listeners
  mobileChips.forEach(chip => {
    const docId = chip.getAttribute('data-doc-id');
    chip.addEventListener('click', () => updateActiveCredential(docId, chip));
  });

  // Inspector Prev / Next buttons
  if (inspectorPrevBtn) {
    inspectorPrevBtn.addEventListener('click', () => {
      let idx = CREDENTIAL_NODES_ORDER.indexOf(activeCredentialId);
      idx = (idx - 1 + CREDENTIAL_NODES_ORDER.length) % CREDENTIAL_NODES_ORDER.length;
      updateActiveCredential(CREDENTIAL_NODES_ORDER[idx]);
    });
  }

  if (inspectorNextBtn) {
    inspectorNextBtn.addEventListener('click', () => {
      let idx = CREDENTIAL_NODES_ORDER.indexOf(activeCredentialId);
      idx = (idx + 1) % CREDENTIAL_NODES_ORDER.length;
      updateActiveCredential(CREDENTIAL_NODES_ORDER[idx]);
    });
  }

  // Direct trigger to open modal from Center or Inspector
  if (coreViewDocBtn) {
    coreViewDocBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof window.openDocumentModal === 'function') {
        window.openDocumentModal(activeCredentialId, coreViewDocBtn);
      }
    });
  }

  if (inspectorViewBtn) {
    inspectorViewBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof window.openDocumentModal === 'function') {
        window.openDocumentModal(activeCredentialId, inspectorViewBtn);
      }
    });
  }

  // Initial load
  updateActiveCredential(activeCredentialId);
}

/**
 * 17. Section 5 (The Credential Vault) Scroll Reveal
 */
function initVaultScrollReveal() {
  const section = document.getElementById('certifications');
  if (!section) return;

  const revealElements = section.querySelectorAll('.vault-reveal');
  if (!revealElements.length) return;

  let revealed = false;

  function revealAll() {
    if (revealed) return;
    revealed = true;
    revealElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('is-revealed');
      }, index * 80);
    });
  }

  const rect = section.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
    revealAll();
    return;
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealAll();
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -40px 0px'
    });

    observer.observe(section);
  } else {
    revealAll();
  }
}

/**
 * 18. Document Viewer Modal Controller & Multi-Document Renderer
 */
function initDocumentViewerModal() {
  const backdrop = document.getElementById('documentModalBackdrop');
  const dialog = document.getElementById('documentModalDialog');
  const contentSlot = document.getElementById('documentModalContentSlot');
  const closeBtn = document.getElementById('documentModalCloseBtn');

  if (!backdrop || !dialog || !contentSlot) return;

  let lastActiveTrigger = null;
  let currentSubDocIndex = 0;
  let currentDocData = null;

  function renderDocumentModal(doc, subDocIdx = 0) {
    currentDocData = doc;
    currentSubDocIndex = subDocIdx;

    const hasMultiDocs = doc.documents && doc.documents.length > 1;
    const currentSubDoc = hasMultiDocs ? doc.documents[currentSubDocIndex] : null;
    const activeImage = currentSubDoc ? currentSubDoc.image : doc.image;
    const activeSubTitle = currentSubDoc ? currentSubDoc.title : doc.documentTitle;
    const activeSubSubtitle = currentSubDoc ? currentSubDoc.subtitle : '';

    let html = `
      <div class="doc-modal-header">
        <div class="doc-modal-icon-badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>
        <div class="doc-modal-title-wrap">
          <div class="doc-modal-tag-row">
            <span class="doc-modal-cat-tag">${doc.category}</span>
            <span class="doc-modal-badge">${doc.badge}</span>
            ${doc.isFeatured ? '<span class="doc-modal-badge" style="background:#1459D9; color:#FFFFFF; border-color:#1459D9;">FEATURED CREDENTIAL</span>' : ''}
          </div>
          <h3 class="doc-modal-title" id="modalDocTitle">${hasMultiDocs ? activeSubTitle : doc.documentTitle}</h3>
          <p class="doc-modal-company">${doc.company} ${activeSubSubtitle ? `<span style="font-size:12px; color:#5E6C84; display:block; margin-top:2px;">${activeSubSubtitle}</span>` : ''}</p>
        </div>
      </div>

      ${hasMultiDocs ? `
        <!-- Multi-Document Pagination Switcher -->
        <div class="doc-pagination-bar">
          <button class="doc-page-btn" id="modalSubDocPrev" ${currentSubDocIndex === 0 ? 'disabled' : ''} aria-label="Previous official document page">
            <span>← Previous Document</span>
          </button>
          <span class="doc-page-indicator">Document ${currentSubDocIndex + 1} of ${doc.documents.length}</span>
          <button class="doc-page-btn" id="modalSubDocNext" ${currentSubDocIndex === doc.documents.length - 1 ? 'disabled' : ''} aria-label="Next official document page">
            <span>Next Document →</span>
          </button>
        </div>
      ` : ''}

      <!-- Scanned Document Image Preview -->
      <div class="doc-preview-wrapper">
        <img src="${activeImage}" alt="${activeSubTitle} - ${doc.company}" class="doc-preview-img" loading="lazy">
      </div>

      <!-- Official Document Protection Notice -->
<div class="document-protection-notice" role="note">
  <div class="document-protection-icon" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="5" y="10" width="14" height="10" rx="2"></rect>
      <path d="M8 10V7a4 4 0 0 1 8 0v3"></path>
      <circle cx="12" cy="15" r="1"></circle>
    </svg>
  </div>

  <div class="document-protection-text">
    <strong>Official Document — Protected</strong>
    <span>
      For verification purposes only. Unauthorized alteration,
      reproduction, or misuse is strictly prohibited.
      Tampered copies are not considered valid.
    </span>
  </div>
</div>

      <!-- Credential Details Grid -->
      <div class="doc-meta-grid">
        <div class="doc-meta-card">
          <span class="doc-meta-label">Issuing Authority</span>
          <p class="doc-meta-val">${doc.issuedBy}</p>
        </div>
        <div class="doc-meta-card">
          <span class="doc-meta-label">Document / File Ref</span>
          <p class="doc-meta-val">${doc.fileNumber}</p>
        </div>
        <div class="doc-meta-card">
          <span class="doc-meta-label">Legal Basis / Ordinance</span>
          <p class="doc-meta-val">${doc.legalBasis}</p>
        </div>
        <div class="doc-meta-card">
          <span class="doc-meta-label">Date &amp; Validity</span>
          <p class="doc-meta-val">${doc.date}</p>
        </div>
      </div>

      <!-- Supporting Documentation Note (if applicable) -->
      ${doc.supportingDocs ? `
        <div class="doc-supporting-notes">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <span><strong>Official Documentation Note:</strong> ${doc.supportingDocs}</span>
        </div>
      ` : ''}

      <!-- Bottom Action Bar -->
      <div class="doc-modal-action-bar">
        <span style="font-size: 12.5px; color: #5E6C84; font-weight: 500;">Official regulatory record verified and archived by Supreme Group of Companies.</span>
        <button class="doc-modal-close-btn-secondary" id="docModalCloseBtnSec">
          <span>Close Document</span>
        </button>
      </div>
    `;

    contentSlot.innerHTML = html;

    // Attach multi-document switcher handlers
    if (hasMultiDocs) {
      const prevBtn = contentSlot.querySelector('#modalSubDocPrev');
      const nextBtn = contentSlot.querySelector('#modalSubDocNext');

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (currentSubDocIndex > 0) {
            renderDocumentModal(currentDocData, currentSubDocIndex - 1);
          }
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (currentSubDocIndex < currentDocData.documents.length - 1) {
            renderDocumentModal(currentDocData, currentSubDocIndex + 1);
          }
        });
      }
    }

    const secCloseBtn = contentSlot.querySelector('#docModalCloseBtnSec');
    if (secCloseBtn) {
      secCloseBtn.addEventListener('click', () => {
        closeModal();
      });
    }
  }

  function openModal(docId, triggerEl) {
    const doc = CREDENTIALS_DATA[docId];
    if (!doc) return;

    lastActiveTrigger = triggerEl;
    renderDocumentModal(doc, 0);

    backdrop.classList.add('is-open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 80);
    }
  }

  function closeModal() {
    if (!backdrop.classList.contains('is-open')) return;

    backdrop.classList.remove('is-open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (lastActiveTrigger && typeof lastActiveTrigger.focus === 'function') {
      lastActiveTrigger.focus();
    }
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('is-open')) {
      closeModal();
    }
  });

  window.openDocumentModal = openModal;
}


/**
 * 19. Section 6: Careers & Opportunities (The Career Gateway) Data Registry
 */
const CAREER_STAGES_DATA = {
  '01': {
    stage: '01',
    title: 'CAREER CONSULTANCY',
    quote: '“Guidance and support for a better career tomorrow.”',
    entity: 'NIAZI ROZGAR (PVT) LTD',
    motto: 'BRIDGING TALENT, CREATING OPPORTUNITIES',
    desc: 'Personalized career evaluation, skill pathway orientation, and professional guidance connecting candidates with the right international and corporate opportunities.',
    highlights: [
      'Professional Candidate Assessment & Profiling',
      'Career Mapping & Skill Pathway Advisory',
      'End-to-End Mobilization & Placement Support'
    ]
  },
  '02': {
    stage: '02',
    title: 'RECRUITMENT SOLUTIONS',
    quote: '“End-to-end recruitment services tailored to your needs.”',
    entity: 'NIAZI ROZGAR (PVT) LTD',
    motto: 'BRIDGING TALENT, CREATING OPPORTUNITIES',
    desc: 'Comprehensive talent acquisition and vetting services for enterprises, bridging qualified candidates with targeted technical and operational roles.',
    highlights: [
      'Tailored Talent Sourcing & Screening',
      'Executive & Technical Staff Selection',
      'Compliance & Candidate Verification'
    ]
  },
  '03': {
    stage: '03',
    title: 'MANPOWER SUPPLY',
    quote: '“Providing reliable and efficient manpower solutions worldwide.”',
    entity: 'NIAZI ROZGAR (PVT) LTD',
    motto: 'BRIDGING TALENT, CREATING OPPORTUNITIES',
    desc: 'Structured supply of skilled, semi-skilled, and general workforce tailored for infrastructure, facility management, and industrial operations.',
    highlights: [
      'Skilled, Semi-Skilled & General Workforce',
      'Rapid Deployment & Turnkey Mobilization',
      'Strict Quality & Operational Discipline'
    ]
  },
  '04': {
    stage: '04',
    title: 'OVERSEAS EMPLOYMENT',
    quote: '“Connecting skilled and unskilled workers with global opportunities.”',
    entity: 'NIAZI ROZGAR (PVT) LTD',
    motto: 'BRIDGING TALENT, CREATING OPPORTUNITIES',
    desc: 'Facilitating cross-border employment opportunities with verified employers across the Gulf, Middle East, and international partner destinations.',
    highlights: [
      'Global Employer Partnerships & Placement',
      'Skilled & Professional Deployment',
      'Ethical, Transparent International Recruitment'
    ]
  },
  '05': {
    stage: '05',
    title: 'VISA & DOCUMENTATION',
    quote: '“Hassle-free visa processing and documentation support.”',
    entity: 'NIAZI ROZGAR (PVT) LTD',
    motto: 'BRIDGING TALENT, CREATING OPPORTUNITIES',
    desc: 'Complete administrative assistance, visa stamping coordination, attestation, medical verification, and travel readiness for international workforce deployment.',
    highlights: [
      'Comprehensive Visa Clearance & Embassy Attestation',
      'Protector & Legal Emigration Formalities',
      'Pre-Departure Orientation & Travel Readiness'
    ]
  }
};

let activeCareerStage = '01';

/**
 * 20. Section 6: Careers Gateway Interactive Stage Controller
 */
function initCareersJourney() {
  const section = document.getElementById('careers');
  if (!section) return;

  const nodes = section.querySelectorAll('.career-node');
  const stageNumEl = document.getElementById('careerStageNum');
  const stageTitleEl = document.getElementById('careerStageTitle');
  const stageQuoteEl = document.getElementById('careerStageQuote');
  const stageDescEl = document.getElementById('careerStageDesc');
  const stageHighlightsEl = document.getElementById('careerStageHighlights');
  const inspectorCard = document.getElementById('careerInspectorCard');

  function updateCareerStage(stageKey) {
    const data = CAREER_STAGES_DATA[stageKey];
    if (!data) return;

    activeCareerStage = stageKey;

    // 1. Toggle active states on nodes
    nodes.forEach(node => {
      const isTarget = node.getAttribute('data-stage') === stageKey;
      node.classList.toggle('is-active', isTarget);
      node.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    // 2. Smoothly update Left Inspector Card content
    if (inspectorCard) {
      inspectorCard.style.opacity = '0.75';
      inspectorCard.style.transform = 'translateY(3px)';
      
      setTimeout(() => {
        if (stageNumEl) stageNumEl.textContent = data.stage;
        if (stageTitleEl) stageTitleEl.textContent = data.title;
        if (stageQuoteEl) stageQuoteEl.textContent = data.quote;
        if (stageDescEl) stageDescEl.textContent = data.desc;

        if (stageHighlightsEl && data.highlights) {
          stageHighlightsEl.innerHTML = data.highlights.map(item => `
            <div class="stage-highlight-item">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
                <polyline points="4 10 8 14 16 6"/>
              </svg>
              <span>${item}</span>
            </div>
          `).join('');
        }

        inspectorCard.style.opacity = '1';
        inspectorCard.style.transform = 'translateY(0)';
      }, 100);
    }
  }

  // Attach event listeners to all career nodes
  nodes.forEach((node, index) => {
    const stageKey = node.getAttribute('data-stage');

    node.addEventListener('click', () => {
      updateCareerStage(stageKey);
    });

    node.addEventListener('mouseenter', () => {
      updateCareerStage(stageKey);
    });

    node.addEventListener('keydown', (e) => {
      const stageKeys = Object.keys(CAREER_STAGES_DATA);
      let targetIndex = -1;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        targetIndex = (index + 1) % stageKeys.length;
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        targetIndex = (index - 1 + stageKeys.length) % stageKeys.length;
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        updateCareerStage(stageKey);
        return;
      }

      if (targetIndex !== -1) {
        const nextKey = stageKeys[targetIndex];
        const nextNode = section.querySelector(`.career-node[data-stage="${nextKey}"]`);
        if (nextNode) {
          nextNode.focus();
          updateCareerStage(nextKey);
        }
      }
    });
  });

  // Initial load
  updateCareerStage('01');
}

/**
 * 21. Section 6: Scroll Reveal for Careers Gateway
 */
function initCareersScrollReveal() {
  const section = document.getElementById('careers');
  if (!section) return;

  const revealElements = section.querySelectorAll('.careers-reveal');
  if (!revealElements.length) return;

  let revealed = false;

  function revealAll() {
    if (revealed) return;
    revealed = true;
    revealElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('is-revealed');
      }, index * 90);
    });
  }

  const rect = section.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
    revealAll();
    return;
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealAll();
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -40px 0px'
    });

    observer.observe(section);
  } else {
    revealAll();
  }
}

/**
 * 22. Section 7: Business Offices Directory Dataset
 */
const CONTACT_PHONE_GROUPS = [
  {
    role: 'CEO — Tanveer Saleem',
    numbers: [
      { text: '+923084081479', tel: '+923084081479' },
      { text: '+923246886982', tel: '+923246886982' },
      { text: '+13253319861', tel: '+13253319861' },
      { text: '+920516109227', tel: '+920516109227' }
    ]
  },
  {
    role: 'M.D — Mohammed Azhar Naseer Wahla',
    numbers: [
      { text: '+923455608120', tel: '+923455608120' },
      { text: '+923001065120', tel: '+923001065120' },
      { text: '+920516109227', tel: '+920516109227' }
    ]
  }
];

const CONTACT_OFFICES_DATA = {
  'concord': {
    id: 'concord',
    name: 'CONCORD OVERSEAS EMPLOYMENT',
    tagline: 'Overseas Employment & Manpower Services',
    badge: 'OVERSEAS EMPLOYMENT',
    address: 'Business center executive block lower ground office no 5,6,13,14  Gulberg Green Islamabad',
    phoneGroups: CONTACT_PHONE_GROUPS,
    primaryCopyPhone: '+923084081479',
    fax: '051-2270706',
    email: 'takhtar1234@hotmail.com',
    secondaryLabel: 'Associate Offices',
    secondaryChips: ['Karachi', 'Lahore', 'Quetta', 'Peshawar'],
    whatsapp: null // Verified official Islamabad landline only
  },
  'dolphin': {
    id: 'dolphin',
    name: 'DOLPHIN SHIPPERS (PRIVATE) LIMITED',
    tagline: 'INTERNATIONAL FREIGHT • SHIPPING • CARGO',
    badge: 'LOGISTICS & CARGO (IATA: 27326080003)',
    address: 'Business center executive block lower ground office no 5,6,13,14  Gulberg Green Islamabad',
    phoneGroups: CONTACT_PHONE_GROUPS,
    primaryCopyPhone: '+923084081479',
    fax: '051-8436252',
    email: 'takhtar1234@hotmail.com',
    website: 'dolphinshippers.org',
    secondaryLabel: 'Accreditations & Scope',
    secondaryChips: ['IATA Code: 27326080003', 'International Freight', 'Customs Clearing', 'Cranage Services'],
    whatsapp: '923084081479'
  },
  'leon-security': {
    id: 'leon-security',
    name: 'LEON SECURITY SERVICES (PVT) LIMITED',
    tagline: '“Right Protection Right Time”',
    badge: 'SECURITY SERVICES',
    address: 'Business center executive block lower ground office no 5,6,13,14  Gulberg Green Islamabad',
    phoneGroups: CONTACT_PHONE_GROUPS,
    primaryCopyPhone: '+923084081479',
    email: 'takhtar1234@hotmail.com',
    secondaryLabel: 'Regional Office',
    secondaryChips: ['Plaza No C-36/27 Block CCB, Lake City Holding, Raiwind Road, Lahore', 'ICT Licensed & MOI Approved NOC'],
    whatsapp: '923084081479'
  },
  'fajar': {
    id: 'fajar',
    name: 'FAJAR JANITORIAL SERVICES (PVT) LTD',
    tagline: 'JANITORIAL • MANPOWER • FACILITY SERVICES',
    badge: 'JANITORIAL & FACILITY',
    address: 'Business center executive block lower ground office no 5,6,13,14  Gulberg Green Islamabad',
    phoneGroups: CONTACT_PHONE_GROUPS,
    primaryCopyPhone: '+923084081479',
    email: 'takhtar1234@hotmail.com',
    secondaryLabel: 'Specialized Capabilities',
    secondaryChips: ['Commercial Janitorial', 'HR & Manpower Supply', 'Uniform Stitching', 'Facility Management'],
    whatsapp: '923084081479'
  }
};

let currentSelectedOfficeKey = 'concord';

/**
 * 25. Section 7: Business Office Directory & Tab Switcher
 */
function initBusinessOfficeSelector() {
  const section = document.getElementById('contact');
  if (!section) return;

  const officePills = section.querySelectorAll('.office-pill-btn');
  const card = document.getElementById('dynamicOfficeCard');
  const badgeEl = document.getElementById('officeEntityBadge');
  const nameEl = document.getElementById('officeNameTitle');
  const taglineEl = document.getElementById('officeTaglineText');
  const addressEl = document.getElementById('officeAddressText');
  const phonesGroup = document.getElementById('officePhonesGroup');
  const emailGroup = document.getElementById('officeEmailGroup');
  const secondaryLabelEl = document.getElementById('officeSecondaryLabel');
  const secondaryChipsEl = document.getElementById('officeSecondaryChips');

  function selectOffice(officeKey) {
    const data = CONTACT_OFFICES_DATA[officeKey];
    if (!data) return;

    currentSelectedOfficeKey = officeKey;

    // Update pill tabs
    officePills.forEach(pill => {
      const isTarget = pill.getAttribute('data-office') === officeKey;
      pill.classList.toggle('is-active', isTarget);
      pill.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    // Smooth card crossfade
    if (card) {
      card.style.opacity = '0.65';
      card.style.transform = 'translateY(4px)';

      setTimeout(() => {
        if (badgeEl) badgeEl.textContent = data.badge;
        if (nameEl) nameEl.textContent = data.name;
        if (taglineEl) taglineEl.textContent = data.tagline;
        if (addressEl) addressEl.textContent = data.address;

        // Render phone links
        if (phonesGroup) {
          const groups = data.phoneGroups || CONTACT_PHONE_GROUPS;
          phonesGroup.innerHTML = `
            <div class="contact-leader-phones">
              ${groups.map(g => `
                <div class="contact-phone-tier">
                  <span class="contact-phone-role">${g.role}</span>
                  <div class="contact-phone-nums">
                    ${g.numbers.map((p, idx) => `
                      <a href="tel:${p.tel}" class="info-tel-link">${p.text}</a>
                      ${idx < g.numbers.length - 1 ? '<span class="info-bullet" aria-hidden="true">•</span>' : ''}
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          `;
        }

        // Render email & fax / website dynamically
        const emailRow = card.querySelector('.office-info-row:nth-child(3)');
        if (emailRow) {
          if (data.email) {
            emailRow.style.display = 'grid';
            let emailHtml = `<a href="mailto:${data.email}" class="info-email-link" id="officeEmailLink">${data.email}</a>`;
            if (data.fax) {
              emailHtml += `<span class="info-bullet" aria-hidden="true">•</span><span class="info-fax-text">Fax: ${data.fax}</span>`;
            }
            if (emailGroup) emailGroup.innerHTML = emailHtml;
            const emailCopyBtn = emailRow.querySelector('.copy-btn-interactive');
            if (emailCopyBtn) {
              emailCopyBtn.style.display = 'inline-flex';
              emailCopyBtn.setAttribute('data-copy-val', data.email);
            }
          } else if (data.website) {
            emailRow.style.display = 'grid';
            let emailHtml = `<a href="https://${data.website}" target="_blank" rel="noopener noreferrer" class="info-tel-link" style="color:#1459D9; font-weight:600;">${data.website} ↗</a>`;
            if (data.fax) {
              emailHtml += `<span class="info-bullet" aria-hidden="true">•</span><span class="info-fax-text">Fax: ${data.fax}</span>`;
            }
            if (emailGroup) emailGroup.innerHTML = emailHtml;
            const emailCopyBtn = emailRow.querySelector('.copy-btn-interactive');
            if (emailCopyBtn) {
              emailCopyBtn.style.display = 'inline-flex';
              emailCopyBtn.setAttribute('data-copy-val', data.website);
            }
          } else {
            emailRow.style.display = 'none';
          }
        }

        // Render secondary chips
        if (secondaryLabelEl) secondaryLabelEl.textContent = data.secondaryLabel;
        if (secondaryChipsEl) {
          secondaryChipsEl.innerHTML = data.secondaryChips.map(c => `
            <span class="assoc-chip">${c}</span>
          `).join('');
        }

        // Update copy button data targets
        const phoneCopyBtn = card.querySelector('.office-info-row:nth-child(2) .copy-btn-interactive');
        if (phoneCopyBtn) {
          phoneCopyBtn.setAttribute('data-copy-val', data.primaryCopyPhone);
        }

        const emailCopyBtn = card.querySelector('.office-info-row:nth-child(3) .copy-btn-interactive');
        if (emailCopyBtn) {
          emailCopyBtn.setAttribute('data-copy-val', data.email);
        }

        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 120);
    }
  }

  officePills.forEach(pill => {
    const officeKey = pill.getAttribute('data-office');
    pill.addEventListener('click', () => selectOffice(officeKey));
  });

  // Default selection
  selectOffice('concord');
}

/**
 * 26. Section 7: Click-to-Copy Functionality
 */
function initClipboardCopy() {
  document.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('.copy-btn-interactive');
    if (!copyBtn) return;

    e.preventDefault();
    e.stopPropagation();

    let textToCopy = copyBtn.getAttribute('data-copy-val');
    const targetId = copyBtn.getAttribute('data-copy-target');

    if (!textToCopy && targetId) {
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        textToCopy = targetEl.textContent.trim();
      }
    }

    if (!textToCopy) return;

    function showSuccessState() {
      const label = copyBtn.querySelector('.copy-label');
      const originalText = label ? label.textContent : 'COPY';

      copyBtn.classList.add('is-copied');
      if (label) label.textContent = 'COPIED';

      setTimeout(() => {
        copyBtn.classList.remove('is-copied');
        if (label) label.textContent = originalText;
      }, 2000);
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => showSuccessState())
        .catch(() => {
          fallbackCopyText(textToCopy, showSuccessState);
        });
    } else {
      fallbackCopyText(textToCopy, showSuccessState);
    }
  });

  function fallbackCopyText(text, callback) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      if (typeof callback === 'function') callback();
    } catch (err) {
      console.warn('Copy fallback failed', err);
    }
    document.body.removeChild(textArea);
  }
}

/**
 * 27. Section 7: Corporate Inquiry Form Client-Side Validation & Success State
 */
function initContactFormValidation() {
  const form = document.getElementById('contactInquiryForm');
  const successBanner = document.getElementById('formSuccessBanner');
  const successCustomMsg = document.getElementById('successCustomMsg');
  const submitBtn = document.getElementById('inquirySubmitBtn');

  if (!form) return;

  const fullNameInput = document.getElementById('contactFullName');
  const emailInput = document.getElementById('contactEmail');
  const phoneInput = document.getElementById('contactPhone');
  const serviceSelect = document.getElementById('contactServiceSelect');
  const messageInput = document.getElementById('contactMessage');

  const nameError = document.getElementById('nameErrorMsg');
  const emailError = document.getElementById('emailErrorMsg');
  const phoneError = document.getElementById('phoneErrorMsg');
  const serviceError = document.getElementById('serviceErrorMsg');
  const messageError = document.getElementById('messageErrorMsg');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    return /^[\d\s+\-()]{7,20}$/.test(phone.trim());
  }

  // Clear errors on input
  [fullNameInput, emailInput, phoneInput, serviceSelect, messageInput].forEach(field => {
    if (!field) return;
    field.addEventListener('input', () => {
      field.classList.remove('is-invalid');
      const errEl = field.closest('.form-group')?.querySelector('.form-error-msg');
      if (errEl) errEl.classList.remove('is-visible');
    });
    field.addEventListener('change', () => {
      field.classList.remove('is-invalid');
      const errEl = field.closest('.form-group')?.querySelector('.form-error-msg');
      if (errEl) errEl.classList.remove('is-visible');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Full Name
    if (!fullNameInput || fullNameInput.value.trim().length < 2) {
      isValid = false;
      if (fullNameInput) fullNameInput.classList.add('is-invalid');
      if (nameError) nameError.classList.add('is-visible');
    }

    // Validate Email
    if (!emailInput || !validateEmail(emailInput.value.trim())) {
      isValid = false;
      if (emailInput) emailInput.classList.add('is-invalid');
      if (emailError) emailError.classList.add('is-visible');
    }

    // Validate Phone
    if (!phoneInput || !validatePhone(phoneInput.value)) {
      isValid = false;
      if (phoneInput) phoneInput.classList.add('is-invalid');
      if (phoneError) phoneError.classList.add('is-visible');
    }

    // Validate Service Select
    if (!serviceSelect || !serviceSelect.value) {
      isValid = false;
      if (serviceSelect) serviceSelect.classList.add('is-invalid');
      if (serviceError) serviceError.classList.add('is-visible');
    }

    // Validate Message
    if (!messageInput || messageInput.value.trim().length < 5) {
      isValid = false;
      if (messageInput) messageInput.classList.add('is-invalid');
      if (messageError) messageError.classList.add('is-visible');
    }

    if (!isValid) return;

    const selectedOfficeData = CONTACT_OFFICES_DATA[currentSelectedOfficeKey] || CONTACT_OFFICES_DATA['concord'];
    const clientName = fullNameInput ? fullNameInput.value.trim() : '';
    const clientEmail = emailInput ? emailInput.value.trim() : '';
    const clientPhone = phoneInput ? phoneInput.value.trim() : '';
    const clientService = serviceSelect ? serviceSelect.value : 'General Business Inquiry';
    const clientMsg = messageInput ? messageInput.value.trim() : '';

    // Action button state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.75';
      const btnText = submitBtn.querySelector('.btn-text');
      if (btnText) btnText.textContent = selectedOfficeData.whatsapp ? 'OPENING WHATSAPP...' : 'SENDING INQUIRY...';
    }

    setTimeout(() => {
      if (selectedOfficeData.whatsapp) {
        // Construct structured WhatsApp message with full safe encoding
        const waText = `Hello Supreme Group of Companies, I would like to make an inquiry regarding ${selectedOfficeData.name} / ${clientService}.\n\nName: ${clientName}\nEmail: ${clientEmail}\nPhone: ${clientPhone}\n\nMessage:\n${clientMsg}\n\nThank you.`;
        const waUrl = `https://wa.me/${selectedOfficeData.whatsapp}?text=${encodeURIComponent(waText)}`;
        
        // Open WhatsApp in new tab/app
        window.open(waUrl, '_blank');

        if (successCustomMsg) {
          successCustomMsg.textContent = `Thank you, ${clientName}. Your inquiry for ${clientService} has been generated and dispatched to ${selectedOfficeData.name} via WhatsApp.`;
        }
      } else {
        // Fallback for Concord (Official Islamabad Landline Offices)
        if (successCustomMsg) {
          successCustomMsg.textContent = `Thank you, ${clientName}. Your inquiry for ${selectedOfficeData.name} has been received. Please contact directly at +923084081479 / +923455608120 or email takhtar1234@hotmail.com.`;
        }
      }

      if (successBanner) {
        successBanner.style.display = 'flex';
        successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Reset form
      form.reset();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        const btnText = submitBtn.querySelector('.btn-text');
        if (btnText) btnText.textContent = 'SEND INQUIRY';
      }
    }, 400);
  });
}

/**
 * 28. Section 7: Scroll Reveal for Contact Us Section
 */
function initContactScrollReveal() {
  const section = document.getElementById('contact');
  if (!section) return;

  const revealElements = section.querySelectorAll('.contact-reveal');
  if (!revealElements.length) return;

  let revealed = false;

  function revealAll() {
    if (revealed) return;
    revealed = true;
    revealElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('is-revealed');
      }, index * 60);
    });
  }

  // Safety fallback: guaranteed reveal after 600ms regardless of scroll/observer
  setTimeout(revealAll, 600);

  const rect = section.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
    revealAll();
    return;
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealAll();
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.02,
      rootMargin: '100px 0px 0px 0px'
    });

    observer.observe(section);
  } else {
    revealAll();
  }
}

/**
 * 28. Section 8: Global Enterprise Footer Interactions & Smooth Navigation
 */
function initFooter() {
  const footer = document.getElementById('siteFooter');
  if (!footer) return;

  // 1. Back to Top Button
  const topBtn = document.getElementById('footerBackToTopBtn');
  if (topBtn) {
    topBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 2. Footer Service Links (smooth navigation with offset and temporary highlight)
  const serviceLinks = footer.querySelectorAll('.footer-service-link');
  serviceLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceId = link.getAttribute('data-service-id') || link.getAttribute('href');
      if (typeof navigateToService === 'function') {
        navigateToService(serviceId);
      } else {
        const cleanId = (serviceId || '').replace(/^#/, '');
        const target = document.getElementById(cleanId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // 3. Footer Quick Links (smooth scroll to sections)
  const quickLinks = footer.querySelectorAll('.footer-col-links .footer-item-link');
  quickLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        if (href === '#' || href === '#home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const target = document.querySelector(href);
          if (target) {
            const navHeight = 85;
            const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            window.scrollTo({
              top: targetPos,
              behavior: 'smooth'
            });
          }
        }
      }
    });
  });

  // 4. Footer Scroll Reveal with guaranteed fail-safe
  const revealElements = footer.querySelectorAll('.footer-reveal');
  let revealed = false;

  function revealFooter() {
    if (revealed) return;
    revealed = true;
    footer.classList.add('is-revealed');
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // Safety fallback
  setTimeout(revealFooter, 800);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealFooter();
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '120px 0px 0px 0px'
    });

    observer.observe(footer);
  } else {
    revealFooter();
  }
}

/**
 * Leadership Section Scroll Reveal & Interaction Controller
 */
function initLeadershipScrollReveal() {
  const leadershipSection = document.getElementById('leadership');
  if (!leadershipSection) return;

  const revealElements = leadershipSection.querySelectorAll('.leadership-reveal');
  let revealed = false;

  function revealLeadership() {
    if (revealed) return;
    revealed = true;
    leadershipSection.classList.add('is-revealed');
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // Safety fallback after 600ms
  setTimeout(revealLeadership, 600);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealLeadership();
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.06,
      rootMargin: '100px 0px 0px 0px'
    });

    observer.observe(leadershipSection);
  } else {
    revealLeadership();
  }
}







