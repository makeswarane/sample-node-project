pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "makeswarane"                      // 🔹 your Docker Hub username
        DOCKER_REPO = "makeswarane/myapp-backend"           // 🔹 your Docker Hub repo name
        DOCKER_IMAGE = "myapp-backend:$BUILD_NUMBER"        // 🔹 dynamic image tag
        SONAR_PROJECT_KEY = "my-node-backend"
    }

    stages {
        stage('Checkout Code') {
            steps {
                    git credentialsId: 'github', branch: 'main', url: 'https://github.com/makeswarane/sample-node-project.git'
                }
            }

        stage('Install Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        // stage('SonarQube Analysis') {
        //     steps {
        //         dir('backend') {
        //             withSonarQubeEnv('Sonarqube1') {
        //                 sh 'npx sonar-scanner'
        //             }
        //         }
        //     }
        // }
        

        stage('Build Docker Image') {
            steps {
                dir('backend') {
                    sh 'docker build -t $DOCKER_IMAGE .'
                }
            }
        }

        stage('Tag & Push to DockerHub') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'docker-cred', variable: 'DOCKER_PASSWORD')]) {
                        sh """
                            echo $DOCKER_PASSWORD | docker login -u ${DOCKERHUB_USER} --password-stdin

                            # Tag image with repo name and build number
                            docker tag $DOCKER_IMAGE $DOCKER_REPO:$BUILD_NUMBER

                            # Also tag as latest
                            docker tag $DOCKER_IMAGE $DOCKER_REPO:latest

                            # Push both tags
                            docker push $DOCKER_REPO:$BUILD_NUMBER
                            docker push $DOCKER_REPO:latest

                            docker logout
                        """
                    }
                }
            }
        }

        // stage('Security Scan (Trivy)') {
        //     steps {
        //         sh 'trivy image --exit-code 0 --severity LOW,MEDIUM $DOCKER_IMAGE'
        //         sh 'trivy image --exit-code 1 --severity HIGH,CRITICAL $DOCKER_IMAGE || true'
        //     }
        // }

        stage('Run Backend in Docker') {
            steps {
                sh 'docker run -d -p 3000:3000 $DOCKER_IMAGE'
            }
        }
    }
    post {
        success {
            mail to: 'emakeshwaran1@gmail.com',
                 subject: "✅ Jenkins Build Success: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "Build successful! Check console: ${env.BUILD_URL}"
        }
        failure {
            mail to: 'emakeshwaran1@gmail.com',
                 subject: "❌ Jenkins Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "Build failed. Check details: ${env.BUILD_URL}"
        }
    }
}
