DevOps Assignments — Complete Steps
GitHub Repo https://github.com/makeswarane/sample-node-project
📦 What this document contains

A single, copy-ready step-by-step guide that covers every assignment in your brief (local-only, no cloud).
For each assignment you’ll find:

Goal & prerequisites

Exact installation commands (Ubuntu / Debian / WSL)

Configuration files (Jenkinsfile, Dockerfile, docker-compose.yml, K8s manifests, Prometheus config, Grafana setup)

Scripts & health checks

Testing commands and verification steps

Deliverables checklist & video recording script

GitHub repo setup

Office link submission guidelines

🌍 Global Prerequisites (Applies to All Assignments)
1️⃣ System Requirements

OS: Ubuntu 22.04 / Debian / WSL2 / macOS

User Permissions: Must be sudo user

2️⃣ Install Base Tools
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git wget unzip apt-transport-https ca-certificates gnupg lsb-release

3️⃣ Install Docker
# Add Docker repo and GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Allow user to use Docker
sudo usermod -aG docker $USER
newgrp docker

4️⃣ Install Docker Compose (if not included)
sudo curl -L "https://github.com/docker/compose/releases/download/v2.17.3/docker-compose-$(uname -s)-$(uname -m)" \
-o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

5️⃣ Install Kubernetes Tools (Minikube + kubectl)
# Minikube
curl -LO https://github.com/kubernetes/minikube/releases/latest/download/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube && rm minikube-linux-amd64
minikube start

# kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
kubectl version --client

🧩 Assignment 1 — CI/CD Pipeline with Jenkins + Docker
🎯 Goal

Set up Jenkins in Docker to build, test, and run a Dockerized app from a GitHub repo.

🧱 Dockerfile
FROM jenkins/jenkins:2.528.1-jdk21

USER root

RUN apt-get update && \
    apt-get install -y \
        lsb-release curl gnupg ca-certificates git nodejs npm iputils-ping sudo && \
    rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.asc && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.asc] \
    https://download.docker.com/linux/debian $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list && \
    apt-get update && \
    apt-get install -y docker-ce-cli && \
    rm -rf /var/lib/apt/lists/*

RUN groupadd -g 999 docker || true
RUN usermod -aG docker jenkins

USER jenkins

RUN jenkins-plugin-cli --plugins "blueocean docker-workflow json-path-api pipeline-github-lib"

EXPOSE 8080

🧰 Build Jenkins Image
docker build -t jenkins-docker:latest .

▶️ Run Jenkins
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins-docker:latest

✅ Check Jenkins

Visit → http://localhost:8080

Get admin password:

docker exec -it jenkins cat /var/jenkins_home/secrets/initialAdminPassword


Install suggested plugins.

🧭 GitHub Repo Setup
# Initialize repo
git init
git remote add origin https://github.com/<your-username>/sample-node-project.git
git add .
git commit -m "Initial commit"
git push -u origin main


➡️ Example:

Repo name: sample-node-project
Contains: Jenkinsfile, Dockerfile, k8s/, monitoring/, compose/

🧱 Jenkinsfile (for your project)
pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/<your-username>/sample-node-project.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t sample-node-app:latest .'
            }
        }
        stage('Run Container') {
            steps {
                sh 'docker run -d -p 8081:3000 --name sample-app sample-node-app:latest'
            }
        }
    }
}

✅ You can see your app running at → http://localhost:8081

1.4 Notifications (Bonus)

Slack → install Slack plugin, configure token + channel in Credentials.

post {
  success { slackSend channel: '#builds', message: 'Build Success ✅' }
  failure { slackSend channel: '#builds', message: 'Build Failed ❌' }
}


Email → configure SMTP (e.g., Gmail) under Jenkins → Manage Jenkins → System → E-mail Notification.

1.5 Verification

Open Jenkins at http://localhost:8080

Trigger build manually or from Git push

Verify container running via:

docker ps

Assignment 2 — Kubernetes Deployment with Minikube

(unchanged, except indentation + added missing code blocks)

✅ Added kubectl rollout status for deployment verification:

kubectl rollout status deployment/myapp-deploy

Assignment 3 — GitOps Workflow with Argo CD

✅ Added:

kubectl get pods -n argocd
kubectl get svc -n argocd


To verify Argo CD installation before port-forwarding.

Assignment 4 — GitHub Actions + K8s

✅ Added:

Example k8s/ folder content reference for clarity:

k8s/
├── deployment.yaml
└── service.yaml


Self-hosted runner setup note:

./svc.sh install
./svc.sh start

Assignment 5 — Infrastructure Automation with Docker Compose

✅ Added a health check and teardown section:

# check services
docker compose ps

# logs
docker compose logs -f

# stop all
docker compose down

Assignment 6 — Monitoring with Prometheus + Grafana

✅ Added prometheus.yml example content:

global:
  scrape_interval: 5s

scrape_configs:
  - job_name: 'myapp'
    static_configs:
      - targets: ['myapp:3000']


✅ Added Grafana setup steps:

Open Grafana → http://localhost:3000

Login → admin / admin

Add Data Source → Prometheus → URL: http://prometheus:9090

Import dashboard → + → Import → Paste ID 3662 (Node.js metrics dashboard)

Deliverables Checklist
Assignment	Deliverable	Verified
1	Jenkins pipeline running Docker build	✅
2	App deployed on Minikube	✅
3	Argo CD sync from Git	✅
4	GitHub Actions CI/CD	✅
5	Docker Compose setup.sh automation	✅
6	Prometheus & Grafana dashboard	✅
Recording Script (for submission)

Open terminal → run docker ps

Show Jenkins build pipeline success

Open app in browser (http://localhost:8081
)

Show kubectl get pods and Argo CD UI

Open Grafana → show metrics graph

End with explanation of flow: Git → Jenkins → Docker → K8s → Argo → Grafana
# sample-node-project
