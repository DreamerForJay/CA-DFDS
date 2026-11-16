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
| `docs/assets/poster.pdf` | A1 海報（v15） |

## 更新影片連結

介紹影片上傳 YouTube 後，把影片 ID 填入 `docs/index.html` 的 `const YOUTUBE_ID = ''`；留空時網頁直接播放 `assets/intro.mp4`。

## 數據來源

網頁所有數字皆取自作品說明書、論文與海報（CARLA 1.2–6.7 m 測試距離；20–110 cm 實拍結果引自前期研究 DFDS）。尚待補齊的項目見 [`docs/TODO.md`](docs/TODO.md)。
