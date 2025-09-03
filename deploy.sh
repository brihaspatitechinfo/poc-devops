#!/bin/sh

cd /var/www



aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 281282485006.dkr.ecr.us-east-1.amazonaws.com



docker compose down
docker rm -vf $(docker ps -a -q)
docker rmi -f $(docker images -a -q)
docker compose pull


docker compose up -d
