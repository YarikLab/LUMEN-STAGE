
(() => {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  const nameInput = document.querySelector('#name');
  const emailInput = document.querySelector('#email');
  const typeInput = document.querySelector('#event-type');
  const messageInput = document.querySelector('#message');
  const messageCount = document.querySelector('#message-count');
  const successPanel = document.querySelector('#form-success');
  const successText = document.querySelector('#success-text');
  const editButton = document.querySelector('#edit-form');
  const fields = [
    { input: nameInput, error: document.querySelector('#name-error') },
    { input: emailInput, error: document.querySelector('#email-error') },
    { input: typeInput, error: document.querySelector('#event-type-error') }
  ];

  function setFieldError(input, message) {
    const field = fields.find((item) => item.input === input);
    if (!field) return;
    field.error.textContent = message;
    input.classList.toggle('invalid', Boolean(message));
    input.setAttribute('aria-invalid', String(Boolean(message)));
  }

  function validateField(input) {
    const value = input.value.trim();
    if (input === nameInput) {
      const message = value.length < 2 ? 'Введите имя из двух или более символов.' : '';
      setFieldError(input, message);
      return !message;
    }
    if (input === emailInput) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const message = !emailPattern.test(value) ? 'Введите корректный адрес электронной почты.' : '';
      setFieldError(input, message);
      return !message;
    }
    if (input === typeInput) {
      const message = !value ? 'Выберите тип мероприятия.' : '';
      setFieldError(input, message);
      return !message;
    }
    return true;
  }

  fields.forEach(({ input }) => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('invalid')) validateField(input);
    });
    input.addEventListener('change', () => {
      if (input.classList.contains('invalid')) validateField(input);
    });
  });

  messageInput.addEventListener('input', () => {
    messageCount.textContent = String(messageInput.value.length);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const valid = fields.map(({ input }) => validateField(input)).every(Boolean);
    if (!valid) {
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const name = nameInput.value.trim();
    const eventType = typeInput.value;
    successText.textContent = `${name}, данные проверены. Формат «${eventType}» добавлен в демонстрационную анкету. Заявка не отправлялась.`;
    successPanel.hidden = false;
    successPanel.classList.remove('success-pop');
    window.requestAnimationFrame(() => successPanel.classList.add('success-pop'));
    successPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  editButton.addEventListener('click', () => {
    successPanel.hidden = true;
    nameInput.focus();
  });


  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || form.contains(event.target) === false) return;
    const hasContent = [nameInput, emailInput, typeInput, messageInput].some((input) => input.value !== '');
    if (hasContent && window.confirm('Очистить заполненную анкету?')) {
      form.reset();
      fields.forEach(({ input }) => setFieldError(input, ''));
      messageCount.textContent = '0';
      successPanel.hidden = true;
      nameInput.focus();
    }
  });
})();
