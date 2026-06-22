// ============================================================
// NAV — scroll behavior & mobile menu
// ============================================================
const nav    = document.getElementById('nav');
const burger = document.getElementById('burger');
const menu   = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 40
    ? '0 2px 24px rgba(0,0,0,0.4)'
    : 'none';
}, { passive: true });

burger.addEventListener('click', () => {
  const open = menu.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', open);
});

// Close mobile menu on link click
menu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

// ============================================================
// FAQ — accordion
// ============================================================
document.querySelectorAll('.faq__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer  = btn.nextElementSibling;
    const isOpen  = btn.getAttribute('aria-expanded') === 'true';

    // Close all others
    document.querySelectorAll('.faq__question').forEach(other => {
      if (other !== btn) {
        other.setAttribute('aria-expanded', 'false');
        other.nextElementSibling.hidden = true;
      }
    });

    btn.setAttribute('aria-expanded', !isOpen);
    answer.hidden = isOpen;
  });
});

// ============================================================
// FORM — validation + phone mask + submit
// ============================================================
const form = document.getElementById('formContato');

// Phone mask
const phoneInput = document.getElementById('telefone');
phoneInput?.addEventListener('input', e => {
  let v = e.target.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 10) {
    v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  } else if (v.length > 6) {
    v = v.replace(/^(\d{2})(\d{4})(\d+)$/, '($1) $2-$3');
  } else if (v.length > 2) {
    v = v.replace(/^(\d{2})(\d+)$/, '($1) $2');
  }
  e.target.value = v;
});

function showError(field, msg) {
  field.classList.add('is-error');
  const err = field.parentElement.querySelector('.form__error');
  if (err) { err.textContent = msg; err.classList.add('visible'); }
}

function clearError(field) {
  field.classList.remove('is-error');
  const err = field.parentElement.querySelector('.form__error');
  if (err) { err.textContent = ''; err.classList.remove('visible'); }
}

form?.addEventListener('submit', async e => {
  e.preventDefault();

  const nome     = form.querySelector('#nome');
  const email    = form.querySelector('#email');
  const telefone = form.querySelector('#telefone');
  let valid = true;

  [nome, email, telefone].forEach(clearError);

  if (!nome.value.trim() || nome.value.trim().length < 3) {
    showError(nome, 'Por favor, informe seu nome completo.');
    valid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    showError(email, 'Por favor, informe um e-mail válido.');
    valid = false;
  }

  const digits = telefone.value.replace(/\D/g, '');
  if (digits.length < 10) {
    showError(telefone, 'Por favor, informe um WhatsApp válido com DDD.');
    valid = false;
  }

  if (!valid) return;

  const label   = form.querySelector('.btn__label');
  const loading = form.querySelector('.btn__loading');
  const btn     = form.querySelector('[type="submit"]');

  btn.disabled   = true;
  label.hidden   = true;
  loading.hidden = false;

  // Build WhatsApp message and open
  const interesse = form.querySelector('#interesse');
  const msg = encodeURIComponent(
    `Olá! Me chamo ${nome.value.trim()} e gostaria de agendar uma consulta com o Dr. Dias Junior.\n\n` +
    `E-mail: ${email.value}\n` +
    `WhatsApp: ${telefone.value}\n` +
    (interesse?.value ? `Interesse: ${interesse.options[interesse.selectedIndex].text}` : '')
  );

  // Brief delay for UX feedback then redirect to WhatsApp
  await new Promise(r => setTimeout(r, 800));
  window.open(`https://wa.me/5532998493673?text=${msg}`, '_blank');

  // Reset
  form.reset();
  btn.disabled   = false;
  label.hidden   = false;
  loading.hidden = true;
});

// ============================================================
// INTERSECTION OBSERVER — subtle fade-in on scroll
// ============================================================
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity  = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.pilar, .depoimento, .faq__item, .transformacao').forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});
