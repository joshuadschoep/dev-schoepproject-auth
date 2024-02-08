versionarn=`aws lambda publish-version --function-name $AWS_FUNCTION_ARN --query "FunctionArn"`
echo "Created new version $versionarn"

aws cloudfront get-distribution-config --id $AWS_CLOUDFRONT_DIST > response.json

etag=`jq ".ETag" response.json`
jq ".DistributionConfig" response.json > oldconfig.json

echo "Old configuration"
cat oldconfig.json

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

echo "New Configuration"
cat newconfig.json

aws cloudfront update-distribution --id $AWS_CLOUDFRONT_DIST --if-match $etag --distribution-config file://newconfig.json