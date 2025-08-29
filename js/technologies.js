import { initCommon } from './app.js';
initCommon();

const techs = [
  {name:'React', category:'frontend', pros:['Componentes','Ecosistema'], cons:['Curva','Peso'], level:'intermediário', url:'https://reactjs.org'},
  {name:'Vue', category:'frontend', pros:['Fácil de aprender','Flexível'], cons:['Menor mercado que React','Fragmentação'], level:'intermediário', url:'https://vuejs.org'},
  {name:'Angular', category:'frontend', pros:['Completo','TypeScript'], cons:['Verboso','Curva íngreme'], level:'avançado', url:'https://angular.io'},
  {name:'Node.js', category:'backend', pros:['JS no servidor','Grande ecossistema'], cons:['Callback/async complexity','Não ideal para CPU-bound'], level:'intermediário', url:'https://nodejs.org'},
  {name:'Django', category:'backend', pros:['Rápido para APIs','Batteries-included'], cons:['Mais pesado','Monolítico'], level:'intermediário', url:'https://www.djangoproject.com'},
  {name:'MySQL', category:'db', pros:['Maduro','Relações'], cons:['Escalabilidade vertical','Licença'], level:'básico', url:'https://www.mysql.com'},
  {name:'PostgreSQL', category:'db', pros:['Robusto','Extensível'], cons:['Configuração','Complexidade'], level:'intermediário', url:'https://www.postgresql.org'},
  {name:'MongoDB', category:'db', pros:['Document-oriented','Flexível'], cons:['Consistência','Joins custosos'], level:'intermediário', url:'https://www.mongodb.com'},
  {name:'Docker', category:'devops', pros:['Contêineres','Portabilidade'], cons:['Complexidade','Overhead'], level:'intermediário', url:'https://www.docker.com'},
  {name:'Jest', category:'tests', pros:['Simples','Bom para unit tests'], cons:['Configuração em projetos grandes','Falsos positivos'], level:'básico', url:'https://jestjs.io'},
];

const grid = document.getElementById('tech-grid');
const searchEl = document.getElementById('search');
const filterBtns = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');
const exportBtn = document.getElementById('export-csv');

let currentFilter = localStorage.getItem('tech-filter') || 'all';

function render(){
  if(!grid) return;
  const q = searchEl ? searchEl.value.toLowerCase() : '';
  grid.innerHTML='';
  const favs = JSON.parse(localStorage.getItem('tech-favs')||'[]');
  techs.filter(t=> currentFilter==='all' || t.category===currentFilter)
    .filter(t=> t.name.toLowerCase().includes(q) || (t.pros.join(' ') + t.cons.join(' ')).toLowerCase().includes(q))
    .forEach(t=>{
      const div = document.createElement('article');
      div.className='tech-card';
      div.tabIndex=0;
      div.innerHTML = `
        <button class="favorite" aria-label="Marcar favorito" data-name="${t.name}">${favs.includes(t.name)?'★':'☆'}</button>
        <h4>${t.name} <span class="badge">${t.level}</span></h4>
        <p>${t.pros[0]} · ${t.cons[0]}</p>
        <p><a href="#" class="details" data-name="${t.name}">Detalhes</a></p>
      `;
      grid.appendChild(div);
    });
}

function attach(){
  if(searchEl) searchEl.addEventListener('input', ()=>{ render(); });
  filterBtns.forEach(b=>{
    b.addEventListener('click', ()=>{
      currentFilter = b.dataset.filter;
      localStorage.setItem('tech-filter', currentFilter);
      filterBtns.forEach(x=>x.setAttribute('aria-pressed','false'));
      b.setAttribute('aria-pressed','true');
      render();
    });
  });

  document.addEventListener('click', (e)=>{
    const fav = e.target.closest('.favorite');
    if(fav){
      const name = fav.dataset.name;
      const favs = JSON.parse(localStorage.getItem('tech-favs')||'[]');
      const idx = favs.indexOf(name);
      if(idx===-1) favs.push(name); else favs.splice(idx,1);
      localStorage.setItem('tech-favs', JSON.stringify(favs));
      render();
      return;
    }
    const det = e.target.closest('.details');
    if(det){
      e.preventDefault();
      const name = det.dataset.name;
      const t = techs.find(x=>x.name===name);
      if(t){
        modalTitle.textContent = t.name;
        modalBody.innerHTML = `<p>${t.pros.join('<br>')}</p><p>${t.cons.join('<br>')}</p><p><a href="${t.url}" target="_blank" rel="noopener">Site oficial</a></p>`;
  modal.setAttribute('aria-hidden','false');
  // foco no título para leitura por leitores de tela
  modalTitle.tabIndex = -1; modalTitle.focus();
      }
    }
  });

  modalClose.addEventListener('click', ()=> modal.setAttribute('aria-hidden','true'));
  modal.addEventListener('click', (e)=>{ if(e.target===modal) modal.setAttribute('aria-hidden','true'); });

  if(exportBtn) exportBtn.addEventListener('click', exportCSV);
}

function exportCSV(){
  // Exportar cards visíveis
  const rows = [['nome','categoria','pros','cons']];
  const q = searchEl ? searchEl.value.toLowerCase() : '';
  techs.filter(t=> currentFilter==='all' || t.category===currentFilter)
    .filter(t=> t.name.toLowerCase().includes(q) || (t.pros.join(' ') + t.cons.join(' ')).toLowerCase().includes(q))
    .forEach(t=> rows.push([t.name,t.category, t.pros.join('; '), t.cons.join('; ')]));
  const csv = rows.map(r=> r.map(c=> '"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n');
  const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'tecnologias.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

// Inicialização
render();
attach();
// aplicar último filtro nos botões
filterBtns.forEach(b=>{ if(b.dataset.filter===currentFilter) b.setAttribute('aria-pressed','true'); });
