'use strict';
let motionEnabled = !matchMedia('(prefers-reduced-motion: reduce)').matches;
let stepEnabled = true;
const inView = el => {const r=el.getBoundingClientRect();return r.top<innerHeight*.95&&r.bottom>110;};
const tr = s => window.t ? window.t(s) : s;
const startExperience=()=>{
  const stageNames=['輸入','遮罩','明度 J','彩度 a','彩度 b','清晰度','距離'];
  get('pipeline').replaceChildren(...stageNames.map((name,index)=>{const b=stamp('button',name);b.dataset.stage=index;b.type='button';b.addEventListener('click',()=>{stepEnabled=false;get('step').value=index;updateSteps();updateButtons();});return b;}));
  updateSteps();
  const scoreKeys={cadfds:'opt',unidepth:'unidepth_lin',depthpro:'depthpro_lin',stmap:'stmap'};
  const max=Math.max(...methods.map(([key])=>data.comparison.test480_rmse_m[scoreKeys[key]]));
  methods.forEach(([key,name,color])=>{const value=data.comparison.test480_rmse_m[scoreKeys[key]];const card=document.createElement('article');card.className='score-card'+(key==='cadfds'?' ours':'');card.innerHTML=`<small>${name}</small><strong>${format(value)} <small style="display:inline">m</small></strong><small>480 張 · RMSE ↓</small><div class="score-track"><i style="--bar:${color};width:${value/max*100}%"></i></div>`;get('benchmark-bars').append(card);});
  document.querySelectorAll('video').forEach(v=>{if(v.closest('.full-intro'))return;v.muted=true;v.loop=true;v.playsInline=true;v.dataset.auto='true';v.addEventListener('pause',()=>{if(!v.dataset.programPause&&inView(v)&&motionEnabled)v.dataset.userPaused='true';});v.addEventListener('play',()=>{delete v.dataset.userPaused;if(!motionEnabled)v.dataset.manualPlaying='true';});});
  let comparisonAuto=true;
  function updateButtons(){
    get('motion').textContent=tr(motionEnabled?'暫停動畫':'播放動畫');get('motion').setAttribute('aria-pressed',String(motionEnabled));
    get('step-play').textContent=tr(stepEnabled?'暫停流程':'播放流程');get('step-play').setAttribute('aria-pressed',String(stepEnabled));
    document.documentElement.dataset.motion=motionEnabled?'running':'paused';
    get('comparison-state').textContent=tr(motionEnabled&&comparisonAuto?'自動重播 · 點擊畫面暫停':'已暫停 · 點擊畫面繼續');
    get('comparison-stage').setAttribute('aria-pressed',String(motionEnabled&&comparisonAuto));
  }
  function syncMedia(){
    document.querySelectorAll('video[data-auto]').forEach(v=>{const should=(motionEnabled||v.dataset.manualPlaying)&&!document.hidden&&inView(v)&&!v.dataset.userPaused;if(should){if(v.paused)v.play().catch(()=>{});}else if(!v.paused){v.dataset.programPause='1';v.pause();setTimeout(()=>delete v.dataset.programPause,100);}});
    // Watch the comparison display itself, not a card row below the original input image.
    const shouldCompare=motionEnabled&&!document.hidden&&inView(get('comparison-stage'))&&comparisonAuto;
    if(shouldCompare&&!playback)togglePlayback();else if(!shouldCompare&&playback)togglePlayback();
  }
  function toggleComparison(){comparisonAuto=!(motionEnabled&&comparisonAuto);if(comparisonAuto)motionEnabled=true;updateButtons();syncMedia();}
  const stage=get('comparison-stage');stage.addEventListener('click',toggleComparison);stage.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();toggleComparison();}});
  get('motion').addEventListener('click',()=>{motionEnabled=!motionEnabled;if(!motionEnabled)document.querySelectorAll('video').forEach(v=>delete v.dataset.manualPlaying);updateButtons();syncMedia();});
  get('step-play').addEventListener('click',()=>{stepEnabled=!stepEnabled;if(stepEnabled)motionEnabled=true;updateButtons();});
  get('step').addEventListener('input',()=>{stepEnabled=false;updateButtons();});
  // Selecting a color keeps playback running; dragging the distance slider freezes the chosen sample.
  get('frame').addEventListener('input',()=>{comparisonAuto=false;updateButtons();syncMedia();});
  get('play').addEventListener('click',()=>{comparisonAuto=Boolean(playback);updateButtons();});
  setInterval(()=>{if(motionEnabled&&stepEnabled&&!document.hidden&&inView(get('method'))){get('step').value=(Number(get('step').value)+1)%7;updateSteps();}},1800);
  setInterval(syncMedia,350);document.addEventListener('visibilitychange',syncMedia);updateButtons();syncMedia();
  window.addEventListener('language-change',()=>{updateButtons();plots.forEach((args,canvas)=>plot(canvas,...args));});
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)document.querySelectorAll('.nav-links a').forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id));}),{rootMargin:'-15% 0px -65% 0px'});document.querySelectorAll('main section[id]').forEach(s=>observer.observe(s));
  window.dispatchEvent(new Event('content-ready'));
};
if(window.demoReady)startExperience();else window.addEventListener('demo-ready',startExperience,{once:true});
