import type { CloudFrontRequest, CloudFrontResponse } from "aws-lambda";
import { handleOidcCallback } from "../idToken/handle-oidc-callback";
import { authenticateCookie } from "../access-tokens/authenticate";
import log from "../log";
import { isAuthenticatedRequest, isOidcRedirectRequest } from "./const";
import { OIDC_REDIRECT } from "../responses";

export const route = async (
  request: CloudFrontRequest
): Promise<CloudFrontResponse | CloudFrontRequest> => {
  log("info", `ROUTING REQUEST: ${request.uri}`, request);
  if (isOidcRedirectRequest(request)) {
    return await handleOidcCallback(request);
  } else if (isAuthenticatedRequest(request)) {
    return await authenticateCookie(request);
  } else {
    return OIDC_REDIRECT(request.uri);
  }
};
