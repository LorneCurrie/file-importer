#!/bin/sh
# upload a file to S3

stage=${1:-dev}
uploadFile=${2:-./seed/test_radius_data.csv}

echo "Will invoke the ${stage} function"

jsonData=`cat ./config/config.${stage}.json`
prop="fileUploadBucketName"
bucketName="$(node -e "console.log(JSON.parse(\`$jsonData\`)['$prop'])")"

echo "upload ${uploadFile} to s3://${bucketName}"

# upload the file to the S3

aws s3 cp $uploadFile s3://$bucketName/uploads/
