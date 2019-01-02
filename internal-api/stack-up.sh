#!/bin/bash

PROFILE="--profile heyblue"

case $1 in
    api)
        # Install production dependencies.
        rm -Rf node_modules
        npm install --production

        # Package the CloudFormation script.
        aws cloudformation package \
        --template-file api.template.yml \
        --output-template-file api.template-output.yml \
        --s3-bucket heyblue-stack-artifacts \
        ${PROFILE}

        # Deploy the CloudFormation script.
        aws cloudformation deploy \
        --template-file api.template-output.yml \
        --stack-name heyblue-internal-api \
        --capabilities CAPABILITY_IAM \
        --parameter-overrides \
        TLD='heyblue.io' \
        Domain='internal-api.heyblue.io' \
        SSLArn='arn:aws:acm:us-east-1:813715622461:certificate/74dd21e7-9e93-44c5-b433-79f42f644558' \
        JwtSecret=$(aws kms decrypt --ciphertext-blob fileb://resources/JwtSecret.txt --output text --query Plaintext | base64 --decode) \
        GapiClientSecret=$(aws kms decrypt --ciphertext-blob fileb://resources/GapiClientSecret.txt --output text --query Plaintext | base64 --decode) \
        ${PROFILE}

        # Show the CloudFormation output params.
        aws cloudformation describe-stacks  \
        --stack-name heyblue-internal-api

        # Add dev dependencies back
        npm install
        ;;
    *)
        echo $"Usage: $0 {api}"
        exit 1
esac