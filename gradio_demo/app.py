"""Gradio UI for recorded CA-DFDS samples; no model inference or new experiments."""
from __future__ import annotations
import argparse
import base64
from functools import lru_cache
import html
import json
import os
from pathlib import Path

os.environ.setdefault('GRADIO_ANALYTICS_ENABLED', 'False')
import gradio as gr

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'docs/assets/demo'
DATA = json.loads((ROOT / 'docs/demo/data.json').read_text(encoding='utf-8'))
SAMPLES = {(r['color'], round(float(r['gt_m']), 1)): r for r in DATA['frames']}
COLORS = [('紅 · Red', 'red'), ('綠 · Green', 'green'), ('藍 · Blue', 'blue'), ('黑 · Black', 'black')]
METHODS = [('cadfds', 'CA-DFDS'), ('unidepth', 'UniDepth V2'), ('stmap', 'STMAP'), ('depthpro', 'Depth Pro')]

@lru_cache(maxsize=48)
def image_uri(color: str, distance: float) -> str:
    path = ASSETS / f'scenario_replays/{color}_{distance:.1f}m.jpg'
    return 'data:image/jpeg;base64,' + base64.b64encode(path.read_bytes()).decode('ascii')


def sample_view(color='red', distance=3.7, show_box=True, show_mask=False, language='中文'):
    key = (color, round(float(distance), 1))
    if key not in SAMPLES:
        raise gr.Error('請選擇現有樣本 / Select an existing sample.')
    row = SAMPLES[key]
    en = language == 'English'
    txt = lambda zh, eng: eng if en else zh
    predicted = float(row['cadfds_m'])
    error = float(row['cadfds_err_m'])
    left, top, right, bottom = DATA['boxes'][f'{color}_{key[1]:.1f}']
    box = (f'<span class="vehicle-box" style="left:{left*100}%;top:{top*100}%;width:{(right-left)*100}%;height:{(bottom-top)*100}%"></span>' if show_box else '')
    picture = f'<div class="sample-picture"><img src="{image_uri(*key)}" alt="{html.escape(color)} vehicle at {key[1]:.1f} m">{box}<strong class="sample-tag">CA-DFDS {predicted:.3f} m</strong></div>'
    rows = ''.join(f'<tr class="{"ours" if method == "cadfds" else ""}"><th scope="row">{name}</th><td>{float(row[method+"_m"]):.3f}</td><td>{float(row[method+"_err_m"]):+.3f}</td></tr>' for method, name in METHODS)
    results = f'''<div class="result-card"><p>CA-DFDS · {txt('本作品','Ours')}</p><strong class="estimate">{predicted:.3f} <small>m</small></strong><div class="measurements"><div>{txt('真實距離','Ground truth')}<b>{key[1]:.1f} m</b></div><div>{txt('距離誤差','Distance error')}<b class="error">{error:+.3f} m</b></div></div></div><table class="results-table"><thead><tr><th>{txt('方法','Method')}</th><th>{txt('估測','Estimate')} (m)</th><th>{txt('誤差','Error')} (m)</th></tr></thead><tbody>{rows}</tbody></table>'''
    available = color == 'red' and key[1] in (1.2, 3.7, 6.7)
    mask_path = str(ASSETS / f'C-C1_input_output/steps/{key[1]:.1f}m/1_mask.jpg') if available and show_mask else None
    status = txt('資料集手繪遮罩展示。','Recorded manual-mask visualization.') if available else txt('此樣本未收錄遮罩圖。現有遮罩：紅車 1.2、3.7、6.7 m。','No recorded mask image for this sample. Available: red vehicle at 1.2, 3.7 and 6.7 m.')
    return picture, results, mask_path, (status if show_mask else '')

CSS = '''
.gradio-container{max-width:1240px!important;margin:auto!important;font-family:Inter,"Segoe UI","Microsoft JhengHei",sans-serif!important}
body,.gradio-container{background:#091326!important;color:#f3f7ff!important}
.gradio-container *{font-family:"Segoe UI","Microsoft JhengHei",sans-serif!important}
.gradio-container label,.gradio-container input,.gradio-container button{font-size:17px!important}
#hero h1{font-size:42px;letter-spacing:-.03em;margin:12px 0;color:#f5f9ff}
#hero p{font-size:18px;color:#b9cce5;line-height:1.7}
.sample-picture{position:relative;overflow:hidden;border-radius:14px;background:#122540}
.sample-picture img{display:block;width:100%;height:auto}
.vehicle-box{position:absolute;border:3px solid #ff5675;box-shadow:0 0 20px #ff567566;pointer-events:none}
.sample-tag{position:absolute;top:12px;left:12px;padding:7px 12px;border-radius:6px;background:#a7193bed;color:white;font-size:19px}
.result-card{border:1px solid #ff5675;border-radius:14px;background:linear-gradient(130deg,#341d35,#122540);padding:22px;box-shadow:0 0 26px #ff56751a}
.result-card p{font-size:18px;color:#ff7390;font-weight:700;margin:0 0 8px}
.estimate{font-size:54px;color:#ff5675;line-height:1.4}.estimate small{font-size:24px}
.measurements{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:14px;font-size:16px;color:#bdd0e8}
.measurements b{display:block;color:#f5f9ff;font-size:26px}.measurements b.error{color:#ff7390}
.results-table{width:100%;border-collapse:collapse;table-layout:fixed;margin-top:20px;font-size:17px;color:#edf4ff}
.results-table th,.results-table td{padding:14px 8px;border-bottom:1px solid #345272;text-align:right;overflow-wrap:anywhere}
.results-table th:first-child{text-align:left;width:40%}.results-table thead th{font-size:14px;color:#bdd0e8}.results-table .ours th,.results-table .ours td{color:#ff7390!important}
.results-table .ours{background:#ff567515;color:#ff7390;font-weight:700}
#caption p,#mask-status p{font-size:16px!important;color:#b9cce5!important;line-height:1.7}
@media(max-width:650px){#hero h1{font-size:34px}.gradio-container{padding:14px!important}.estimate{font-size:44px}.sample-tag{font-size:16px;padding:5px 8px;left:8px;top:8px}.results-table{font-size:16px}.results-table th,.results-table td{padding:12px 5px}.measurements b{font-size:23px}}
'''


def build_app():
    picture, result, _, _ = sample_view()
    with gr.Blocks(title='CA-DFDS · Gradio Demo', analytics_enabled=False) as demo:
        header = gr.Markdown('# CA-DFDS\n單眼失焦車距估測 · 選車色與距離，即可檢視結果。', elem_id='hero')
        with gr.Row():
            color = gr.Dropdown(COLORS, value='red', label='車色', interactive=True, scale=2)
            distance = gr.Slider(1.2, 6.7, value=3.7, step=.5, label='距離 (m)', interactive=True, scale=3)
            language = gr.Radio(['中文', 'English'], value='中文', label='語言 / Language', scale=1)
        with gr.Row():
            box = gr.Checkbox(value=True, label='車輛框')
            mask = gr.Checkbox(value=False, label='遮罩展示')
        with gr.Row(equal_height=False):
            with gr.Column(scale=3, min_width=280):
                image = gr.HTML(picture)
                mask_image = gr.Image(label='既有遮罩', visible=False, interactive=False)
                mask_status = gr.Markdown('', elem_id='mask-status')
            with gr.Column(scale=2, min_width=280):
                results = gr.HTML(result)
        caption = gr.Markdown('48 個既有 CARLA 樣本 · 預先量測結果 · 不執行新推論', elem_id='caption')
        def update(c, d, b, m, lang):
            pic, stats, path, status = sample_view(c, d, b, m, lang)
            en = lang == 'English'
            return (pic, stats, gr.update(value=path, visible=path is not None, label='Recorded mask' if en else '既有遮罩'), status,
                    '# CA-DFDS\nMonocular vehicle distance estimation · Choose a color and distance.' if en else '# CA-DFDS\n單眼失焦車距估測 · 選車色與距離，即可檢視結果。',
                    '48 existing CARLA samples · Recorded measurements · No new inference' if en else '48 個既有 CARLA 樣本 · 預先量測結果 · 不執行新推論',
                    gr.update(label='Vehicle color' if en else '車色'), gr.update(label='Distance (m)' if en else '距離 (m)'),
                    gr.update(label='Vehicle box' if en else '車輛框'), gr.update(label='Mask preview' if en else '遮罩展示'))
        inputs = [color, distance, box, mask, language]
        outputs = [image, results, mask_image, mask_status, header, caption, color, distance, box, mask]
        gr.on(triggers=[c.input for c in inputs], fn=update, inputs=inputs, outputs=outputs, api_name='sample', trigger_mode='always_last')
    return demo

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--host', default='127.0.0.1')
    parser.add_argument('--port', type=int, default=7860)
    parser.add_argument('--share', action='store_true', help='Create a temporary Gradio sharing link')
    args = parser.parse_args()
    build_app().launch(server_name=args.host, server_port=args.port, share=args.share,
                       theme=gr.themes.Base(primary_hue='rose', neutral_hue='slate'), css=CSS,
                       js="() => { document.documentElement.classList.add('dark'); document.body.classList.add('dark'); }",
                       footer_links=[], allowed_paths=[str(ASSETS / 'C-C1_input_output/steps')])
