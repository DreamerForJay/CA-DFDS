FROM python:3.12-slim
WORKDIR /app
COPY gradio_demo/requirements.txt /app/gradio_demo/requirements.txt
RUN pip install --no-cache-dir -r /app/gradio_demo/requirements.txt
COPY gradio_demo/app.py /app/gradio_demo/app.py
COPY docs/demo/data.json /app/docs/demo/data.json
COPY docs/assets/demo/scenario_replays/*.jpg /app/docs/assets/demo/scenario_replays/
COPY docs/assets/demo/C-C1_input_output/steps /app/docs/assets/demo/C-C1_input_output/steps
RUN useradd -m -u 1000 appuser && chown -R appuser /app
USER appuser
ENV GRADIO_ANALYTICS_ENABLED=False
EXPOSE 7860
CMD ["python", "gradio_demo/app.py", "--host", "0.0.0.0", "--port", "7860"]
