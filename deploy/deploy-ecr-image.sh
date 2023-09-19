#!/bin/bash

set -e

IMAGE_TAG="$GITHUB_SHA-$GITHUB_RUN_ATTEMPT"
PLATFORM=$1
IMAGE_ARN=$2

aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 569704406482.dkr.ecr.ap-south-1.amazonaws.com

docker build -t canopas-blog:$IMAGE_TAG-$PLATFORM .

docker tag canopas-blog:$IMAGE_TAG-$PLATFORM $IMAGE_ARN:$IMAGE_TAG-$PLATFORM

docker push $IMAGE_ARN:$IMAGE_TAG-$PLATFORM
