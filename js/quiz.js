const form = document.getElementById('quiz-form');
const result = document.getElementById('quiz-result');
const ls = window.localStorage;

if(form) form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const answers = new FormData(form);
  let score = 0;
  if(answers.get('q1')==='b') score+=1;
  if(answers.get('q2')==='b') score+=1;
  if(answers.get('q3')==='a') score+=1;
  // pontuação simples para este exemplo
  result.innerHTML = `Pontuação: ${score}/3`;
  const best = Number(ls.getItem('quiz-best')||0);
  if(score>best){ ls.setItem('quiz-best', String(score)); result.innerHTML += ' — Novo record!'; }
});
