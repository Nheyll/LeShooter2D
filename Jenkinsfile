pipeline {
    agent any
    environment {
        FTP_CREDENTIALS = credentials('hostinger-ftp-nicolasrossato')
        FTP_HOST = "nicolasrossato.com"
    }
    stages {
        stage('Check-out branch') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: 'develop']],userRemoteConfigs: [[url: 'https://github.com/Nheyll/LeShooter2D.git']]])
            }
        }

        stage('Install dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Deploy to FTP server') {
            steps {
                script {
                    bat "curl -T dist/{8f36b955d042951fd3af.TTF,ArcadeClassic_Regular.json,bundle.js,favicon.ico,index.html} -u $FTP_CREDENTIALS_USR:$FTP_CREDENTIALS_PSW ftp://$FTP_HOST/"
                }
             }
        }
    }
}

