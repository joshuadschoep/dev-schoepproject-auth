versionarn=`aws lambda publish-version --function-name=$AWS_FUNCTION_ARN --query="FunctionArn"`
echo "Created new version $versionarn"

aws cloudfront get-distribution 

jq --arg $arn "$versionarn" '.LambdaFunctionAssociations = {
        Quantity: 1,
        Items: [
            {
                LambdaFunctionARN: $arn,
                EventType: "viewer-request",
                IncludeBody: false
            }
        ]
    }' > ./newconfig.json

cat ./newconfig.json;

aws cloudfront update-distribution --id=$AWS_CLOUDFRONT_DIST --distribution-config="./newconfig"