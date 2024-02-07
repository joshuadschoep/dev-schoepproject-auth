import { LambdaClient } from "@aws-sdk/client-lambda";

export var lambdaClient: LambdaClient;

export const setLambdaClient = async () => {
  if (lambdaClient === undefined) {
    lambdaClient = new LambdaClient({
      region: process.env.AWS_RUNTIME_REGION,
    });
  }
};
