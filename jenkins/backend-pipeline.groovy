pipeline {
    // agent {
    //     label 'slave-node'
    // }

    agent any

    environment {
        DOCKER_IMAGE = 'myapp-backend'
        SONAR_PROJECT_KEY = 'my-node-backend'
    }

    stages {
        stage('Checkout Code') {
            steps {
                    git credentialsId: 'github', branch: 'main', url: 'https://github.com/Roche-Micheal/e2e-devsecops.git'
                }
            }

        stage('Install Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                dir('backend') {
                    withSonarQubeEnv('Sonarqube1') {
                        sh 'npx sonar-scanner'
                    }
                }
            }
        }
        

        stage('Build Docker Image') {
            steps {
                dir('backend') {
                    sh 'docker build -t $DOCKER_IMAGE .'
                }
            }
        }

        stage('Security Scan (Trivy)') {
            steps {
                sh 'trivy image --exit-code 0 --severity LOW,MEDIUM $DOCKER_IMAGE'
                sh 'trivy image --exit-code 1 --severity HIGH,CRITICAL $DOCKER_IMAGE || true'
            }
        }

        stage('Run Backend in Docker') {
            steps {
                sh 'docker run -d -p 3000:3000 $DOCKER_IMAGE'
            }
        }
    }
}
