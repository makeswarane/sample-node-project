# 🚀 Full Stack Deployment with ECS

This project demonstrates a full-stack web application deployed on AWS using ECS Fargate, CloudFront, RDS, and other AWS services. The frontend is built with Angular, and the backend uses Node.js/Express connected to a MySQL RDS database.

---

## 🧰 Tech Stack

- **Frontend:** Angular  
- **Backend:** Node.js, Express, Sequelize  
- **Database:** MySQL (Amazon RDS)  
- **Containerization:** Docker + Amazon ECR  
- **Orchestration:** Amazon ECS Fargate  
- **CI/CD:** Jenkins (manual ECS deploy)  
- **Other AWS Services:** S3, CloudFront, ACM, ALB, IAM, VPC  

---

## 🌐 Live Demo

Frontend URL: [https://test.rochedev.info](https://test.rochedev.info)

---

## 🖼️ Architecture Overview

                    ┌────────────┐
                    │   Client   │
                    └─────┬──────┘
                          │
                          ▼
                ┌──────────────────┐
                │   CloudFront     │
                └────────┬─────────┘
                         │
                         ▼
                  ┌────────────┐
                  │    S3      │  <-- Angular app
                  └────────────┘

                          │
                          ▼
                ┌──────────────────┐
                │ Application Load │
                │   Balancer (ALB) │
                └────────┬─────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │     ECS Fargate     │  <-- Node.js (Express)
              └────────┬────────────┘
                       │
                       ▼
                ┌──────────────┐
                │    RDS       │  <-- MySQL
                └──────────────┘



- Frontend hosted on **S3** with CloudFront for global content delivery.  
- Backend containerized and deployed via **ECS Fargate** behind an Application Load Balancer.  
- Database hosted on **Amazon RDS** (MySQL).  
- CI/CD handled using **Jenkins**, triggered via GitHub webhook.

---

## 🔧 Frontend Setup (Angular + S3 + CloudFront)

- Angular app built using `ng build`  
- Uploaded to **S3 bucket**  
- CloudFront distribution created with custom domain `test.rochedev.info`  
- **ACM** SSL certificate attached for HTTPS  

---

## 🖥️ Backend Setup (Node.js + ECS + RDS)

- Node.js API using Express and Sequelize ORM  
- Docker image built and pushed to **Amazon ECR**  
- Task Definition created in ECS  
- Service runs in **ECS Fargate** within public subnets  
- Connected to **RDS MySQL** database in private subnets  
- Backend exposed via **Application Load Balancer (ALB)**  

---

## 🔄 CI/CD Pipeline (Jenkins)

- Webhook triggers Jenkins job on GitHub push  
- Pipeline steps:  
  1. Pull latest code  
  2. Install dependencies  
  3. Build Docker image  
  4. Tag and push to Amazon ECR  
  5. Manual trigger for ECS deployment (via console/CLI)  

---

## 🌐 Infrastructure Summary

| Component       | Details                                         |
|-----------------|-------------------------------------------------|
| VPC             | Custom with 2 Public + 2 Private Subnets across AZs |
| IAM Roles       | For S3 uploads, ECR push, CLI access            |
| ECS Network     | Public subnet with auto-assign public IP        |
| RDS             | MySQL DB in private subnet                        |
| Secrets         | Credentials currently managed manually           |

---

## 📌 To Do / Future Improvements

- [ ] Automate ECS deployment step in Jenkins  
- [ ] Use AWS Secrets Manager for DB credentials  
- [ ] Implement auto-scaling for ECS services  
- [ ] Add CloudWatch monitoring and alarms  
- [ ] Convert manual infra setup to Terraform  

---

## 📂 Repository Structure

.
├── backend/             # Node.js + Express + Sequelize API
│   ├── Dockerfile       # Docker config for backend
│   └── ...              # API source code
│
├── frontend/            # Angular app
│   ├── src/             # Angular components
│   └── ...              # Angular build config
│
├── Jenkinsfile          # Jenkins CI/CD pipeline script
├── README.md            # Project documentation (this file)
└── docker-compose.yml   # (Optional - for local dev/testing)


--- 

## 🧠 Lessons Learned

- Managing VPC configurations and subnet routing was crucial for ECS tasks and RDS communication  
- Docker image builds optimized using `.dockerignore` and multistage builds  
- Setting up custom domains with SSL on both frontend (CloudFront) and backend (ALB) was challenging but rewarding  

---

