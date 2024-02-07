import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { UnauthorizedError } from "src/exceptions";
import log from "src/log";

export interface AuthorizationResult {
  Authorized?: boolean;
  SignedCookie?: any;
  Error?: {
    Code: number;
    Message: string;
  };
}

export const validateCookie = async (signedCookie: string) => {
  const client = new LambdaClient({
    apiVersion: process.env.AWS_RUNTIME_LAMBDA_VERSION,
    region: process.env.AWS_RUNTIME_REGION,
  });
  const result: AuthorizationResult = JSON.parse(
    (
      await client.send(
        new InvokeCommand({
          FunctionName: process.env.AWS_AUTHORIZE_METHOD_NAME,
          Payload: JSON.stringify({
            SignedCookie: signedCookie,
          }),
        })
      )
    ).Payload?.toString() ?? ""
  );

  if (result.Authorized) {
    return true;
  } else {
    log("warning", "Error authorizing cookie:", result.Error?.Message);
    throw new UnauthorizedError();
  }
};
