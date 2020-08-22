
# AWS S3 NotificationConfiguration


S3 bucket provides a notification feature which let’s you receive notification when certain events occur. Some of the common events supported by buckets are objectCreated, objectDeleted, objectRestore. In this example we will create a customer purchase notification system. For this, we will send Http post request to the AWS Apigateway which will be proxied to the Lambda backend. The Lambda function will store the customer data in the S3 bucket in JSON file. This will trigger the second Lambda function which will read the JSON file in the S3 bucket and send the email to the desired email address.


![result](<https://github.com/ravimaharjan/s3-lambda-notification/blob/assests/s3-notification.png>)


## System Requirements
* AWS account and the IAM user setup.
* Install and configure awscli. 
* Create an aws profile to run awscli commands. You will use this profile to run the infrastructure.
* SES email verification. Source and destination email has to be verified before sending the email.

## Deployment and Testing
* Insert the dummy purchase data in the event.json file. Provide all the necessary data in json format.
* Open template.yaml file and set the values for
  * BucketName -> S3 bucket where purchase data will be stored
  * Region -> Your AWS region where the resouces will be created
  * SenderEmail -> AWS verified email address from which the purchase email will be send
  
* Open deploy.sh and the set the values for 
  * S3_BUCKET -> S3 bucket where your deployment package will be created.
  * STACK_NAME -> Name of the stack
  * PROFILE -> Profile you created earlier
  
From the terminal run the commands.

```
./deploy.sh
./callapi.sh
```

More detail is available in the link https://dev.to/ravimaharjan/aws-s3-bucket-notification-system-1lkh
