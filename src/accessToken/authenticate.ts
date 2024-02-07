import { OIDC_REDIRECT } from "../responses";
import { type CloudFrontRequest, type CloudFrontResponse } from "aws-lambda";
import Cookie from "cookie";
import { UnauthorizedError } from "../exceptions";
import log from "../log";
import { validateCookie } from "src/accessToken/validateCookie";

export const authenticate = async (
  request: CloudFrontRequest
): Promise<CloudFrontResponse | CloudFrontRequest> => {
  log("info", `AUTHENTICATING REQUEST: ${request.uri}`, request);
  if (
    "cookie" in request.headers &&
    (process.env.COOKIE_NAME ?? "TOKEN") in
      Cookie.parse(request.headers.cookie[0].value)
  ) {
    return await getVerifyJwtResponse(request);
  }
  return OIDC_REDIRECT(request.uri);
};

const getVerifyJwtResponse = async (request: CloudFrontRequest) => {
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
