import type { CloudFrontRequest, CloudFrontResponse } from "aws-lambda";
import { handleOidcCallback } from "../idToken/handle-oidc-callback";
import { authenticate } from "../accessToken/authenticate";
import log from "../log";

export const route = async (
  request: CloudFrontRequest
): Promise<CloudFrontResponse | CloudFrontRequest> => {
  log("info", `ROUTING REQUEST: ${request.uri}`, request);
  if (request.uri.startsWith(process.env.OIDC_REDIRECT_URI ?? "")) {
    return await handleOidcCallback(request);
  } else {
    return await authenticate(request);
  }
};
