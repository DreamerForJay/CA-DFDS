# CA-DFDS 專案網站

**CA-DFDS：結合色彩感知、影像分割與物理光學之單眼失焦車距估測系統**
Color-Aware Depth from Defocus with Segmentation for Monocular Vehicle Distance Estimation

- 網站：https://xn--zwq108c.tw/CA-DFDS/（GitHub Pages，來源 `main` 分支 `/docs`）
- 2026 全國大專院校產學創新實作競賽 · 決賽 D86
- 作者：王宇森¹、郭仲輝²、楊杰倫³、張英超³
  ¹國立臺灣大學 工程科學及海洋工程學系　²Rochester Institute of Technology　³國立彰化師範大學 資訊工程學系

## 內容

| 路徑 | 說明 |
|---|---|
| `docs/index.html` | 專案網頁（單一 HTML，支援深色模式與手機版） |
| `docs/assets/intro.mp4` | 配音介紹影片（v6） |
| `docs/assets/demo.mp4` | 系統展示：測試距離 6.7 m → 1.2 m |
| `docs/assets/poster.pdf` | A1 海報（v20） |
| `docs/assets/demo/` | Demo 素材（影片、步驟圖、比較數據、`manifest.json`），由 CA-DFDS-finals `scripts/export_web_assets.py` 產生 |

## 更新影片連結

主頁影片選單設定在 `docs/assets/showcase.js` 的 `clips`。預設播放 C-A1 三聯展示，可切換 C-E1 四方法比較及原有 `assets/intro.mp4` 完整介紹。新增影片時同步更新主頁縮圖與說明。

## 數據來源

網頁所有數字皆取自作品說明書、論文與海報（CARLA 1.2–6.7 m 測試距離；20–110 cm 實拍結果引自前期研究 DFDS）。尚待補齊的項目見 [`docs/TODO.md`](docs/TODO.md)。


## 2026-11-18 主頁素材整合

- 主頁 `#video` 直接切換 3 支既有影片，不自動播放；保留完整介紹影片。
- `#demo` 整合 C-C1 近／中／遠 21 張處理影像；數值直接讀取 `steps.json`。
- C-E1 比較與 C-F1 前後差異連到完整互動頁；C-B1 配置圖放在可展開的說明。
- 雲端來源：https://drive.google.com/drive/folders/1dhRViJVTi19B6Qj7G2V88P_CmXReAIpD
- 核對實驗 repo：`ecf437c9bc9354010261a41300158071e151f04e`。本次使用網站 repo 已同步的壓縮素材，未重新推論、未變更結果數據。
- 尚未完成的連續 CARLA 行駛、第三人稱影片、桌面 GUI 錄影及實拍連續影片未新增為展示成果。情境 ZIP 保留於雲端，避免將離散回放當作實車錄影。
- 驗證：3 支影片載入與播放、3 距離 × 7 步影像切換、390 px 手機版寬度、深色模式、JavaScript 錯誤檢查。
