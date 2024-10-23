#!/bin/bash

aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

sudo mkdir -p /etc/nginx/conf.d && sudo mv nginx.conf /etc/nginx/ && sudo mv conf.d/website-blog.conf /etc/nginx/conf.d/

docker stack deploy --with-registry-auth -c ./docker-compose.yaml canopas-website

docker system prune --force