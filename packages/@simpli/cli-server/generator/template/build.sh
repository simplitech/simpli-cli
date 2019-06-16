#!/usr/bin/env bash

mvn clean package -DskipTests
docker-compose stop
docker-compose up -d

sleep 10

echo ""
tput setaf 2; echo "The mysql database container is now running"
tput setaf 2; echo "The tomcat server container is now running"
echo ""
tput setaf 3; echo "=> Run 'docker-compose stop' to stop the server"
tput setaf 3; echo "=> Run 'docker-compose up' to run the server"
tput setaf 3; echo "=> Run 'docker-compose up -d' to run the server in the background"
tput setaf 3; echo "=> Run 'docker-compose down' to close the server and destroy the database"
echo ""
tput setaf 3; echo "Whenever you make changes, run 'mvn clean package' and then 'docker-compose restart'"
echo ""
tput setaf 5; echo "Check your server status in http://localhost:8080"
tput setaf 5; echo "The APIs endpoint base is http://localhost:8080/api"
tput setaf 5; echo "The swagger docs is located in http://localhost:8080/docs"
tput setaf 5; echo "The swagger JSON is located in http://localhost:8080/api/swagger.json"
tput sgr0; echo ""

sleep 5

open http://localhost:8080/

read -p "Press enter to exit" nothing
