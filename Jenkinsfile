pipeline { 
    agent any

    environment {
        IMAGE_NAME = "dan-p81-bastion-app"
        DOCKERHUB_REPO = "thanigai2808/dan-p81-bastion-app"
        CONTAINER_NAME = "dan-p81-bastion-container"
        DOCKER_PORT = "9003"
        HOST_PORT = "9003"
        BASTION_IP = "52.66.203.89"
        BASTION_USER = "ubuntu"
    }

    stages {
        stage('Clone the Repo') {
            steps {
                echo '🔄 Cloning the repository...'
                deleteDir()
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/feature']],
                    userRemoteConfigs: [[
                        url: 'git@github.com:thani2808/dan-p81-bastion.git',
                        credentialsId: 'private-key-jenkins'
                    ]]
                ])
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    if (!fileExists('Dockerfile')) {
                        error "❌ Dockerfile not found!"
                    }
                }
                sh "docker build -t ${IMAGE_NAME} ."
            }
        }

        stage('Tag & Push Docker Image to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh """
                        echo %DOCKER_PASSWORD% | docker login -u %DOCKER_USERNAME% --password-stdin
                        docker tag ${IMAGE_NAME} ${DOCKERHUB_REPO}:latest
                        docker push ${DOCKERHUB_REPO}:latest
                        docker logout
                    """
                }
            }
        }

        stage('SSH to Bastion and Run Nginx Container') {
            steps {
                echo "🚀 Deploying Nginx container on Bastion..."
                withCredentials([sshUserPrivateKey(credentialsId: 'testing', keyFileVariable: "keyf", usernameVariable: 'username')]) {
                    sh """
                        ssh-keyscan -H ${BASTION_IP} >> ~/.ssh/known_hosts
                        ssh -i $keyf ${username}@${BASTION_IP} << EOF
docker stop ${CONTAINER_NAME} || true
docker rm ${CONTAINER_NAME} || true
docker rmi ${DOCKERHUB_REPO}:latest || true
docker pull ${DOCKERHUB_REPO}:latest
docker run -d --name ${CONTAINER_NAME} -p ${HOST_PORT}:${DOCKER_PORT} ${DOCKERHUB_REPO}:latest
EOF
                    """
                }
            }
        }

        stage('Health Check on Bastion') {
            steps {
                echo "🩺 Running health check..."
                withCredentials([sshUserPrivateKey(credentialsId: 'testing', keyFileVariable: "keyf", usernameVariable: 'username')]) {
                    sh """
                        ssh -i $keyf $username@${BASTION_IP} << EOF
set -x
retries=10
for i in \$(seq 1 \$retries); do
RESPONSE_CODE=\$(curl -o /dev/null -s -w "%{http_code}" http://localhost:${DOCKER_PORT})
if [[ "\$RESPONSE_CODE" == "200" ]]; then
echo "✅ Nginx is serving correctly!"
exit 0
else
echo "Retry \$i/\$retries - Waiting..."
sleep 5
fi
done
echo "❌ Nginx not responding."
exit 1
EOF
                    """
                }
            }
        }

        stage('Success Confirmation') {
            steps {
                echo '✅ Nginx Docker image deployed successfully on Bastion EC2!'
            }
        }
    }

    post {
        failure {
            echo '❌ Pipeline failed. Check logs.'
        }
        always {
            echo '📋 Pipeline execution completed.'
        }
    }
}
