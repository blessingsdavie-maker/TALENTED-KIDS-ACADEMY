// Shared navigation and page interactions.
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
          panel.classList.remove('panel-switch');
          requestAnimationFrame(() => panel.classList.add('panel-switch'));
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

  // Make each subject card an accessible, expandable learning detail.
  const subjectDetails = {
    Literacy: 'Builds communication through reading, writing, speaking, and listening.',
    Numeracy: 'Develops confident problem-solving with practical, age-appropriate maths.',
    Science: 'Turns observation and questions into investigations and explanations.',
    Discovery: 'Connects children with their environment through guided exploration.',
    Creative: 'Makes room for imagination through art, music, movement, and design.',
    'Social Studies': 'Helps learners understand their community and their place in it.',
    Enrichment: 'Extends classroom learning through music, PE, ICT, and library time.',
    Language: 'Builds communication and cultural awareness through a second language.',
    Leadership: 'Gives older learners practice in responsibility, research, and presentation.'
  };
  const subjectIcons = {
    Literacy: '&#128214;', Numeracy: '&#128290;', Science: '&#128300;', ICT: '&#128187;',
    Art: '&#127912;', Music: '&#127925;', Discovery: '&#128065;', Creative: '&#127912;',
    'Social Studies': '&#127758;', Enrichment: '&#9733;', Language: '&#128172;', Leadership: '&#9733;'
  };
  document.querySelectorAll('.subject-chip').forEach(card => {
    const tag = card.querySelector('.tag');
    const tagName = tag ? tag.textContent.trim() : 'Learning';
    const title = card.querySelector('h4');
    const titleName = title ? title.textContent.trim() : '';
    const iconName = /ict|coding/i.test(titleName) ? 'ICT' : /music/i.test(titleName) ? 'Music' : /art/i.test(titleName) ? 'Art' : tagName;
    const icon = document.createElement('span');
    icon.className = 'subject-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = subjectIcons[iconName] || '&#10024;';
    card.insertBefore(icon, card.firstChild);

    const more = document.createElement('span');
    more.className = 'subject-more';
    more.textContent = 'View focus';
    more.setAttribute('aria-hidden', 'true');
    const detail = document.createElement('p');
    detail.className = 'subject-detail';
    detail.textContent = subjectDetails[tagName] || 'A practical learning experience designed for this stage.';
    card.append(more, detail);
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-expanded', 'false');

    const toggleSubject = () => {
      const expanded = card.classList.toggle('expanded');
      card.setAttribute('aria-expanded', String(expanded));
    };
    card.addEventListener('click', toggleSubject);
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleSubject();
      }
    });
  });

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
    const observer = new IntersectionObserver(entries => {
      const isMobile = window.matchMedia('(max-width: 720px)').matches;
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
    const counterObserver = new IntersectionObserver(entries => {
      const counterDuration = window.matchMedia('(max-width: 720px)').matches ? 800 : 1200;
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          const target = entry.target;
          target.classList.add('counted');
          const finalValue = target.textContent;
          const numericValue = Number(target.dataset.count || finalValue.replace(/[^\d]/g, ''));
          
          if (!isNaN(numericValue)) {
            const prefix = target.dataset.prefix || '';
            let currentValue = 0;
            const increment = numericValue / 60;
            const startTime = Date.now();

            const animate = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / counterDuration, 1);
              currentValue = Math.floor(numericValue * progress);
              
              target.textContent = prefix + currentValue;

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

  // Form field focus effects are now handled by :focus-within in style.css
  // (previously duplicated here via inline style manipulation on every field).

  // Parallax effect on hero background on scroll (disabled on mobile for performance)
  const heroBg = document.querySelector('.hero-bg img');

  if (heroBg && !prefersReducedMotion) {
    window.addEventListener('scroll', () => {
      const isMobile = window.matchMedia('(max-width: 860px)').matches;
      if (isMobile) {
        heroBg.style.transform = '';
        return;
      }
      const scrollY = window.scrollY;
      if (scrollY < 800) {
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
