import { type CloudFrontRequest } from "aws-lambda";
import { parse } from "cookie";

export const isOidcRedirectRequest = (request: CloudFrontRequest): boolean =>
  request.uri.startsWith(process.env.OIDC_CALLBACK_PATH ?? "_inaccessible");

export const isAuthenticatedRequest = (request: CloudFrontRequest): boolean =>
  "cookie" in request.headers &&
  request.headers.cookie.length > 0 &&
  (process.env.COOKIE_NAME ?? "TOKEN") in
    parse(request.headers.cookie[0].value);
