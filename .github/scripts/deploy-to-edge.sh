versionarn=`aws lambda publish-version --function-name=$AWS_FUNCTION_ARN --query="FunctionArn"`
echo "Created new version $versionarn"

aws cloudfront get-distribution --id=$AWS_CLOUDFRONT_DIST > oldconfig.json

jq ".DistributionConfig.DefaultCacheBehavior.LambdaFunctionAssociations = {
        Quantity: 1,
        Items: [
            {
                LambdaFunctionARN: $versionarn,
                EventType: \"viewer-request\",
                IncludeBody: false
            }
        ]
    }" oldconfig.json > newconfig.json

cat newconfig.json;

aws cloudfront update-distribution --id=$AWS_CLOUDFRONT_DIST --distribution-config=newconfig.json