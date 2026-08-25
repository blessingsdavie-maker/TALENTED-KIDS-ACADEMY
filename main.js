// Shared navigation and page interactions.
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js');
  
  // Detect device capabilities
  const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
  };
  
  const isMobileViewport = window.matchMedia('(max-width: 860px)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Add device class to html element for mobile-specific CSS
  if (isTouchDevice() && isMobileViewport) {
    document.documentElement.classList.add('is-touch-device');
    document.documentElement.classList.add('is-mobile');
  }
  
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    const setMenuState = isOpen => {
      links.classList.toggle('open', isOpen);
      document.body.classList.toggle('menu-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    };

    toggle.addEventListener('click', () => setMenuState(!links.classList.contains('open')));

    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setMenuState(false));
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') setMenuState(false);
    });

    document.addEventListener('pointerdown', event => {
      if (!links.contains(event.target) && !toggle.contains(event.target)) {
        setMenuState(false);
      }
    });
  }

  const tabs = document.querySelectorAll('.band-tab');
  if (tabs.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(item => item.setAttribute('aria-selected', 'false'));
        tab.setAttribute('aria-selected', 'true');

        document.querySelectorAll('.band-panel').forEach(panel => {
          panel.classList.remove('active');
          panel.hidden = true;
        });

        const panel = document.getElementById(tab.dataset.target);
        if (panel) {
          panel.classList.add('active');
          panel.hidden = false;
        }
      });

      tab.addEventListener('keydown', event => {
        const tabIndex = Array.from(tabs).indexOf(tab);
        let nextIndex = tabIndex;

        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          nextIndex = (tabIndex + 1) % tabs.length;
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          nextIndex = (tabIndex - 1 + tabs.length) % tabs.length;
        } else if (event.key === 'Home') {
          nextIndex = 0;
        } else if (event.key === 'End') {
          nextIndex = tabs.length - 1;
        } else {
          return;
        }

        event.preventDefault();
        tabs[nextIndex].focus();
        tabs[nextIndex].click();
      });
    });
  }

  const form = document.getElementById('admissions-form');
  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.querySelectorAll('input, select, textarea').forEach(field => {
          field.setAttribute('aria-invalid', String(!field.checkValidity()));
        });
        form.reportValidity();
        return;
      }

      form.querySelectorAll('input, select, textarea').forEach(field => {
        field.setAttribute('aria-invalid', 'false');
      });

      const success = document.getElementById('form-success');
      if (success) {
        success.classList.add('show');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
    });
  }

  // Scroll reveal with staggered animation (optimized for mobile)
  const revealItems = document.querySelectorAll('.reveal');
  if (prefersReducedMotion) {
    revealItems.forEach(item => item.classList.add('is-visible'));
  } else if ('IntersectionObserver' in window && revealItems.length) {
    const isMobile = window.matchMedia('(max-width: 720px)').matches;
    const observer = new IntersectionObserver(entries => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Reduce stagger delay on mobile for snappier feel
          const delay = isMobile ? Math.min(index, 3) : Math.min(index, 5);
          entry.target.setAttribute('data-delay', delay);
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, delay * (isMobile ? 30 : 50));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  // Animate counter numbers on scroll (optimized for mobile)
  const facts = document.querySelectorAll('.fact strong');
  if (facts.length && !prefersReducedMotion) {
    const isMobileCounter = window.matchMedia('(max-width: 720px)').matches;
    const counterDuration = isMobileCounter ? 800 : 1200;
    
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          const target = entry.target;
          target.classList.add('counted');
          const finalValue = target.textContent;
          const numericValue = parseFloat(finalValue.replace(/[^\d.:]/g, ''));
          
          if (!isNaN(numericValue)) {
            const isRatio = finalValue.includes(':');
            let currentValue = 0;
            const increment = numericValue / 60;
            const startTime = Date.now();

            const animate = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / counterDuration, 1);
              currentValue = Math.floor(numericValue * progress);
              
              if (isRatio) {
                const parts = finalValue.split(':');
                target.textContent = currentValue + ':' + parts[1];
              } else {
                target.textContent = currentValue;
              }

              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                target.textContent = finalValue;
              }
            };
            animate();
          }
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    facts.forEach(fact => counterObserver.observe(fact));
  }

  // Smooth form field focus effects (optimized for mobile)
  const formFields = document.querySelectorAll('.field input, .field select, .field textarea');
  const isMobileDevice = window.matchMedia('(max-width: 600px)').matches;
  
  formFields.forEach(field => {
    field.addEventListener('focus', function() {
      // Only apply scale on desktop for better mobile performance
      if (!isMobileDevice) {
        this.parentElement.style.transform = 'scale(1.01)';
      }
      this.parentElement.style.borderColor = 'var(--leaf)';
    });
    field.addEventListener('blur', function() {
      if (!isMobileDevice) {
        this.parentElement.style.transform = 'scale(1)';
      }
      this.parentElement.style.borderColor = '';
    });
  });

  // Parallax effect on hero background on scroll (disabled on mobile for performance)
  const heroBg = document.querySelector('.hero-bg img');
  const isMobile = window.matchMedia('(max-width: 860px)').matches;
  
  if (heroBg && !isMobile && !prefersReducedMotion) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (window.scrollY < 800) {
        heroBg.style.transform = `translateY(${scrollY * 0.5}px)`;
      }
    }, { passive: true });
  }

  // Animate facts on load
  const factElements = document.querySelectorAll('.fact');
  if (factElements.length) {
    factElements.forEach((fact, index) => {
      fact.style.animationDelay = (index * 0.1) + 's';
    });
  }
});
