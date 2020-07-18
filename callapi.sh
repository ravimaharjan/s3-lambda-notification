#!/bin/bash
STACK_NAME='purchase-processing'
APIID=$(aws cloudformation describe-stack-resource --stack-name ${STACK_NAME}  --logical-resource-id api --query 'StackResourceDetail.PhysicalResourceId' --output text)
REGION=$(aws configure get region)
echo $APIID
curl -X POST --data "@./event.json" https://$APIID.execute-api.$REGION.amazonaws.com/api/purchase 