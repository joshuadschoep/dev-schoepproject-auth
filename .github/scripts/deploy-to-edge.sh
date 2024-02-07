versionarn=`aws lambda publish-version --function-name=$AWS_FUNCTION_ARN --query="FunctionArn"`
echo "Created new version $versionarn"

jq --arg $arn "$versionarn" '.LambdaFunctionAssociations = {
        Quantity: 1,
        Items: [
            {
                LambdaFunctionARN: $arn,
                EventType: "viewer-request",
                IncludeBody: false
            }
        ]
    }' > ./newconfig

cat ./newconfig

aws cloudfront update-distribution --id=$AWS_CLOUDFRONT_DIST --distribution-config=./newconfig