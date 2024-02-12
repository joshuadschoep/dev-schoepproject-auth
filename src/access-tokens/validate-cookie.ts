import { InvokeCommand } from "@aws-sdk/client-lambda";
import { lambdaClient } from "../context";
import { UnauthorizedError } from "../exceptions";
import log from "../log";

export interface AuthorizationResult {
  Authorized?: boolean;
  SignedCookie?: any;
  Error?: {
    Code: number;
    Message: string;
  };
}

export const validateCookie = async (signedCookie: string) => {
  const result: AuthorizationResult = JSON.parse(
    (
      await lambdaClient.send(
        new InvokeCommand({
          FunctionName: process.env.AWS_AUTHORIZE_METHOD_NAME,
          Payload: JSON.stringify({
            SignedCookie: signedCookie,
          }),
        })
      )
    ).Payload?.transformToString() ?? ""
  );

  if (result.Authorized === true) {
    return true;
  } else {
    log("warning", "Error authorizing cookie:", result.Error?.Message);
    throw new UnauthorizedError();
  }
};
