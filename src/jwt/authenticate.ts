import { OIDC_REDIRECT } from "../responses";
import { type CloudFrontRequest, type CloudFrontResponse } from "aws-lambda";
import Cookie from "cookie";
import { verifyJwt } from "./verify";
import { config } from "../context";
import { UnauthorizedError } from "../exceptions";
import log from "../log";

// authenticate authenticates the user if they are a valid user, otherwise redirects accordingly.
export const authenticate = async (request: CloudFrontRequest): Promise<CloudFrontResponse | CloudFrontRequest> => {
    log("info", `AUTHENTICATING REQUEST: ${request.uri}`, request);
    const headers = request.headers;

    if ("cookie" in headers && "TOKEN" in Cookie.parse(headers.cookie[0].value)) {
        return await getVerifyJwtResponse(request, headers);
    }
    return OIDC_REDIRECT(request.uri);
};

async function getVerifyJwtResponse(request: CloudFrontRequest, headers: CloudFrontRequest["headers"]) {
    try {
        const decoded = await verifyJwt(Cookie.parse(headers.cookie[0].value).TOKEN, config.PUBLIC_KEY.trim(), {
            algorithms: ["RS256"],
        });
        log("info", "JWT DECODED FOR DEBUGGING", decoded);
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
}
