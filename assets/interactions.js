(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const fine=matchMedia('(hover: hover) and (pointer: fine)');
 const running=new Set();
 function animate(node,frames,options){
  if(reduced.matches||!node.animate)return;
  const animation=node.animate(frames,options);running.add(animation);
  animation.finished.catch(()=>{}).finally(()=>running.delete(animation));
 }
 reduced.addEventListener('change',()=>{if(reduced.matches)running.forEach(a=>a.cancel())});
 // Content stays visible if JS or the animation API is unavailable.
 if('IntersectionObserver' in window){
  const reveals=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   animate(entry.target,[{opacity:.35,translate:'0 22px'},{opacity:1,translate:'0 0'}],{duration:650,easing:'cubic-bezier(.2,.7,.2,1)'});
   reveals.unobserve(entry.target);
  }),{threshold:.12});
  document.querySelectorAll('.value-inner,.projects-headline,.u-ticket-wrapper,.why-head,.why-card,.faq-title,.ian-contact').forEach(el=>reveals.observe(el));
 }
 const bar=document.querySelector('.reading-progress span');
 const sections=[...document.querySelectorAll('#top,#vantagens,#projects,#processo,#diferenciais,#faq,#contact')];
 const nav=[...document.querySelectorAll('.creative-pill a,#ian-menu a')];
 let frame=0;
 function refresh(){
  frame=0;
  const length=document.documentElement.scrollHeight-innerHeight;
  bar.style.transform=`scaleX(${length>0?Math.max(0,Math.min(1,scrollY/length)):0})`;
  let current=sections[0].id;
  sections.forEach(el=>{if(el.getBoundingClientRect().top<=innerHeight*.35)current=el.id});
  nav.forEach(a=>a.hash==='#'+current?a.setAttribute('aria-current','location'):a.removeAttribute('aria-current'));
 }
 function queue(){if(!frame)frame=requestAnimationFrame(refresh)}
 addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue);addEventListener('load',queue);refresh();
 document.querySelectorAll('.u-ticket-wrapper').forEach(wrapper=>{
  let pointerFrame=0,x=0,y=0;
  function clear(){cancelAnimationFrame(pointerFrame);pointerFrame=0;wrapper.classList.remove('pointer-active');wrapper.style.removeProperty('--tilt-x');wrapper.style.removeProperty('--tilt-y')}
  wrapper.addEventListener('pointermove',event=>{
   if(reduced.matches||!fine.matches||event.pointerType!=='mouse')return;
   const bounds=wrapper.getBoundingClientRect();x=(event.clientX-bounds.left)/bounds.width-.5;y=(event.clientY-bounds.top)/bounds.height-.5;
   if(!pointerFrame)pointerFrame=requestAnimationFrame(()=>{pointerFrame=0;wrapper.classList.add('pointer-active');wrapper.style.setProperty('--tilt-x',`${-y*5}deg`);wrapper.style.setProperty('--tilt-y',`${x*5}deg`)});
  });
  wrapper.addEventListener('pointerleave',clear);wrapper.addEventListener('pointercancel',clear);reduced.addEventListener('change',clear);fine.addEventListener('change',clear);
 });
 const menu=document.querySelector('#ian-menu'),toggle=document.querySelector('.ian-menu-toggle');
 const close=()=>{menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menu')};
 new MutationObserver(()=>{if(!menu.hidden)animate(menu,[{opacity:0,translate:'0 -8px'},{opacity:1,translate:'0 0'}],{duration:200,easing:'ease-out'})}).observe(menu,{attributes:true,attributeFilter:['hidden']});
 document.addEventListener('pointerdown',event=>{if(!menu.hidden&&!menu.contains(event.target)&&!toggle.contains(event.target))close()});
 menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>toggle.setAttribute('aria-label','Abrir menu')));
 document.querySelectorAll('.faq-answer').forEach(answer=>{
  new MutationObserver(()=>{if(!answer.hidden)animate(answer,[{opacity:0,translate:'0 -6px'},{opacity:1,translate:'0 0'}],{duration:240,easing:'ease-out'})}).observe(answer,{attributes:true,attributeFilter:['hidden']});
 });
 const message=document.querySelector('#contact-message');
 document.querySelectorAll('.u-window-content a[href="#contact"]').forEach(link=>link.addEventListener('click',()=>{
  if(message.value.trim())return;
  const service=link.closest('.u-window').querySelector('h3').textContent.trim();
  message.value=`Tenho interesse em ${service.toLocaleLowerCase('pt-BR')}. `;
  message.dispatchEvent(new Event('input',{bubbles:true}));
  let note=document.querySelector('.service-selection-note');
  if(!note){note=document.createElement('p');note.className='service-selection-note';note.setAttribute('role','status');message.after(note)}
  note.textContent=`Assunto selecionado: ${service}. Você pode editar a mensagem.`;
 }));
})();
