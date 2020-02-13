# Mock Radius Server DB

Just a fun project to explore uploading a list of contacts to a S3 bucket, triggering a lambda that then loads the CSV into a DynamoDB table.

The Scenario is that you are a small ISP that has their RADIUS server setup in AWS. For those that are wondering what a RADIUS server is:

```
Remote Authentication Dial-In User Service (RADIUS) Server is a centralized user authentication, authorization and accounting application. RADIUS authentication gives the ISP or network administrator ability to manage PPP users, login users and Hotspot users from one server throughout a large network.
```  
_REF:_ [SystemZone](https://systemzone.net/tag/radius-server-for-isp/)

The use case is that the ISP will upload a CSV file to a S3 bucket whenever they have a list of new subscribers that are ready to start using their service.
Loading the Subscribers data will allow the subscriber modem to authenticate and allow the subscriber to start binging on seasons 1 to 7 of Game Of Thrones, followed by seasons 1 and 2 of IT Crowd.

The minimum needed fields for a RADIUS to work (don't quote me) are:

- PortAuthToken: This is the ID for the physical connection between the subscriber and the network carrier
- Username: subscribers unique username
- password: subscribers unique password
- GroupName: group assigned to the subscriber that tells the Radius Server what extra attributes need to be provided
- Reply: Attributes specific to the subscriber.  Static IP addresses are sent via here.

## Dev

### AWS Credentials

Please make sure you have setup your AWS credentials and have installed AWS CLI before you start.

### System Design and Architecture

I opted to use a event based architecture for this project.
Loading a csv file to the S3 bucket will trigger an event which the lambda function will pick up and process.
It will then convert the CSV file to JSON data and then write the data to a DynamoDB table.
On completion the data file is moved to the `processed` folder and any error are written to the errors folder in the bucket. 

### Config file

As this is a public repository, I will not be including my config files with the code.  
I have included a template of the config file, and you just need to fill out the blanks.
The config files use the following naming format: `config.<stage>.json`.  Stage could be `dev` or `prod`, and should align with the stage that you deploy and invoke in yarn.

There are the following value you will need to fill in.

|Key|description|
|---|----|
|fileUploadBucketName|S3 bucket name that the lambda will monitor|
|logLevel|Cloud Watch log level:  `debug`, `warn`, `info`, `error`|
|radiusSubscriberTableName|Dynamo DB table name|
|radiusSubscriberTableNameArn|ARN for the DynamoDB table `arn:aws:dynamodb:<region>:<aws::AccountId>:table/<radiusSubscriberTableName>`|
|radiusSubscriberTableRegion|AWS region where the table is located|

### Seed data

In the `seed` folder is a test file that will be uploaded to S3 when you run the invoke script

## Deploy

Run:
  
     yarn deploy:dev 
     yarn deploy:prod
     
## Invoke function

### Automated
Run:

     yarn invoke:dev
     yarn invoke:prod
     
### Manually
     
Manually upload the seed file to the `uploads/` in the S3 bucket.
     
## Tests

Run:

      yarn test
     
I did not add tests for the `s3`, `processing` and `validation`.   
- `s3` is more of a facade class for the AWS S3 library.  
- `processing` has no real logic, and just uses functions from other packages.  A integration test would be best in this case vs a unit test.
- `validation` is a collection of object for the AJV JSON validation package. 
