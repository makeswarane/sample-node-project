pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "makeswarane"
        DOCKER_REPO = "makeswarane/myapp-frontend"
        DOCKER_IMAGE = "myapp-frontend:$BUILD_NUMBER"
        SONAR_PROJECT_KEY = "my-angular-frontend"
    }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }
    stage('Show Build Number') {
            steps {
                echo "This is build number: $BUILD_NUMBER"
            }
        }

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/makeswarane/sample-node-project.git'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        // stage('SonarQube Analysis') {
        //     steps {
        //         dir('frontend') {
        //             withSonarQubeEnv('SonarQube') {
        //                 sh 'npx sonar-scanner'
        //             }
        //         }
        //     }
        // }

        stage('Build Docker Image') {
            steps {
                dir('frontend') {
                    sh "docker build -t $DOCKER_IMAGE ."
                }
            }
        }

        stage('Tag & Push to DockerHub') {
            steps {
                script {
                    // Use Jenkins credential ID: 'docker-cred'
                    withCredentials([string(credentialsId: 'docker-cred', variable: 'DOCKER_PASSWORD')]) {
                        sh """
                            echo $DOCKER_PASSWORD | docker login -u ${DOCKERHUB_USER} --password-stdin

                            # Tag image with full repo name and build number
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

		stage('Install Kubectl & ArgoCD CLI'){
			steps {
				sh '''
				echo 'installing Kubectl & ArgoCD cli...'
				curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
				chmod +x kubectl
				mv kubectl /usr/local/bin/kubectl
				curl -sSL -o /usr/local/bin/argocd https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
				chmod +x /usr/local/bin/argocd
				'''
			}
		}
		stage('Apply Kubernetes Manifests & Sync App with ArgoCD'){
			steps {
				script {
					kubeconfig(credentialsId: 'kubeconfig', serverUrl: 'https://127.0.0.1:38569') {
    						sh '''
						argocd login 127.0.0.1:30853 --username admin --password $(kubectl get secret -n argocd argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d) --insecure
						argocd app sync argocdjenkins
						'''
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

        stage('Run Frontend in Docker') {
            steps {
                script {
                    // Run container in detached mode and store its ID
                    sh "docker run -d -p 4200:80 $DOCKER_IMAGE > container_id.txt"
                }
            }
        }

        // stage('Stop Docker Container') {
        //     steps {
        //         script {
        //             // Read container ID and stop it
        //             sh '''
        //                 CONTAINER_ID=$(cat container_id.txt)
        //                 docker stop $CONTAINER_ID
        //                 docker rm $CONTAINER_ID
        //             '''
        //         }
        //     }
     }
        post {   // <-- move post block here, outside stages
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
