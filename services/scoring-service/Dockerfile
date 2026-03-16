FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc g++ libpq-dev wget && rm -rf /var/lib/apt/lists/*
RUN useradd --create-home --shell /bin/bash app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN mkdir -p /app/model-store && chown app:app /app/model-store
RUN chown -R app:app /app
USER app
EXPOSE 8008
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD wget -q --spider http://localhost:8008/health || exit 1
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8008", "--workers", "2"]
