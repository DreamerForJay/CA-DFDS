'use strict';
(() => {
  const root=document.documentElement;
  let theme='dark';try{theme=localStorage.getItem('cadfds-theme')||'dark';}catch{}
  function themeButton(){get('theme').textContent=window.t?window.t(root.dataset.theme==='light'?'深色模式':'明亮模式'):(root.dataset.theme==='light'?'深色模式':'明亮模式');get('theme').setAttribute('aria-pressed',String(root.dataset.theme==='light'));}
  function setTheme(value){root.dataset.theme=value;try{localStorage.setItem('cadfds-theme',value);}catch{}themeButton();if(window.demoReady){plots.forEach((args,canvas)=>plot(canvas,...args));if(window.drawColorChart)window.drawColorChart();}}
  setTheme(theme==='light'?'light':'dark');
  get('theme').addEventListener('click',()=>setTheme(root.dataset.theme==='light'?'dark':'light'));
  window.addEventListener('language-change',()=>{themeButton();if(window.demoReady)window.drawColorChart();});
  // A local reflection follows the pointer; it never changes chart values or image colors.
  let pending=false,lastEvent;
  document.addEventListener('pointermove',event=>{if(event.pointerType==='touch'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;lastEvent=event;if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;const el=lastEvent.target.closest('.card,.score-card,.method-panel,[data-flow]');if(!el)return;const r=el.getBoundingClientRect();el.style.setProperty('--mx',(lastEvent.clientX-r.left)+'px');el.style.setProperty('--my',(lastEvent.clientY-r.top)+'px');});},{passive:true});
  let hitAreas=[];
  window.drawColorChart=()=>{
    const canvas=get('color-chart');if(!canvas||!window.demoReady)return;
    const multi=get('analysis-select').value==='error_19colors.jpg';canvas.hidden=multi;get('analysis-image').hidden=!multi;if(multi)return;
    const width=canvas.clientWidth,height=canvas.clientHeight;if(!width)return;
    const ratio=devicePixelRatio||1;canvas.width=width*ratio;canvas.height=height*ratio;const ctx=canvas.getContext('2d');ctx.scale(ratio,ratio);
    const light=root.dataset.theme==='light',ink=light?'#40516a':'#c4d5ec',line=light?'#c4d5e6':'#354c69';
    const keys=['opt','unidepth_lin','stmap','depthpro_lin'],names=['CA-DFDS','UniDepth V2','STMAP','Depth Pro'];const colors=light?['#ce2347','#0078b8','#9b6500','#8541bb']:['#ff5675','#79d4ff','#ffd381','#c4a0ff'];
    const groups=['red','green','blue','black'],label=['紅','綠','藍','黑'];const tr=s=>window.t?window.t(s):s;
    const left=44,right=width-15,top=78,bottom=height-40,max=1.1;const y=v=>bottom-(bottom-top)*v/max;
    ctx.font='13px Segoe UI, sans-serif';keys.forEach((key,i)=>{const x=10+(i%2)*(width/2),yy=20+Math.floor(i/2)*22;ctx.fillStyle=colors[i];ctx.fillRect(x,yy-9,10,10);ctx.fillStyle=ink;ctx.fillText(names[i],x+17,yy);});
    for(let i=0;i<=5;i++){const value=i*.2,yy=y(value);ctx.strokeStyle=line;ctx.beginPath();ctx.moveTo(left,yy);ctx.lineTo(right,yy);ctx.stroke();ctx.fillStyle=ink;ctx.fillText(value.toFixed(1),8,yy+4);}
    ctx.fillText('RMSE (m)',8,top-9);hitAreas=[];const groupWidth=(right-left)/4,barWidth=Math.min(25,groupWidth/5.5);
    groups.forEach((group,g)=>{const start=left+g*groupWidth+(groupWidth-4*barWidth)/2;keys.forEach((key,i)=>{const value=data.analysis.error_by_color[key][group],x=start+i*barWidth,yy=y(value),w=barWidth-3;ctx.fillStyle=colors[i];ctx.fillRect(x,yy,w,bottom-yy);hitAreas.push({x,y:yy,w,h:bottom-yy,text:`${names[i]} · ${tr(label[g])}: ${value.toFixed(3)} m`});});ctx.fillStyle=ink;ctx.textAlign='center';ctx.fillText(tr(label[g]),left+g*groupWidth+groupWidth/2,height-14);ctx.textAlign='left';});
  };
  function ready(){window.drawColorChart();const canvas=get('color-chart');const tip=document.createElement('div');tip.className='chart-tooltip';tip.hidden=true;canvas.parentElement.append(tip);canvas.addEventListener('pointermove',e=>{const hit=hitAreas.find(r=>e.offsetX>=r.x&&e.offsetX<=r.x+r.w&&e.offsetY>=r.y&&e.offsetY<=r.y+r.h);tip.hidden=!hit;if(hit){tip.textContent=hit.text;tip.style.left=Math.max(6,Math.min(canvas.parentElement.clientWidth-250,e.offsetX))+'px';tip.style.top=(canvas.offsetTop+e.offsetY-45)+'px';}});canvas.addEventListener('pointerleave',()=>tip.hidden=true);window.addEventListener('resize',window.drawColorChart);}
  if(window.demoReady)ready();else window.addEventListener('demo-ready',ready,{once:true});
})();
