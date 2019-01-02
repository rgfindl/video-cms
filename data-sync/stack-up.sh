#!/bin/bash

PROFILE="--profile heyblue"

case $1 in
    sync)
        # Install production dependencies.
        rm -Rf node_modules
        npm install --production

        # Package the CloudFormation script.
        aws cloudformation package \
        --template-file sync.template.yml \
        --output-template-file sync.template-output.yml \
        --s3-bucket heyblue-stack-artifacts \
        ${PROFILE}

        # Deploy the CloudFormation script.
        aws cloudformation deploy \
        --template-file sync.template-output.yml \
        --stack-name heyblue-sync \
        --capabilities CAPABILITY_IAM \
        ${PROFILE}

        # Show the CloudFormation output params.
        aws cloudformation describe-stacks  \
        --stack-name heyblue-sync

        # Add dev dependencies back
        npm install
        ;;
    *)
        echo $"Usage: $0 {sync}"
        exit 1
esac