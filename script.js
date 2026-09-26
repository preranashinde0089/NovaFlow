/**
 * NovaFlow — Modern SaaS Landing Page JavaScript
 * Frontend-only, Vanilla JavaScript with Zero External Dependencies.
 *
 * Table of Contents:
 * 1. Dark / Light Mode Toggle with LocalStorage Persistence
 * 2. Sticky Navbar & Scroll Styling
 * 3. Mobile Hamburger Navigation Drawer
 * 4. Smooth Anchor Scrolling with Navbar Offset
 * 5. ScrollSpy (Active Navigation Link Highlighting)
 * 6. Pricing Billing Toggle (Monthly vs. Annual)
 * 7. FAQ Exclusive Accordion
 * 8. Contact Form Client-Side Validation & Toast
 * 9. Scroll Reveal Animations (IntersectionObserver)
 * 10. Dynamic Current Year in Footer
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. Dark / Light Mode Toggle
     -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('themeToggle');
  const rootElement = document.documentElement;

  // Retrieve saved theme or default to light
  const savedTheme = localStorage.getItem('novaflow_theme');
  if (savedTheme) {
    rootElement.setAttribute('data-theme', savedTheme);
  } else {
    // Default to light theme as requested
    rootElement.setAttribute('data-theme', 'light');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

      rootElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('novaflow_theme', nextTheme);

      // Accessibility label update
      themeToggleBtn.setAttribute(
        'aria-label',
        `Switch to ${nextTheme === 'dark' ? 'light' : 'dark'} theme`
      );
    });
  }

  /* --------------------------------------------------------------------------
     2. Sticky Navbar & Scroll State
     -------------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');

  const handleScrollNavbar = () => {
    if (!navbar) return;
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScrollNavbar, { passive: true });
  handleScrollNavbar(); // Initial run

  /* --------------------------------------------------------------------------
     3. Mobile Navigation Drawer
     -------------------------------------------------------------------------- */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');

  const toggleMobileMenu = () => {
    if (!hamburgerBtn || !navMenu) return;
    const isOpen = navMenu.classList.toggle('open');
    hamburgerBtn.classList.toggle('active', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const closeMobileMenu = () => {
    if (!hamburgerBtn || !navMenu) return;
    navMenu.classList.remove('open');
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleMobileMenu);
  }

  // Close mobile drawer when clicking any nav link
  const navLinks = document.querySelectorAll('.nav-link, .nav-mobile-actions a');
  navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close mobile drawer if clicked outside
  document.addEventListener('click', (e) => {
    if (
      navMenu &&
      navMenu.classList.contains('open') &&
      !navMenu.contains(e.target) &&
      !hamburgerBtn.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });

  // Reset menu if viewport widened to desktop width
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860 && navMenu && navMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  /* --------------------------------------------------------------------------
     4. Smooth Scrolling with Fixed Navbar Offset
     -------------------------------------------------------------------------- */
  const internalAnchorLinks = document.querySelectorAll('a[href^="#"]');

  internalAnchorLinks.forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = navbar ? navbar.offsetHeight : 72;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* --------------------------------------------------------------------------
     5. ScrollSpy (Active Navigation Link Highlighting)
     -------------------------------------------------------------------------- */
  const trackedSections = document.querySelectorAll('section[id], main > [id]');
  const mainNavLinks = document.querySelectorAll('.nav-links .nav-link');

  const highlightActiveNav = () => {
    const headerHeight = navbar ? navbar.offsetHeight : 72;
    const scrollPos = window.scrollY + headerHeight + 50;

    let currentSectionId = '';

    trackedSections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      mainNavLinks.forEach(link => {
        const href = link.getAttribute('href').replace('#', '');
        if (href === currentSectionId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  };

  window.addEventListener('scroll', highlightActiveNav, { passive: true });

  /* --------------------------------------------------------------------------
     6. Pricing Billing Toggle (Monthly / Annual)
     -------------------------------------------------------------------------- */
  const billingToggle = document.getElementById('billingToggle');
  const priceElements = document.querySelectorAll('.plan-price');

  if (billingToggle) {
    billingToggle.addEventListener('click', () => {
      const isAnnual = billingToggle.getAttribute('aria-checked') === 'true';
      const newIsAnnual = !isAnnual;

      billingToggle.setAttribute('aria-checked', String(newIsAnnual));

      priceElements.forEach(el => {
        const monthly = el.getAttribute('data-monthly');
        const annual = el.getAttribute('data-annual');
        el.textContent = newIsAnnual ? annual : monthly;
      });
    });
  }

  /* --------------------------------------------------------------------------
     7. FAQ Exclusive Accordion
     -------------------------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answerPanel = item.querySelector('.faq-answer');

    if (!questionBtn || !answerPanel) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other items first (exclusive accordion behavior)
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          const otherAns = otherItem.querySelector('.faq-answer');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAns) otherAns.style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
        answerPanel.style.maxHeight = null;
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
        answerPanel.style.maxHeight = answerPanel.scrollHeight + 'px';
      }
    });
  });

  /* --------------------------------------------------------------------------
     8. Contact Form Client-Side Validation & Feedback
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const userNameInput = document.getElementById('userName');
  const userEmailInput = document.getElementById('userEmail');
  const userMessageInput = document.getElementById('userMessage');
  const submitBtn = document.getElementById('submitBtn');
  const toastMessage = document.getElementById('toastMessage');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (input, isValid) => {
    const parentGroup = input.closest('.form-group');
    if (!parentGroup) return isValid;

    if (isValid) {
      parentGroup.classList.remove('has-error');
    } else {
      parentGroup.classList.add('has-error');
    }
    return isValid;
  };

  // Real-time error removal on input
  if (userNameInput) {
    userNameInput.addEventListener('input', () => {
      if (userNameInput.value.trim().length >= 2) {
        validateField(userNameInput, true);
      }
    });
  }

  if (userEmailInput) {
    userEmailInput.addEventListener('input', () => {
      if (emailRegex.test(userEmailInput.value.trim())) {
        validateField(userEmailInput, true);
      }
    });
  }

  if (userMessageInput) {
    userMessageInput.addEventListener('input', () => {
      if (userMessageInput.value.trim().length >= 10) {
        validateField(userMessageInput, true);
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = userNameInput ? userNameInput.value.trim() : '';
      const emailVal = userEmailInput ? userEmailInput.value.trim() : '';
      const messageVal = userMessageInput ? userMessageInput.value.trim() : '';

      const isNameValid = validateField(userNameInput, nameVal.length >= 2);
      const isEmailValid = validateField(userEmailInput, emailRegex.test(emailVal));
      const isMessageValid = validateField(userMessageInput, messageVal.length >= 10);

      // If any field fails validation, focus the first invalid field
      if (!isNameValid) {
        userNameInput.focus();
        return;
      }
      if (!isEmailValid) {
        userEmailInput.focus();
        return;
      }
      if (!isMessageValid) {
        userMessageInput.focus();
        return;
      }

      // Simulation of async form submission
      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
        }

        // Show success toast
        if (toastMessage) {
          toastMessage.classList.add('show');
          contactForm.reset();

          // Hide toast after 5 seconds
          setTimeout(() => {
            toastMessage.classList.remove('show');
          }, 5000);
        }
      }, 700);
    });
  }

  /* --------------------------------------------------------------------------
     9. Scroll Reveal Animations (IntersectionObserver)
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for browsers without IntersectionObserver
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  /* --------------------------------------------------------------------------
     10. Dynamic Current Year in Footer
     -------------------------------------------------------------------------- */
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});
