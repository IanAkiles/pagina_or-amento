(() => {
 const section=document.querySelector('#processo');
 const stage=section.querySelector('.process-stage');
 const line=section.querySelector('.journey-line');
 const steps=[...section.querySelectorAll('.process-step')];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let pending=false;
 function render(){
  pending=false;
  if(!section.classList.contains('journey-enabled'))return;
  const distance=section.offsetHeight-innerHeight;
  const progress=Math.max(0,Math.min(1,-section.getBoundingClientRect().top/Math.max(1,distance)));
  section.style.setProperty('--journey-progress',progress);
  const first=steps[0].querySelector('.process-number').getBoundingClientRect();
  const last=steps.at(-1).querySelector('.process-number').getBoundingClientRect();
  const bounds=stage.getBoundingClientRect();
  const vertical=matchMedia('(max-width:760px)').matches;
  const x=first.left+first.width/2-bounds.left, y=first.top+first.height/2-bounds.top;
  line.style.cssText=`left:${x}px;top:${y}px;right:auto;bottom:auto;width:${vertical?3:last.left-first.left}px;height:${vertical?last.top-first.top:3}px`;
  steps.forEach((step,index)=>step.classList.toggle('is-reached',progress>=index/(steps.length-1)));
 }
 function queue(){if(!pending){pending=true;requestAnimationFrame(render)}}
 function configure(){
  section.classList.remove('journey-enabled');
  if(!reduced.matches && innerHeight>=640){
   section.classList.add('journey-enabled');
   const inner=section.querySelector('.process-timeline-inner');
   if(inner.scrollHeight>innerHeight+2)section.classList.remove('journey-enabled');
  }
  queue();
 }
 addEventListener('scroll',queue,{passive:true});
 addEventListener('resize',configure);
 reduced.addEventListener('change',configure);
 document.fonts.ready.then(configure);
 configure();
})();
