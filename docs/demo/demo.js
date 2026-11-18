"use strict";
const get = id => document.getElementById(id);
const root = "../assets/demo/";
const methods = [
  ["cadfds", "CA-DFDS (本作品)", "#7af4c1"], ["unidepth", "UniDepthV2 (2025)", "#7bc5ff"],
  ["depthpro", "Depth Pro (2024)", "#d3a9ff"], ["stmap", "STMAP (1994)", "#ffce78"]
];
const labels = {opt:"CA-DFDS", reopt5:"CA-DFDS 重新最佳化", jonly:"CA-DFDS 只用 J", gray:"灰階 DFD",
  unidepth_lin:"UniDepth V2 · 線性校正", depthpro_lin:"Depth Pro · 線性校正", stmap:"STMAP",
  unidepth_raw:"UniDepth V2 · 原始", depthpro_raw:"Depth Pro · 原始"};
const format = (value, digits=3) => value === "" || value == null || !Number.isFinite(Number(value)) ? "—" : Number(value).toFixed(digits);
const signed = value => (value >= 0 ? "+" : "") + format(value);
const stamp = (tag, value) => Object.assign(document.createElement(tag), {textContent:value});
let data;
let playback;
let plots = new Map();

function table(el, headings, rows, highlight = () => false) {
  el.replaceChildren();
  const heading = el.createTHead().insertRow();
  headings.forEach(value => {
    const th = stamp("th", value);
    th.scope = "col";
    heading.append(th);
  });
  const body = el.createTBody();
  rows.forEach(row => {
    const tr = body.insertRow();
    if (highlight(row)) tr.className = "ours";
    row.forEach(value => tr.insertCell().textContent = value);
  });
}

function plot(canvas, series, selected, unit, diagonal = false, xLabel = "GT (m)", scatter = false) {
  plots.set(canvas, [series, selected, unit, diagonal, xLabel, scatter]);
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (!width || !height) return;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  const ctx = canvas.getContext("2d");
  ctx.scale(ratio, ratio);
  const points = series.flatMap(item => item.points);
  const minX = Math.min(...points.map(point => point[0]));
  const maxX = Math.max(...points.map(point => point[0]));
  const minY = Math.min(0, Math.floor(Math.min(...points.map(point => point[1]))));
  const maxY = Math.max(0.1, Math.ceil(Math.max(...points.map(point => point[1])) * 10) / 10);
  const bounds = {left:51, right:width-15, top:27, bottom:height-32};
  const x = value => bounds.left + (value - minX) / (maxX - minX) * (bounds.right - bounds.left);
  const y = value => bounds.bottom - (value - minY) / (maxY - minY) * (bounds.bottom - bounds.top);
  function line(x1,y1,x2,y2,color) {
    ctx.strokeStyle=color; ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  }
  ctx.font = "11px ui-monospace, monospace";
  ctx.fillStyle = "#aabdc3";
  ctx.fillText(unit, 5, 14);
  for (let tick=0;tick<=4;tick++) {
    const value = minY + (maxY-minY)*tick/4;
    line(bounds.left,y(value),bounds.right,y(value),"#2b3c46");
    ctx.fillText(format(value, maxY <= 1 ? 2 : 1), 5, y(value)+4);
  }
  for (let tick=0;tick<=4;tick++) {
    const value = minX + (maxX-minX)*tick/4;
    ctx.fillText(format(value,1), x(value)-10, bounds.bottom+19);
  }
  ctx.fillText(xLabel, bounds.right-ctx.measureText(xLabel).width, height-2);
  if (diagonal) {
    ctx.setLineDash([4,4]);
    line(x(minX),y(minX),x(maxX),y(maxX),"#acb7bf");
    ctx.setLineDash([]);
  }
  if (selected !== null) line(x(selected), bounds.top, x(selected), bounds.bottom, "#778e9d");
  for (const item of series) {
    ctx.strokeStyle = item.color;
    ctx.fillStyle = item.color;
    ctx.lineWidth = 2;
    if (!scatter) {
      ctx.beginPath();
      item.points.forEach(([px,py], index) => index ? ctx.lineTo(x(px),y(py)) : ctx.moveTo(x(px),y(py)));
      ctx.stroke();
    }
    if (scatter || selected === null) {
      item.points.forEach(([px,py]) => {
        ctx.beginPath(); ctx.arc(x(px),y(py),3,0,Math.PI*2); ctx.fill();
      });
    }
    const point = item.points.find(([px]) => Math.abs(px - selected) < 1e-5);
    if (point) {
      ctx.beginPath(); ctx.arc(x(point[0]), y(point[1]), 4, 0, Math.PI*2); ctx.fill();
    }
  }
}

function frames() {
  return data.frames.filter(row => row.color === "red").sort((a,b) => Number(a.gt_m)-Number(b.gt_m));
}
const panels = methods.map(([key, name, tint]) => {
  const panel = stamp("figure", "");
  panel.className = "method-panel" + (key === "cadfds" ? " ours" : "");
  panel.style.setProperty("--method", tint);
  const image = stamp("img", "");
  const caption = stamp("figcaption", "");
  const value = stamp("strong", "");
  const error = stamp("span", "");
  const detail = stamp("small", "");
  caption.append(stamp("b",name), value, error, detail);
  panel.append(image, caption);
  get("method-cards").append(panel);
  return {key, name, image, value, error, detail};
});

function updateComparison() {
  const rows = frames();
  const row = rows[Number(get("frame").value)];
  const distance = row.gt_m;
  get("frame-value").value = distance + " m";
  for (const panel of panels) {
    const {key, name, image, value, error, detail} = panel;
    image.src = root + "C-E1_method_compare/panels/" + distance + "m_" + key + ".jpg";
    image.alt = name + " 輸出圖";
    value.textContent = format(row[key + "_m"]) + " m";
    error.textContent = "誤差 " + signed(Number(row[key + "_err_m"])) + " m";
    detail.textContent = row[key + "_raw_m"] ? " · 原始 " + format(row[key + "_raw_m"]) + " m" : "";
  }
  plot(get("compare-chart"), methods.map(([key,,color]) => ({
    color,points:rows.map(item => [Number(item.gt_m),Number(item[key+"_m"])])
  })), Number(distance), "估測 (m)", true);
}

function togglePlayback() {
  if (playback) {
    clearInterval(playback);
    playback = null;
    get("play").textContent = "播放";
  } else {
    get("play").textContent = "暫停";
    playback = setInterval(() => {
      get("frame").value = (Number(get("frame").value) + 11) % 12;
      updateComparison();
    }, 650);
  }
}
const steps = ["0_input","1_mask","2_J","3_ac","4_bc","5_sharpness","6_result"];
function updateSteps() {
  const index = Number(get("step").value);
  const distance = get("step-distance").value;
  const row = data.steps[distance];
  const text = ["原始輸入 · f/1.4", "資料集手繪遮罩 · "+row.mask_pixels.toLocaleString()+" 像素",
    "J 明度 · 平均 "+row.J_mean, "a₍c₎ 色彩分量 · 平均 "+row.ac_mean,
    "b₍c₎ 色彩分量 · 平均 "+row.bc_mean, "加權拉普拉斯標準差 σ = "+row.sigma,
    "距離 "+format(row.pred_m)+" m · GT "+row.gt_m+" m · 誤差 "+signed(row.err_m)+" m"];
  get("step-text").textContent = (index+1) + " / 7 · " + text[index];
  get("step-image").src = root + "C-C1_input_output/steps/" + distance + "/" + steps[index] + ".jpg";
}
function updateOptics() {
  const selected = Number(get("optics").value);
  const spec = [["f1.4_focus15m","f/1.4 · 對焦 15 m","#7af4c1"],["f1.4_focus7m","f/1.4 · 對焦 7 m","#7bc5ff"],["f22_focus15m","f/22 · 對焦 15 m","#ffce78"]];
  const rows = data.optics.filter(row => Number(row.distance_m) >= 1 && Number(row.distance_m) <= 7);
  const current = rows.find(row => Math.abs(Number(row.distance_m)-selected)<1e-5);
  get("optics-value").value = format(selected,2) + " m";
  const readout = get("optics-readout");
  readout.replaceChildren(...spec.map(([key,name,color]) => {
    const span = stamp("span", name + " = " + format(current[key],2) + " px");
    span.style.color = color;
    span.style.marginInlineEnd = "18px";
    return span;
  }));
  plot(get("optics-chart"),spec.map(([key,,color]) => ({color,points:rows.map(row => [Number(row.distance_m),Number(row[key])])})),selected,"模糊直徑 (px)",false,"距離 (m)");
}
function updatePair() {
  const distance = get("pair-distance").value;
  const stem = "red_" + distance;
  const pairs = {
    aperture:["C-D1_defocus_theory/aperture_pairs/",stem+"_f1.4.jpg",stem+"_f22.jpg","f/1.4","f/22"],
    rotation:["C-F1_before_after/rotation_pairs/",stem+"_orig.jpg",stem+"_rot180.jpg","原圖","旋轉 180°"],
    color:["C-F1_before_after/gray_vs_ciecam/",stem+"_gray.jpg",stem+"_ciecam.jpg","灰階","CIECAM02"]
  };
  const [folder,left,right,leftName,rightName] = pairs[get("pair-kind").value];
  get("pair-left").src = root+folder+left;
  get("pair-right").src = root+folder+right;
  get("left-label").textContent = leftName;
  get("right-label").textContent = rightName;
  const row = data.rotation.find(item => item.color === "red" && Number(item.shot) === 1 && Number(item.gt_m) === parseFloat(distance));
  table(get("rotation-table"), ["方法","原圖 → 旋轉估測 (m)","原圖 → 旋轉 RMSE (m)"], methods.map(([key,name]) => {
    const summary = data.rotationSummary[key];
    return [name, format(row[key+"_m"])+" → "+format(row[key+"_rot_m"]),format(summary.rmse_orig_m)+" → "+format(summary.rmse_rot_m)];
  }));
}
function updateSplit() {
  const percent = get("split").value + "%";
  get("pair-left").style.clipPath = "inset(0 calc(100% - " + percent + ") 0 0)";
  get("wipe-line").style.left = percent;
}

function updateLeaderboard() {
  const key = get("sort").value;
  const cols = ["rmse_m","mae_m","rmse_near_1_2_to_3_7_m","rmse_far_4_2_to_6_7_m","rmse_red_m","rmse_green_m","rmse_blue_m","rmse_black_m","rmse_rot180_m"];
  const score = row => format(row[key]) === "—" ? Infinity : Number(row[key]);
  const rows = [...data.leaders.rows].sort((a,b) => score(a)-score(b)).map((row,index) =>
    [index+1, row.method, row.year || "—", ...cols.map(col => format(row[col])), row.inputs, row.calibration]);
  table(get("leaders"),["名次","方法","年份","RMSE (m)","MAE (m)","近","遠","紅","綠","藍","黑","旋轉","輸入","校正"],rows,row => row[1] === data.leaders.rows.find(item => item.ours)?.method);
}
function updateError() {
  const points = Object.entries(data.analysis.error_vs_distance[get("error-method").value])
    .map(([distance,rmse]) => [Number(distance),rmse]).sort((a,b) => a[0]-b[0]);
  plot(get("error-chart"),[{color:"#7af4c1",points}],null,"RMSE (m)");
}
function updateAnalysis() {
  const url = root+"C-I1_analysis/"+get("analysis-select").value;
  get("analysis-image").src = url;
  get("analysis-link").href = url;
}
function gallery() {
  const videos = [
    ["消防車接近","C-A1_teaser/video.mp4","C-A1_teaser/poster.jpg","C-A1_teaser/per_frame.csv"],
    ["輸入到輸出","C-C1_input_output/video.mp4","C-C1_input_output/poster.jpg","C-C1_input_output/per_frame.csv"],
    ["四方法同步跑分","C-E1_method_compare/video.mp4","C-E1_method_compare/poster.jpg","C-E1_method_compare/per_frame.csv"],
    ["原圖與旋轉 180°","C-F1_before_after/video.mp4","C-F1_before_after/poster.jpg","C-F1_before_after/per_frame.csv"],
  ];
  for (const [title, path, poster, csv] of videos) {
    const figure = stamp("figure","");
    figure.className = "card media-card";
    const video = Object.assign(document.createElement("video"),{src:root+path,poster:root+poster,preload:"none",controls:true,playsInline:true});
    video.setAttribute("aria-label",title);
    const caption = stamp("figcaption",title+(csv ? " · " : ""));
    if (csv) caption.append(Object.assign(stamp("a","逐幀 CSV"),{href:root+csv,download:""}));
    figure.append(video,caption);
    get("videos").append(figure);
  }
  for (const {file,caption} of data.failures) {
    const figure = stamp("figure","");
    figure.className = "card media-card";
    const image = Object.assign(document.createElement("img"),{src:root+"C-K1_failure_cases/"+file.replace(/\.png$/, ".jpg"),alt:caption,loading:"lazy"});
    figure.append(image,stamp("figcaption",caption));
    get("failures").append(figure);
  }
}


function setupVideoComparison() {
  const video = get("comparison-video");
  const canvas = get("video-chart");
  const summary = data.comparison;
  const benchmarkKeys = {cadfds:"opt", unidepth:"unidepth_lin", depthpro:"depthpro_lin", stmap:"stmap"};
  table(get("rmse"), ["方法", "影片 48 張 RMSE (m)", "測試集 480 張 RMSE (m)"],
    methods.map(([key,name]) => [name, format(summary.sequence_rmse_m[key]),
      format(summary.test480_rmse_m[benchmarkKeys[key]])]), row => row[0].startsWith("CA-DFDS"));
  const series = methods.map(([key,,color]) => ({color, points:data.frames.map((row,index) =>
    [index + 1, Math.abs(Number(row[key + "_err_m"]))])}));
  // The comparison encoder holds each image for 27 frames and blends for four.
  let position = 0;
  const starts = data.frames.map((row, index) => {
    const blend = index > 0 && row.color === data.frames[index - 1].color;
    const start = position + (blend ? 2 : 0);
    position += blend ? 31 : 27;
    return start / 30;
  });
  let selected;
  function sync() {
    const index = starts.findLastIndex(start => start <= video.currentTime);
    const next = video.currentTime < position / 30 ? index + 1 : null;
    if (next === selected) return;
    selected = next;
    plot(canvas, series, selected, "絕對誤差 (m)", false, "樣本序號");
  }
  canvas.addEventListener("click", event => {
    const fraction = (event.offsetX - 51) / (canvas.clientWidth - 66);
    const index = Math.max(0, Math.min(starts.length - 1, Math.round(fraction * (starts.length - 1))));
    if (video.readyState) video.currentTime = starts[index] + 0.001;
  });
  video.addEventListener("timeupdate", sync);
  video.addEventListener("seeked", sync);
  sync();
}

async function initialize() {
  const response = await fetch("data.json");
  if (!response.ok) throw Error("讀取資料失敗");
  data = await response.json();
  get("error-method").replaceChildren(...Object.keys(data.analysis.error_vs_distance).map(key => new Option(labels[key] || key,key)));
  get("error-method").value = "opt";
  gallery();
  updateComparison();
  updateSteps();
  updateOptics();
  updatePair();
  updateSplit();
  updateLeaderboard();
  updateError();
  updateAnalysis();
  const exposure = data.robustness.filter(row => row.case.startsWith("exposure_x")).map(row =>
    [Number(row.case.split("x").at(-1)),Number(row.cadfds_rmse_m)]);
  const texture = data.texture.map(row => [Number(row.texture_f22_mean),Number(row.cadfds_rmse_m)]);
  plot(get("exposure-chart"),[{color:"#ffce78",points:exposure}],null,"RMSE (m)",false,"曝光乘數");
  plot(get("texture-chart"),[{color:"#7bc5ff",points:texture}],null,"RMSE (m)",false,"紋理量",true);
  table(get("timing"),["管線","延遲中位數 (ms)","FPS","RMSE (m)"],Object.entries(data.timing.pipelines).map(([key,item]) =>
    [key,format(item.total_median_ms,2),format(item.fps,2),format(item.rmse_m,4)]));
  get("mask-timing").textContent = "YOLO + SAM 自動遮罩含 I/O 耗時 " + data.timing.auto_mask.wall_incl_io + " ms。此為獨立遮罩計時。";
  const handlers = {frame:updateComparison,step:updateSteps,"step-distance":updateSteps,
    optics:updateOptics,"pair-kind":updatePair,"pair-distance":updatePair,split:updateSplit,sort:updateLeaderboard,
    "error-method":updateError,"analysis-select":updateAnalysis,
    view:() => {get("camera-image").src = root + "C-B1_camera_setup/" + get("view").value;}};
  for (const [id,handler] of Object.entries(handlers)) get(id).addEventListener("input",handler);
  get("play").addEventListener("click",togglePlayback);
  setupVideoComparison();
  const wipe = get("wipe");
  function drag(event) {
    const rect = wipe.getBoundingClientRect();
    get("split").value = (event.clientX-rect.left)/rect.width*100;
    updateSplit();
  }
  wipe.addEventListener("pointerdown",event => {wipe.setPointerCapture(event.pointerId); drag(event);});
  wipe.addEventListener("pointermove",event => {if (wipe.hasPointerCapture(event.pointerId)) drag(event);});
  window.addEventListener("resize",() => plots.forEach((args,canvas) => plot(canvas,...args)));
}
initialize().catch(error => {get("load-status").textContent = "展示資料載入失敗 · " + error.message;});
