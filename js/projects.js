
(() => {
  const cards = Array.from(document.querySelectorAll('.project-card'));
  const filterButtons = document.querySelectorAll('[data-filter]');
  const emptyState = document.querySelector('#empty-state');
  const modal = document.querySelector('#project-modal');
  const closeButton = document.querySelector('.modal-close');
  const previousButton = document.querySelector('#modal-prev');
  const nextButton = document.querySelector('#modal-next');
  const modalKind = document.querySelector('#modal-kind');
  const modalTitle = document.querySelector('#modal-title');
  const modalDescription = document.querySelector('#modal-description');
  const modalMood = document.querySelector('#modal-mood');
  const modalTechnique = document.querySelector('#modal-technique');
  const modalCounter = document.querySelector('#modal-counter');
  const projectData = [
    {
      kind: 'WORSHIP / СВЕТОВАЯ ДРАМАТУРГИЯ',
      title: 'Light / Worship',
      description: 'Концепция для музыкального выступления, где свет движется вместе с эмоциональной дугой композиции. Широкие мягкие лучи создают глубину, а более узкие акценты собирают внимание на сцене.',
      mood: 'Тёплый, воздушный, созерцательный',
      technique: 'Объёмные лучи и плавные переходы'
    },
    {
      kind: 'LIVE / КОНЦЕРТНАЯ СЦЕНА',
      title: 'Pulse / Live',
      description: 'Энергичная концертная концепция с контрастными цветами, ритмичной сменой состояний и чётким фокусом. Геометрия света поддерживает музыкальный ритм, не перегружая композицию сцены.',
      mood: 'Динамичный, плотный, контрастный',
      technique: 'Ритмичные группы приборов и цветовые акценты'
    },
    {
      kind: 'SPACE / СЦЕНИЧЕСКАЯ СРЕДА',
      title: 'Form / Space',
      description: 'Минималистичная сценическая среда, где свет подчёркивает архитектуру, пропорции и линии пространства. Концепция делает визуальную композицию выразительной даже при небольшом количестве элементов.',
      mood: 'Архитектурный, точный, минималистичный',
      technique: 'Контурное освещение и световые рамки'
    }
  ];
  let currentIndex = 0;
  let lastFocusedElement = null;

  function updateVisibleCards(category) {
    let visibleCount = 0;
    cards.forEach((card) => {
      const shouldShow = category === 'all' || card.dataset.category === category;
      card.hidden = !shouldShow;
      if (shouldShow) {
        visibleCount += 1;
        card.classList.remove('is-visible');
        window.requestAnimationFrame(() => card.classList.add('is-visible'));
      }
    });
    if (emptyState) emptyState.hidden = visibleCount !== 0;
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-pressed', String(isActive));
      });
      updateVisibleCards(button.dataset.filter);
    });
  });

  function renderModal(index) {
    currentIndex = (index + projectData.length) % projectData.length;
    const project = projectData[currentIndex];
    modalKind.textContent = project.kind;
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    modalMood.textContent = project.mood;
    modalTechnique.textContent = project.technique;
    modalCounter.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(projectData.length).padStart(2, '0')}`;
  }

  function openModal(index, sourceElement) {
    if (!modal) return;
    lastFocusedElement = sourceElement || document.activeElement;
    renderModal(index);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') lastFocusedElement.focus();
  }

  cards.forEach((card) => {
    const index = Number(card.dataset.project);
    card.addEventListener('click', (event) => {
      openModal(index, card);
    });
    card.addEventListener('keydown', (event) => {
      if (event.target !== card) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal(index, card);
      }
    });
  });

  closeButton.addEventListener('click', closeModal);
  previousButton.addEventListener('click', () => renderModal(currentIndex - 1));
  nextButton.addEventListener('click', () => renderModal(currentIndex + 1));
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  
  document.addEventListener('keydown', (event) => {
    if (modal.hidden) return;
    if (event.key === 'Escape') {
      closeModal();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      renderModal(currentIndex - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      renderModal(currentIndex + 1);
    }
  });
})();
