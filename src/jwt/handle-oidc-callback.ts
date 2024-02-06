import { stringify, parse } from "querystring";
import { decode } from "jsonwebtoken";
import { UnauthorizedError } from "../exceptions";
import { type CloudFrontRequest, type CloudFrontResponse } from "aws-lambda";
import axios from "axios";
import JwkToPem from "jwk-to-pem";
import { jwks, config, discoveryDocument } from "../context";
import { verifyJwt } from "./verify";
import Cookie from "cookie";
import { createHmac } from "crypto";
import { SUCCESS_REDIRECT } from "../responses";
import log from "../log";

export const handleOidcCallback = async (request: CloudFrontRequest): Promise<CloudFrontResponse> => {
    log("info", "HANDLING OIDC CALLBACK");

    const headers = request.headers;
    const queryString = parse(request.querystring);

    if (queryString.error !== undefined && queryString.error?.length !== 0) {
        log("error", "OIDC CALLBACK ERROR", queryString.error);
        throw new UnauthorizedError();
    }
    if (queryString.code === undefined || queryString.code === null) {
        log("warning", "OIDC CALLBACK CONTAINED NO CODE", queryString.error);
        throw new UnauthorizedError();
    }
    if (!("cookie" in headers) || !("NONCE" in Cookie.parse(headers.cookie[0].value))) {
        throw new UnauthorizedError();
    }
    const { idToken, decodedToken } = await getIdAndDecodedToken(queryString.code);
    log("info", "DECODED CALLBACK TOKEN FOR DEBUGGING", decodedToken);
    const NONCE = Cookie.parse(headers.cookie[0].value);
    if (!(await validateOidcCallback(idToken, decodedToken, NONCE))) {
        throw new UnauthorizedError();
    }
    return SUCCESS_REDIRECT(queryString, headers, decodedToken);
};

const validateOidcCallback = async (idToken: string, decodedToken: any, nonce: any): Promise<boolean> => {
    const rawPem = jwks.keys.filter((k: any) => k.kid === decodedToken.header.kid)[0];
    if (rawPem === undefined) {
        return false;
    }
    const pem = JwkToPem(rawPem);
    const decoded = await verifyJwt(idToken, pem, { algorithms: ["RS256"] });
    if (!validateNonce(decoded.nonce, nonce)) {
        return false;
    }
    return true;
};

const getIdAndDecodedToken = async (code: string | string[] | undefined) => {
    const tokenRequestString = stringify({
        code,
        ...config.TOKEN_REQUEST,
    });
    const response = await axios.post(discoveryDocument.token_endpoint, tokenRequestString);
    const decodedToken = decode(response.data.id_token, {
        complete: true,
    });
    return { idToken: response.data.id_token, decodedToken };
};

// validateNonce validates a nonce.
function validateNonce(nonce: any, hash: any) {
    const other = createHmac("sha256", nonce).digest("hex");
    return other === hash;
}
