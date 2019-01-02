#!/bin/bash

PROFILE="--profile heyblue"

case $1 in
    assets)
        aws cloudformation deploy \
        --template-file assets.template.yml \
        --stack-name heyblue-assets \
        --capabilities CAPABILITY_IAM \
        --parameter-overrides \
        TLD='heyblue.io' \
        Domain='assets.heyblue.io' \
        SSLArn='arn:aws:acm:us-east-1:813715622461:certificate/74dd21e7-9e93-44c5-b433-79f42f644558' \
        ${PROFILE}
        ;;
    db)
        aws cloudformation deploy \
        --template-file db.template.yml \
        --stack-name heyblue-db \
        --capabilities CAPABILITY_IAM \
        ${PROFILE}
        ;;
    iam)
        aws cloudformation deploy \
        --template-file iam.template.yml \
        --stack-name heyblue-iam \
        --capabilities CAPABILITY_IAM \
        ${PROFILE}
        ;;
    queue)
        aws cloudformation deploy \
        --template-file queue.template.yml \
        --stack-name heyblue-queue \
        --capabilities CAPABILITY_IAM \
        ${PROFILE}
        ;;
    *)
        echo $"Usage: $0 {assets|db|iam|queue}"
        exit 1
esac