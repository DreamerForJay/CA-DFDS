# CA-DFDS 待補資料（2026-11-16）

網頁、海報與影片目前缺少下列資料。補齊後請更新對應檔案，未量測前一律以「—」或「未來工作」呈現，不放估計值。

## 需要上傳／提供連結

| 項目 | 用途 | 負責 |
|---|---|---|
| 介紹影片 YouTube 連結 | 填入 `index.html` 的 `YOUTUBE_ID`；做成海報 QR code | 杰倫 |
| 網站 QR code | 網站上線後，加到 A1 海報標頭（與 GEMO3D 相同，放網站／影片兩個 QR） | 杰倫 |
| 程式碼公開與否 | 目前未放 Code 按鈕；若要公開需另建 repo 並移除個資 | 老師／宇森 |

## 需要實驗室量測

| 項目 | 目前狀態 | 說明 |
|---|---|---|
| CIECAM02 版本處理時間（GPU） | ✅ 2026-11-18 | RTX 5080 GPU fp32 全圖 73 ms／張（14.1 FPS）、CPU 2.4 s；含讀圖、不含遮罩取得（`assets/demo/C-M1_timing/`） |
| 邊緣裝置（Jetson 等）處理時間 | 未量測 | 可行性簡報與網頁目前只寫 RTX 5080 主機數字 |
| 實體相機、真實車輛驗證 | 未進行 | 目前車距結果皆為 CARLA 模擬；20–110 cm 實拍為前期研究 |
| 7 m 以上距離 | 未驗證 | 驗證範圍 1–7 m |
| 更多車色（19 色）之最佳化權重結果 | 未公開 | 目前公開結果為紅、綠、藍、黑 |
| 自動遮罩（影像分割模型）取代 SAM 2／人工 | ✅ 實驗室已完成 | YOLO11 → SAM：480 張 CA-DFDS RMSE 0.310 m；YOLO 10 ms＋SAM 106 ms（CA-DFDS-finals RESULTS 補充 H、K） |

## 需要原始資料以改善圖表

| 項目 | 原因 |
|---|---|
| 散焦理論曲線的相機參數（焦距、像素尺寸、光圈組、對焦距離） | ✅ 40 mm、17.6 µm（36 mm／2048 px）、f/1.4／f/22、對焦 15 m；重畫版 `assets/demo/C-D1_defocus_theory/defocus_curves.jpg` |
| 最佳化程式（權重限制、停止條件）與最終 c₂、c₁、c₀ | 方法說明與重現性 |

## Demo 區塊（2026-11-18）
- 專案頁 Demo／方法比較區塊規劃見 CA-DFDS-finals 的 `docs/DEMO_PLAN.md`；素材到齊後依該文件第四節加入本頁。
- **素材已放入 `docs/assets/demo/`（2026-11-18，尚未接到 `index.html`）**。`assets/demo/manifest.json` 列出每項的標題、說明、檔案和重點數字：

| 資料夾 | 用途（DEMO_PLAN 第四節） |
|---|---|
| `C-A1_teaser/` | Teaser 影片（三聯畫面，20 s）＋首幀 |
| `C-B1_camera_setup/` | 拍攝配置示意圖、相機視角 |
| `C-C1_input_output/` | 方法總覽＋步驟滑桿：`steps/<1.2m|3.7m|6.7m>/0_input … 6_result.jpg`，數值 `steps.json` |
| `C-D1_defocus_theory/` | 光圈／對焦互動：`curves.csv`（曲線數據）、`aperture_pairs/`（f/1.4 vs f/22 拖曳對照）、動畫影片 |
| `C-E1_method_compare/` | 四方法同步比較影片＋`per_frame.csv`（逐幀誤差曲線）＋`panels/`（12 距離 × 4 方法） |
| `C-F1_before_after/` | 旋轉 180° 對照（`rotation_pairs/`、`rotation_summary.json`）、灰階 vs CIECAM02（`gray_vs_ciecam/`） |
| `C-H1_leaderboard/` | 排行榜表 `leaderboard.json`（方法附年份與出處） |
| `C-I1_analysis/` | 分析圖＋`charts.json`（互動圖用） |
| `C-K1_failure_cases/` | 失敗案例＋`captions.json` |
| `C-M1_timing/` | 處理時間圖 |

- 素材由 CA-DFDS-finals `scripts/export_web_assets.py` 產生，請勿手改；原始版（PNG、簡報用精華影片）在 CA-DFDS-finals `results/demo/` 與 Google Drive。
- 數字口徑：全部為 CARLA 模擬；公平比較（深度模型線性校正後）CA-DFDS 0.337 m 與 UniDepthV2 0.357 m 相當，近距離 CA-DFDS 較準、遠距離 UniDepthV2 較準。
