# Module 1: Deployment (how your app goes live)

## What is deployment?
**Deployment** means taking your application from your laptop and making it **run in a target environment** so real users (or testers) can access it.

A “target environment” can be:
- your own machine (local deployment)
- a VM or server
- a Kubernetes cluster
- a cloud platform

Deployment usually includes:
- packaging your app (zip, container image)
- configuring environment variables (DB URL, secrets)
- starting the app (process manager, container, service)
- exposing it (port, domain, HTTPS)
- monitoring/logging

---

## Why do we deploy?
- **Other people can use/test it**
- **Same environment every time** (reduce “works on my machine” issues)
- **Repeatable releases** (automation)

---

## Example students can run: Deploy a tiny web app using Docker
This is a “local deployment” but it teaches the core idea:
- you package the app as a container image
- you run it anywhere Docker exists

### Step 1: Create a folder
```bash
mkdir -p deploy-demo
```

### Step 2: Create `app.py`
```bash
cat > deploy-demo/app.py <<'PY'
from flask import Flask

app = Flask(__name__)

@app.get("/")
def home():
    return "Hello from a deployed container!"

@app.get("/health")
def health():
    return "OK"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
PY
```

### Step 3: Create `requirements.txt`
```bash
cat > deploy-demo/requirements.txt <<'TXT'
flask==3.0.3
TXT
```

### Step 4: Create a `Dockerfile`
```bash
cat > deploy-demo/Dockerfile <<'DOCKER'
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

EXPOSE 8080
CMD ["python", "app.py"]
DOCKER
```

### Step 5: Build the container image
```bash
docker build -t deploy-demo:1.0 ./deploy-demo
```

### Step 6: Run (deploy) the container
```bash
docker run --name deploy-demo-app -p 8080:8080 -d deploy-demo:1.0
```

### Step 7: Test it
```bash
curl http://127.0.0.1:8080/
curl http://127.0.0.1:8080/health
```

### Step 8: View logs
```bash
docker logs -f deploy-demo-app
```

### Step 9: Stop and cleanup
```bash
docker stop deploy-demo-app

docker rm deploy-demo-app

# Optional: remove the image
# docker rmi deploy-demo:1.0
```

---

## Key concepts to teach (very important)
- **Build** vs **Deploy**
  - Build = create the artifact (e.g., Docker image)
  - Deploy = run that artifact in the target environment
- **Port mapping**
  - `-p 8080:8080` exposes container port 8080 to your machine
- **Configuration**
  - use env vars (example): `docker run -e APP_MODE=prod ...`

---

## Optional: What does CI/CD mean?
- **CI (Continuous Integration):** automatically run tests/build when code changes
- **CD (Continuous Delivery/Deployment):** automatically deploy after build passes

### Student-friendly pipeline idea
- Push code to GitHub
- GitHub Actions builds Docker image
- Deploy to a server (or just push to Docker Hub)

---

## Optional: Deploy on Netlify (frontend)
Netlify is used to deploy **static sites** and **frontend apps** (Vite/React).

### Deploy from GitHub
1. Push project to GitHub.
2. Netlify → Add new site → Import from Git.
3. Build: `npm run build`
4. Publish directory: `dist`

### Deploy using Netlify CLI (optional)
```bash
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod --dir=dist
```


## Quick deployment checklist
| Item | Example |
|---|---|
| Build artifact | container image `deploy-demo:1.0` |
| Config | env vars, secrets |
| Run strategy | container/service |
| Health check | `/health` |
| Observability | logs/metrics |
