pipeline {
    agent { label 'kshsingh' }

    environment {
        IMAGE_NAME = 'YOUR_DOCKERHUB_USERNAME/notesphere'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code from GitHub'

                git branch: 'main',
                    credentialsId: 'github-private',
                    url: 'https://github.com/kshamasingh854/django-notes-app.git'

            }
        }

        stage('Build and Test') {
            steps {
                sh 'mvn clean verify'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$BUILD_NUMBER .'
                sh 'docker tag $IMAGE_NAME:$BUILD_NUMBER $IMAGE_NAME:latest'
            }
        }

        stage('Push Image to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKERHUB_USER',
                    passwordVariable: 'DOCKERHUB_TOKEN'
                )]) {
                    sh '''
                        echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USER" --password-stdin
                        docker push "$IMAGE_NAME:$BUILD_NUMBER"
                        docker push "$IMAGE_NAME:latest"
                        docker logout
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(
                    credentialsId: 'kubeconfig',
                    variable: 'KUBECONFIG'
                )]) {
                    sh '''
                        kubectl apply -f k8s/db-secret.yaml
                        kubectl apply -f k8s/db-deployment.yaml
                        kubectl apply -f k8s/db-service.yaml
                        kubectl apply -f k8s/app-deployment.yaml
                        kubectl apply -f k8s/app-service.yaml

                        kubectl set image deployment/notesphere \
                          notesphere="$IMAGE_NAME:$BUILD_NUMBER"

                        kubectl rollout status deployment/notesphere --timeout=180s
                    '''
                }
            }
        }
    }
}
