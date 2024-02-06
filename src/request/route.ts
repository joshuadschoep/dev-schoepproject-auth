import type { CloudFrontRequest, CloudFrontResponse } from "aws-lambda";
import { config } from "../context";
import { handleOidcCallback } from "../jwt/handle-oidc-callback";
import { authenticate } from "../jwt/authenticate";
import log from "../log";

export const route = async (request: CloudFrontRequest): Promise<CloudFrontResponse | CloudFrontRequest> => {
    log("info", `ROUTING REQUEST: ${request.uri}`, request);
    if (request.uri.startsWith(config.CALLBACK_PATH)) {
        return await handleOidcCallback(request);
    } else {
        return await authenticate(request);
    }
};
