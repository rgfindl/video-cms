#!/bin/bash

PROFILE="--profile heyblue"

case $1 in
    tasks)
        # Install production dependencies.
        rm -Rf node_modules
        npm install --production

        # Package the CloudFormation script.
        aws cloudformation package \
        --template-file tasks.template.yml \
        --output-template-file tasks.template-output.yml \
        --s3-bucket heyblue-stack-artifacts \
        ${PROFILE}

        # Deploy the CloudFormation script.
        aws cloudformation deploy \
        --template-file tasks.template-output.yml \
        --stack-name heyblue-internal-tasks \
        --capabilities CAPABILITY_IAM \
        ${PROFILE}

        # Show the CloudFormation output params.
        aws cloudformation describe-stacks  \
        --stack-name heyblue-internal-tasks

        # Add dev dependencies back
        npm install
        ;;
    *)
        echo $"Usage: $0 {tasks}"
        exit 1
esac