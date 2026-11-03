const matrixButton=document.querySelector('.matrix-toggle');
let matrixPaused=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function updateMatrix(){document.body.classList.toggle('matrix-paused',matrixPaused);matrixButton.setAttribute('aria-pressed',String(matrixPaused));matrixButton.textContent=matrixPaused?'Ativar fundo':'Pausar fundo';}
matrixButton.addEventListener('click',()=>{matrixPaused=!matrixPaused;updateMatrix();});updateMatrix();

if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){matrixButton.disabled=true;matrixButton.textContent='Fundo estático · movimento reduzido';}
