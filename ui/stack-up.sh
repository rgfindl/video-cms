#!/bin/bash

PROFILE="--profile heyblue"

case $1 in
    ui)
        aws cloudformation deploy \
        --template-file ui.template.yml \
        --stack-name heyblue-ui \
        --capabilities CAPABILITY_IAM \
        --parameter-overrides \
        TLD='heyblue.io' \
        Domain='heyblue.io' \
        SSLArn='arn:aws:acm:us-east-1:813715622461:certificate/74dd21e7-9e93-44c5-b433-79f42f644558' \
        ${PROFILE}
        ;;
    *)
        echo $"Usage: $0 {ui}"
        exit 1
esac