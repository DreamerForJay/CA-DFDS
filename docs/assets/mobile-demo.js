'use strict';
(() => {
 const ready=()=>{
  const dialog=get('image-dialog'),large=get('zoomed-image');let opener;
  function zoom(img,button){opener=button;large.src=img.src;large.alt=img.alt;dialog.showModal();}
  document.querySelectorAll('[data-zoom]').forEach(b=>b.addEventListener('click',()=>zoom(get(b.dataset.zoom),b)));
  document.querySelector('.architecture a').addEventListener('click',e=>{e.preventDefault();zoom(e.currentTarget.querySelector('img'),e.currentTarget);});
  const close=()=>{dialog.close();opener?.focus();};get('close-image').addEventListener('click',close);dialog.addEventListener('click',e=>{if(e.target===dialog)close();});
  let holding=false,release;const chart=get('optics-chart');
  function inspect(e){if(e.pointerType==='touch'&&e.type==='pointermove'&&!e.buttons)return;holding=true;clearTimeout(release);const r=chart.getBoundingClientRect(),f=Math.max(0,Math.min(1,(e.clientX-r.left-51)/(r.width-66)));get('optics').value=(1+Math.round(f*120)*.05).toFixed(2);updateOptics();}
  chart.addEventListener('pointermove',inspect);chart.addEventListener('pointerdown',inspect);chart.addEventListener('pointerleave',()=>holding=false);chart.addEventListener('pointerup',()=>{release=setTimeout(()=>holding=false,900);});
  get('optics').addEventListener('input',()=>{holding=true;clearTimeout(release);release=setTimeout(()=>holding=false,1500);});
  setInterval(()=>{if(!motionEnabled||holding||document.hidden||!inView(chart))return;get('optics').value=(Number(get('optics').value)>=7?1:Number(get('optics').value)+.05).toFixed(2);updateOptics();},100);
  document.querySelectorAll('video').forEach(v=>{v.setAttribute('muted','');v.setAttribute('autoplay','');v.setAttribute('loop','');v.setAttribute('playsinline','');v.defaultMuted=true;});
 };
 if(window.demoReady)ready();else window.addEventListener('demo-ready',ready,{once:true});
})();
