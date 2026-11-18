# CA-DFDS Gradio 試作

沿用網站的 48 筆既有量測，無需 GPU，不下載模型、不執行新實驗。

```powershell
python -m venv .venv-gradio
.\.venv-gradio\Scripts\python -m pip install -r gradio_demo/requirements.txt
.\.venv-gradio\Scripts\python gradio_demo/app.py
```

開啟 http://127.0.0.1:7860 。預設中文、深色；選車色／距離即更新。

- 車輛框取自 `docs/demo/data.json` 的原始框座標。
- 比較數字直接使用同檔案 `frames`，未重新推論或校正。
- 遮罩僅展示已發布的紅車 1.2、3.7、6.7 m；其他樣本標示未收錄。
- 此程式是既有資料操作介面，並非將桌面 GUI 的任意上傳／SAM 推論移植到瀏覽器。

## 手機公開使用

Gradio 需要執行 Python 的服務，不能只放到 GitHub Pages。可部署到支援 Docker 的主機（包括 Hugging Face Docker Spaces）：

```sh
docker build -f gradio_demo/Dockerfile -t cadfds-gradio .
docker run --rm -p 7860:7860 cadfds-gradio
```

取得永久 HTTPS 網址後，才能把正式網頁按鈕／iframe 接到該網址。暫時分享可執行 `python gradio_demo/app.py --share`，但需要本機持續開啟，不適合印成比賽 QR Code。正式網站目前仍使用免後端的靜態資料操作台。

官方文件：https://www.gradio.app/guides/sharing-your-app
