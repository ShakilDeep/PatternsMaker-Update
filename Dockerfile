# Multi-stage image for DigitalOcean App Platform / Droplet
FROM node:20-bookworm AS frontend
WORKDIR /src/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM python:3.12-slim-bookworm
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DATABASE_URL=sqlite:////data/garment.db \
    PORT=8080
RUN mkdir -p /data
COPY backend/pyproject.toml backend/requirements.txt ./backend/
COPY backend/app ./backend/app
RUN pip install --no-cache-dir -e "./backend"
COPY --from=frontend /src/frontend/dist ./frontend/dist
WORKDIR /app/backend
EXPOSE 8080
CMD ["sh", "-c", "python -m uvicorn app.api.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
