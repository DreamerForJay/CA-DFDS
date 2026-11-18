# CA-DFDS 專案網站

**CA-DFDS：結合色彩感知、影像分割與物理光學之單眼失焦車距估測系統**
Color-Aware Depth from Defocus with Segmentation for Monocular Vehicle Distance Estimation

- 網站：https://xn--zwq108c.tw/CA-DFDS/（GitHub Pages，來源 `main` 分支 `/docs`）
- 2026 全國大專院校產學創新實作競賽 · 決賽 D86
- 作者：王宇森¹、郭仲輝²、楊杰倫³、張英超³
  ¹國立臺灣大學 工程科學及海洋工程學系　²Rochester Institute of Technology　³國立彰化師範大學 資訊工程學系

## 整合版網站

`docs/index.html` 是唯一主頁與 Demo。舊 `/demo/` 入口會保留查詢參數及章節錨點，導向主頁。

- `assets/unified-demo.js`：既有資料讀取、比較圖表、影格切換、前後拖曳、排行榜。
- `assets/experience.js`：可見區域自動靜音播放、推論動畫、全域暫停、系統流程高亮。
- `assets/language.js` 與 `translations.json`：中英文介面，支援 `?lang=en`／`?lang=zh` 與本機偏好。
- `assets/unified.css`、`unified-polish.css`：深藍底、青藍輔色、紅色 CA-DFDS，桌機與手機版面。
- `demo/data.json` 與 `assets/demo/`：原有數據與影片，未重新推論或修改量測結果。

影片在可見範圍自動循環，離開畫面或切換分頁即暫停。頂部可暫停全部動畫，推論流程也可單獨暫停。尊重系統減少動態效果設定。瀏覽器若阻擋自動播放，可使用原生播放控制。圖內文字與影片字幕沿用原素材，不作翻譯改圖。

## 素材與範圍

- 雲端來源：https://drive.google.com/drive/folders/1dhRViJVTi19B6Qj7G2V88P_CmXReAIpD
- 實驗 repo：`DreamerForJay/CA-DFDS-finals`，核對 `ecf437c9bc9354010261a41300158071e151f04e` 素材清單。
- 使用 C-A1 展示、C-B1 配置、C-C1 流程、C-E1 比較、C-F1 對照及現有分析圖表。
- 完整介紹保留在影片區可展開面板。未完成的 YouTube、連續行駛、第三人稱、GUI 錄影及實拍不放占位內容。
- 48 張展示樣本和 480 張測試集結果分開標示；影片為離散影像重播，動畫不是瀏覽器即時推論。
- 海報 PDF、簡報與已繳件資料均未修改。

## 參考與驗證

參考 [MoGe-3](https://qft-333.github.io/moge3page/) 的流程控制、[GaMO](https://yichuanh.github.io/GaMO/) 的方法對照，以及 [BRDFusion](https://shigon255.github.io/brdfusion-page/) 的展示／方法／結果組織。程式碼與素材沿用本專案。

瀏覽器檢查涵蓋：自動播放、全域暫停、流程動畫、中英文來回切換、舊入口導向、390 px 行動版。進階檢查包含 21 張流程影像、曲線跳轉、前後對照、排序與減少動態效果設定。
