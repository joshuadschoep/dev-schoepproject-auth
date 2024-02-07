import { OIDC_REDIRECT } from "../responses";
import { type CloudFrontRequest, type CloudFrontResponse } from "aws-lambda";
import { UnauthorizedError } from "../exceptions";
import log from "../log";
import { validateCookie } from "./validate-cookie";

export const authenticateCookie = async (
  request: CloudFrontRequest
): Promise<CloudFrontRequest | CloudFrontResponse> => {
  try {
    await validateCookie(request.headers.cookie[0].value);
    return request;
  } catch (err: any) {
    switch (err.name) {
      case "TokenExpiredError":
        log("warning", `JWT TOKEN EXPIRED: ${err.name}`);
        return OIDC_REDIRECT(request.uri);
      case "JsonWebTokenError":
        log("warning", `JWT ERROR: ${err.name}`, err.message);
        throw new UnauthorizedError();
      default:
        log("warning", `UNKNOWN JWT ERROR: ${err.name}`, err.message);
        throw new UnauthorizedError();
    }
  }
};
