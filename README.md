# CA-DFDS 專案網站

**CA-DFDS：結合色彩感知、影像分割與物理光學之單眼失焦車距估測系統**
Color-Aware Depth from Defocus with Segmentation for Monocular Vehicle Distance Estimation

- 網站：https://xn--zwq108c.tw/CA-DFDS/（GitHub Pages，來源 `main` 分支 `/docs`）
- 2026 全國大專院校產學創新實作競賽 · 決賽 D86
- 作者：王宇森¹、郭仲輝²、楊杰倫³、張英超³
  ¹國立臺灣大學 工程科學及海洋工程學系　²Rochester Institute of Technology　³國立彰化師範大學 資訊工程學系

## 展示網站

`docs/index.html` 為唯一主頁與 Demo；舊 `/demo/` 保留語言與章節轉址。

順序：作品／作者／校徽 → 研究動機 → 系統流程 → 方法比較 → 影像條件 → 定量結果 → 影片 → 速度 → 限制。主要內容直接顯示，完整介紹影片可展開。

- `assets/unified-demo.js`：既有資料、比較圖表與正式四方法表。
- `assets/experience.js`：可見區域自動重播、點比較區暫停／繼續、全域暫停。
- `assets/luminous.js`、`luminous.css`：明暗主題、滑鼠反光、SVG 流光、真實中間影像流程、車色圖表。
- `assets/language.js`、`translations.json`：中英文，可用 `?lang=en`／`?lang=zh`。
- `demo/data.json`、`assets/demo/`：原有數據與素材；不重新推論、不改科學結果。

四方法比較預設在可見時重播。點比較影像區或使用 Enter／空白鍵可暫停與繼續；拖曳距離滑桿停在指定樣本。切換車色可保持播放。影片靜音循環，離開畫面或切換分頁會暫停。尊重系統減少動態效果設定。流程動畫為既有結果重播，非瀏覽器即時推論。

## 資料呈現

主表只包含 `opt`、`unidepth_lin`、`stmap`、`depthpro_lin`。J-only、重新最佳化權重及其他版本保留於原始資料，依展示需求移出主表。CA-DFDS 固定首列，其餘依指標排序；固定順序不當成每個指標的名次。主表 CSV 為 `assets/comparison-main.csv`，逐欄複製既有值。

48 張展示樣本與 480 張測試集分開列示；深度模型使用線性校正後結果。黑色也是校正車色。原素材中的圖內文字與影片字幕保留原文。14.11 FPS 的條件為 RTX 5080 FP32、已有遮罩。

## 素材與範圍

- 雲端：https://drive.google.com/drive/folders/1dhRViJVTi19B6Qj7G2V88P_CmXReAIpD
- 素材來源：`DreamerForJay/CA-DFDS-finals`，另完整合併網站更新 `115f04d` 的情境影片、四車色影像與目標框座標。
- 主頁校徽沿用現有素材；SVG 與流光僅為方法示意及導覽效果，沒有模擬或捏造量測值。
- 海報 PDF、簡報與已繳資料未修改。網站口說講稿另存於本機決賽資料夾「04_講稿與問答」。

## 參考與驗證

參考 [MoGe-3](https://qft-333.github.io/moge3page/) 的流程控制、[GaMO](https://yichuanh.github.io/GaMO/) 的方法對照，以及 [BRDFusion](https://shigon255.github.io/brdfusion-page/) 的展示／方法／結果順序。

測試：自動游標推進、點擊／鍵盤暫停、四方法數值、排序固定首列、影片跳轉、中英文、明暗主題、手機溢位與對照標籤碰撞、減少動態效果。所有資料表沿用原值。
