(() => {
  'use strict';
  const base = 'assets/demo/';
  const clips = [
    {src:base+'C-A1_teaser/video.mp4',poster:base+'C-A1_teaser/poster.jpg',title:'01 / 單張影像到車距',note:'CARLA · 12 個離散距離影像 · 6.7 → 1.2 m'},
    {src:base+'C-E1_method_compare/video.mp4',poster:base+'C-E1_method_compare/poster.jpg',title:'02 / 同一幀，四種方法',note:'CARLA · 四車色 48 張展示樣本 · 非連續行駛錄影'},
    {src:'assets/intro.mp4',poster:'assets/intro_poster.jpg',title:'03 / 完整作品介紹',note:'作品簡介、核心方法與成果說明'}
  ];
  const video=document.querySelector('#showcase-video');
  document.querySelectorAll('[data-clip]').forEach(button=>button.addEventListener('click',()=>{
    const clip=clips[Number(button.dataset.clip)];
    video.pause();video.src=clip.src;video.poster=clip.poster;video.load();
    document.querySelector('#clip-title').textContent=clip.title;
    document.querySelector('#clip-note').textContent=clip.note;
    document.querySelector('#media-status').textContent='';
    document.querySelectorAll('[data-clip]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  }));
  video.addEventListener('error',()=>{document.querySelector('#media-status').textContent='影片暫時無法載入，請重新整理或切換其他影片。';});
  const steps=[
    ['0_input.jpg','原始失焦影像','固定 f/1.4 光圈，對焦於 15 m；車輛位於對焦平面前方。'],
    ['1_mask.jpg','保留車輛區域','使用資料集手繪遮罩限定量測區域，降低背景對清晰度的影響。'],
    ['2_J.jpg','明度 J','轉換至 CIECAM02 色彩外觀空間，取得明度通道。'],
    ['3_ac.jpg','彩度 a꜀','保留紅綠方向的色彩資訊，作為清晰度計算的一部分。'],
    ['4_bc.jpg','彩度 b꜀','保留黃藍方向的色彩資訊，與其他通道加權組合。'],
    ['5_sharpness.jpg','色彩感知清晰度','計算加權拉普拉斯響應，以遮罩內的標準差 σ 描述清晰度。'],
    ['6_result.jpg','由清晰度換算距離','將 σ 代入既有校正曲線，得到這張影像的車距估測。']
  ];
  let step=0, samples=null;
  function render(){
    const distance=document.querySelector('#sample-distance').value;
    const [file,title,description]=steps[step];
    const img=document.querySelector('#process-image');img.src=base+'C-C1_input_output/steps/'+distance+'/'+file;img.alt=distance+' · '+title;
    document.querySelector('#process-number').textContent=`STEP 0${step+1} / 07`;
    document.querySelector('#process-title').textContent=title;
    document.querySelector('#process-description').textContent=description;
    document.querySelectorAll('[data-process]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.process)===step)));
    if(samples){const s=samples[distance];document.querySelector('#sample-numbers').innerHTML=`<div><b>${s.gt_m.toFixed(1)} m</b><span>真實距離</span></div><div><b>${s.pred_m.toFixed(2)} m</b><span>估測距離</span></div>`;}
  }
  document.querySelectorAll('[data-process]').forEach(b=>b.addEventListener('click',()=>{step=Number(b.dataset.process);render();}));
  document.querySelector('#sample-distance').addEventListener('change',render);
  fetch(base+'C-C1_input_output/steps.json').then(r=>{if(!r.ok)throw Error('samples');return r.json();}).then(data=>{samples=data;render();}).catch(()=>{document.querySelector('#sample-numbers').textContent='樣本數據未載入；仍可逐步檢視影像。';});
})();
