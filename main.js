// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // Academics grade-band tabs
  const tabs = document.querySelectorAll('.band-tab');
  if (tabs.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.setAttribute('aria-selected', 'false'));
        tab.setAttribute('aria-selected', 'true');
        document.querySelectorAll('.band-panel').forEach(p => p.classList.remove('active'));
        const panel = document.getElementById(tab.dataset.target);
        if (panel) panel.classList.add('active');
      });
    });
  }

  // Admissions form — no backend on a local file, so confirm client-side
  const form = document.getElementById('admissions-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = document.getElementById('form-success');
      if (success) {
        success.classList.add('show');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
    });
  }

  const uploadPreview = (inputId, previewId) => {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    if (!input || !preview) return;
    input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      if (!file) {
        preview.textContent = 'No image selected';
        preview.style.backgroundImage = 'none';
        return;
      }
      const url = URL.createObjectURL(file);
      preview.innerHTML = `<img src="${url}" alt="Selected ${inputId} photo">`;
    });
  };

  uploadPreview('director-photo', 'director-preview');
  uploadPreview('gm-photo', 'gm-preview');
