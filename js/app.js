// Funções comuns: tema, nav, accordion, checklist, fluxo tooltip, tema salvo
const ls = window.localStorage;

export function initCommon() {
  // Tema
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const saved = ls.getItem('theme');
  if (saved) root.setAttribute('data-theme', saved);
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      ls.setItem('theme', next);
      themeToggle.setAttribute('aria-pressed', next === 'dark');
    });
  }

  // Nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const siteNav = document.getElementById('site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      if (!expanded) siteNav.style.display = 'block'; else siteNav.style.display = '';
    });
  }

  // Teclas de atalho: / para buscar, Alt+M para abrir menu, Home para subir
  document.addEventListener('keydown', (e)=>{
    // '/' foco no primeiro input search
    if(e.key === '/'){
      const search = document.getElementById('search');
      if(search){ e.preventDefault(); search.focus(); }
    }
    // Alt+M abre o menu
    if(e.altKey && e.key.toLowerCase() === 'm'){
      if(navToggle){ navToggle.click(); const firstLink = siteNav && siteNav.querySelector('a'); if(firstLink) firstLink.focus(); }
    }
    // Home sobe ao topo
    if(e.key === 'Home'){
      window.scrollTo({top:0,behavior:'smooth'});
    }
  });

  // Accordion
  document.querySelectorAll('.accordion-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.accordion-item');
      const open = item.getAttribute('aria-open') === 'true';
      item.setAttribute('aria-open', String(!open));
      btn.setAttribute('aria-expanded', String(!open));
    });
  });

  // Checklist
  document.querySelectorAll('.checklist input[type="checkbox"]').forEach(cb => {
    const key = cb.dataset.key;
    if (!key) return;
    cb.checked = ls.getItem(key) === 'true';
    cb.addEventListener('change', () => {
      ls.setItem(key, cb.checked);
      updateChecklistProgress();
    });
  });
  updateChecklistProgress();

  // Flow tooltip
  document.querySelectorAll('.flow-svg .step').forEach(el => {
    el.addEventListener('mouseenter', showStep);
    el.addEventListener('focus', showStep);
    el.addEventListener('mouseleave', hideStep);
    el.addEventListener('blur', hideStep);
  });
}

function showStep(e) {
  const tooltip = document.getElementById('tooltip');
  const step = e.currentTarget.dataset.step;
  tooltip.textContent = step + ': entregar documentação mínima, riscos comuns...';
}
function hideStep() {
  const tooltip = document.getElementById('tooltip');
  tooltip.textContent = '';
}

function updateChecklistProgress(){
  const items = document.querySelectorAll('.checklist input[type="checkbox"]');
  const checked = [...items].filter(i => i.checked).length;
  const percent = items.length ? Math.round((checked / items.length) * 100) : 0;
  const el = document.getElementById('progress');
  if (el) el.textContent = `Progresso: ${percent}%`;
}

// Auto-init se estiver no documento
if (document.readyState !== 'loading') initCommon(); else document.addEventListener('DOMContentLoaded', initCommon);
