'use strict';
(() => {
 function ready(){
  const scene=get('camera-motion'), slider=get('camera-distance'), setting=get('camera-setting');
  let paused=matchMedia('(prefers-reduced-motion: reduce)').matches, direction=1, last=0;
  function render(){
   const d=Number(slider.value), key=setting.value;
   const row=data.optics.find(r=>Math.abs(Number(r.distance_m)-d)<0.001);
   get('camera-distance-value').textContent=d.toFixed(2)+' m';
   get('camera-blur-value').textContent=format(row?.[key],2)+' px';
   get('camera-car').setAttribute('transform',`translate(${120+(d-1.2)/5.5*230-235} 0)`);
   const focus=key.endsWith('7m')?'7 m':'15 m';
   get('camera-focus-label').textContent=focus;
   const specs=document.querySelectorAll('.camera-spec b');
   specs[1].textContent=key.startsWith('f22')?'f/22':'f/1.4';specs[2].textContent=focus;
   scene.setAttribute('aria-label',`${window.t?.('車距')||'車距'} ${d.toFixed(2)} m; ${focus}; ${format(row?.[key],2)} px`);
   scene.setAttribute('aria-pressed',String(paused));
  }
  scene.setAttribute('role','button');
  function toggle(){paused=!paused;render();}
  scene.addEventListener('click',toggle);
  scene.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
  slider.addEventListener('input',()=>{paused=true;render();});setting.addEventListener('change',render);
  window.addEventListener('language-change',render);
  function tick(now){
   if(now-last>=160){last=now;if(!paused&&motionEnabled&&!document.hidden&&inView(scene)){
    let d=Number(slider.value)+direction*.05;
    if(d>=6.7){d=6.7;direction=-1;}if(d<=1.2){d=1.2;direction=1;}
    slider.value=d.toFixed(2);render();
   }}requestAnimationFrame(tick);
  }
  render();requestAnimationFrame(tick);
 }
 if(window.demoReady)ready();else window.addEventListener('demo-ready',ready,{once:true});
})();
