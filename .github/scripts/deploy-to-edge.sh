versionarn=`aws lambda publish-version --function-name $AWS_FUNCTION_ARN --query "FunctionArn"`
echo "Created new version $versionarn"

aws cloudfront get-distribution-config --id $AWS_CLOUDFRONT_DIST > response.json

etag=`jq -r ".ETag" response.json`

jq ".DistributionConfig" response.json > oldconfig.json

jq ".DefaultCacheBehavior.LambdaFunctionAssociations = {
        Quantity: 1,
        Items: [
            {
                LambdaFunctionARN: $versionarn,
                EventType: \"viewer-request\",
                IncludeBody: false
            }
        ]
    }" oldconfig.json > newconfig.json


aws cloudfront update-distribution --id $AWS_CLOUDFRONT_DIST --distribution-config file://newconfig.json --if-match $etag > /dev/null