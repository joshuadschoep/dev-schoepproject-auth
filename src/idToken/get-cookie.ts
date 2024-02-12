import { InvokeCommand } from "@aws-sdk/client-lambda";
import { lambdaClient } from "../context";
import { UnauthorizedError } from "../exceptions";
import log from "../log";

export interface AuthorizationResult {
  Authorized?: boolean;
  SignedCookie?: string;
  Error?: {
    Code: number;
    Message: string;
  };
}

export const getCookie = async (accessToken: string): Promise<string> => {
  const res = await lambdaClient.send(
    new InvokeCommand({
      FunctionName: process.env.AWS_AUTHORIZE_METHOD_NAME,
      Payload: JSON.stringify({
        OAuthAccessToken: accessToken,
      }),
    })
  );
  console.log("asdf", res);
  console.log("2", res.Payload);
  console.log("3", res.Payload?.toString());
  const result: AuthorizationResult = JSON.parse(res.Payload?.toString() ?? "");

  if (result.Authorized === undefined || result.SignedCookie === undefined) {
    log("warning", "Error authorizing dev token:", result.Error?.Message);
    throw new UnauthorizedError();
  }

  return result.SignedCookie;
};
