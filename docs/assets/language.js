'use strict';
(() => {
  let dictionary={};
  let lang=new URLSearchParams(location.search).get('lang');
  if(!['en','zh'].includes(lang)){try{lang=localStorage.getItem('cadfds-language');}catch{}lang=lang==='en'?'en':'zh';}
  const originals=new WeakMap();
  const fragments=[['資料集手繪遮罩','Dataset annotation mask'],['加權拉普拉斯標準差','Weighted Laplacian standard deviation'],['原始輸入','Input image'],['線性校正','linear calibration'],['重新最佳化','re-optimized'],['只用 J','J only'],['灰階 DFD','Grayscale DFD'],['色彩分量','chroma channel'],['明度','lightness'],['平均','mean'],['像素','pixels'],['誤差','error'],['原始','raw'],['對焦','focus'],['模糊直徑','Blur diameter'],['估測','Estimate'],['樣本序號','Sample index'],['絕對','Absolute '],['距離','Distance'],['曝光乘數','Exposure multiplier'],['紋理量','Texture'],['自動遮罩含 I/O 耗時','automatic mask including I/O took'],['此為獨立遮罩計時。','This mask timing is measured separately.']];
  window.t=value=>{if(lang!=='en')return value;const text=String(value),trim=text.trim();if(dictionary[trim])return text.replace(trim,dictionary[trim]);let result=text;for(const [a,b] of fragments)result=result.split(a).join(b);return result;};
  function apply(){
    observer.disconnect();
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;
    while(node=walker.nextNode()){if(['SCRIPT','STYLE'].includes(node.parentElement.tagName))continue;let saved=originals.get(node);if(!saved||node.nodeValue!==saved.rendered)saved={source:node.nodeValue};const next=window.t(saved.source);if(node.nodeValue!==next)node.nodeValue=next;saved.rendered=next;originals.set(node,saved);}
    document.documentElement.lang=lang==='en'?'en':'zh-Hant';document.title=lang==='en'?'CA-DFDS — Monocular vehicle distance estimation':'CA-DFDS — 單眼失焦車距估測系統';document.getElementById('language').textContent=lang==='en'?'中文':'EN';
    observer.observe(document.body,{subtree:true,childList:true,characterData:true});
  }
  let queued=false;
  const observer=new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply();});});
  document.getElementById('language').addEventListener('click',()=>{lang=lang==='en'?'zh':'en';try{localStorage.setItem('cadfds-language',lang);}catch{}const url=new URL(location);url.searchParams.set('lang',lang);history.replaceState(null,'',url);apply();window.dispatchEvent(new Event('language-change'));});
  fetch('assets/translations.json').then(r=>{if(!r.ok)throw Error('Translation loading failed');return r.json();}).then(d=>{dictionary=d;apply();window.dispatchEvent(new Event('language-change'));}).catch(()=>{document.getElementById('language').disabled=true;});
})();
