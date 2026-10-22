/* Общие интерактивные элементы для всех страниц сайта. */
(() => {
  const body = document.body;
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.site-nav');
  const header = document.querySelector('.site-header');
  const toast = document.querySelector('#site-toast');
  let toastTimer;

  // BOM: год берётся из системных часов браузера.
  document.querySelectorAll('[data-year]').forEach((item) => {
    item.textContent = new Date().getFullYear();
  });

  // Мобильное меню управляется кликом и отражает состояние через aria-expanded.
  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Открыть меню' : 'Закрыть меню');
      navigation.classList.toggle('open', !isOpen);
    });

    navigation.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Открыть меню');
        navigation.classList.remove('open');
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 680) {
        navigation.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Открыть меню');
      }
    });
  }

  // BOM: реакция шапки на прокрутку окна.
  const updateHeader = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // DOM: плавно показываем секции, когда они входят в область просмотра.
  const revealItems = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 4, 3) * 75}ms`;
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // Событие мыши: управляем положением мягкого светового пятна в hero-блоках.
  document.querySelectorAll('.spotlight-area').forEach((area) => {
    area.addEventListener('pointermove', (event) => {
      const bounds = area.getBoundingClientRect();
      area.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
      area.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
      area.classList.add('pointer-active');
    });
    area.addEventListener('pointerleave', () => area.classList.remove('pointer-active'));
  });

  // Небольшая реакция карточек на указатель мыши.
  document.querySelectorAll('.hover-card').forEach((card) => {
    card.addEventListener('pointerenter', () => card.classList.add('is-hovered'));
    card.addEventListener('pointerleave', () => card.classList.remove('is-hovered'));
  });

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2400);
  }

  // Клавиатура: Space включает/выключает световой режим, Escape выключает его.
  // Не перехватываем клавиши, когда пользователь работает с формой или кнопкой.
  document.addEventListener('keydown', (event) => {
    const target = event.target;
    const isTyping = target.closest('input, textarea, select, button, a, [contenteditable="true"], [role="button"]');

    if (event.code === 'Space' && !isTyping && !event.repeat) {
      event.preventDefault();
      const enabled = body.classList.toggle('light-mode');
      showToast(enabled ? 'Световой режим включён · Esc выключает' : 'Световой режим выключен');
    }

    if (event.key === 'Escape') {
      body.classList.remove('light-mode');
    }
  });
})();
