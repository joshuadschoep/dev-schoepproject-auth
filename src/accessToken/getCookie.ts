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

export const getCookie = async (accessToken: string) => {
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
            OAuthAccessToken: accessToken,
          }),
        })
      )
    ).Payload?.toString() ?? ""
  );

  if (result.Authorized && result.SignedCookie) {
    return result.SignedCookie;
  } else {
    log("warning", "Error authorizing dev token:", result.Error?.Message);
    throw new UnauthorizedError();
  }
};
