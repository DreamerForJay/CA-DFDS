'use strict';
(() => {
 const ready=()=>{
  const colors=get('tool-color'),distances=get('tool-distance'),slider=get('tool-slider');
  const levels=[...new Set(data.frames.map(r=>Number(r.gt_m)))].sort((a,b)=>a-b);
  levels.forEach(v=>distances.add(new Option(v.toFixed(1)+' m',v.toFixed(1))));distances.value='3.7';
  function render(){
   const d=Number(distances.value),color=colors.value,row=data.frames.find(r=>r.color===color&&Number(r.gt_m)===d);
   if(!row)return;slider.value=levels.indexOf(d);get('tool-distance-output').value=d.toFixed(1)+' m';
   get('tool-image').src=root+'scenario_replays/'+color+'_'+d.toFixed(1)+'m.jpg';
   get('tool-estimate').textContent=format(row.cadfds_m)+' m';get('tool-ground-truth').textContent=d.toFixed(1)+' m';get('tool-error').textContent=signed(Number(row.cadfds_err_m))+' m';get('tool-image-tag').textContent='CA-DFDS '+format(row.cadfds_m)+' m';
   const box=data.boxes[color+'_'+d.toFixed(1)];Object.assign(get('tool-box').style,{left:box[0]*100+'%',top:box[1]*100+'%',width:(box[2]-box[0])*100+'%',height:(box[3]-box[1])*100+'%'});get('tool-box').hidden=!get('tool-box-toggle').checked;
   const showMask=get('tool-mask-toggle').checked,available=color==='red'&&[1.2,3.7,6.7].includes(d);get('tool-mask-panel').hidden=!showMask;get('tool-mask-image').hidden=!available;
   if(available)get('tool-mask-image').src=root+'C-C1_input_output/steps/'+d.toFixed(1)+'m/1_mask.jpg';
   get('tool-mask-status').textContent=tr(available?'資料集手繪遮罩展示':'此樣本尚無公開遮罩圖；可查看紅車 1.2、3.7、6.7 m 的既有遮罩。');
   table(get('tool-table'),['方法','估測 (m)','誤差 (m)'],methods.map(([key,name])=>[key==='cadfds'?'CA-DFDS':key==='unidepth'?'UniDepth V2':key==='stmap'?'STMAP':'Depth Pro',format(row[key+'_m']),signed(Number(row[key+'_err_m']))]));
   labelTables();
  }
  for(const id of ['tool-color','tool-distance','tool-box-toggle','tool-mask-toggle'])get(id).addEventListener('change',render);
  slider.addEventListener('input',()=>{distances.value=levels[Number(slider.value)].toFixed(1);render();});
  function labelTables(){document.querySelectorAll('table').forEach(t=>{const headings=[...t.querySelectorAll('thead th')].map(e=>e.textContent);t.querySelectorAll('tbody tr').forEach(row=>[...row.cells].forEach((cell,i)=>cell.dataset.label=tr(headings[i]||'')));});}
  window.addEventListener('language-change',()=>{render();requestAnimationFrame(labelTables);});
  const observer=new MutationObserver(()=>requestAnimationFrame(labelTables));document.querySelectorAll('table').forEach(t=>observer.observe(t,{childList:true,subtree:true,characterData:true}));
  render();
  let frame=0,pointer={x:0,y:0};document.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;pointer={x:e.clientX,y:e.clientY};if(frame)return;frame=requestAnimationFrame(()=>{document.documentElement.style.setProperty('--pointer-x',pointer.x+'px');document.documentElement.style.setProperty('--pointer-y',pointer.y+'px');frame=0;});},{passive:true});
 };
 if(window.demoReady)ready();else window.addEventListener('demo-ready',ready,{once:true});
})();
