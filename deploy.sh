
#!/bin/bash

TEMPLATE_FILE='template.yaml'
OUTPUT_FILE='output.yaml'
S3_BUCKET='s3-demo-lab'
STACK_NAME='purchase-processing'
PROFILE='yourprofile'

# create CloudFormation package
if aws cloudformation package --template-file ${TEMPLATE_FILE} --output-template-file ${OUTPUT_FILE} --s3-bucket ${S3_BUCKET} --profile ${PROFILE}; then
    echo "Successfully created the package ${OUTPUT_FILE}"
else
    echo "Failed creating Cloudformation package"
    exit 1
fi

# Deploy the package
if aws cloudformation deploy --template-file ${OUTPUT_FILE} --stack-name ${STACK_NAME} --capabilities CAPABILITY_IAM --region ap-southeast-2 --profile ${PROFILE}; then
    echo "Successfully deployed the package"
else
    echo "Failed deploying the package"
    exit 1
fi
