import { stringify, parse } from "querystring";
import { decode } from "jsonwebtoken";
import { UnauthorizedError } from "../exceptions";
import { type CloudFrontRequest, type CloudFrontResponse } from "aws-lambda";
import axios from "axios";
import JwkToPem from "jwk-to-pem";
import { jwks, discoveryDocument } from "../context";
import { verifyJwt } from "./verify";
import Cookie from "cookie";
import { createHmac } from "crypto";
import { SUCCESS_REDIRECT } from "../responses";
import log from "../log";
import { getCookie } from "./get-cookie";

export const handleOidcCallback = async (
  request: CloudFrontRequest
): Promise<CloudFrontResponse> => {
  log("info", "HANDLING OIDC CALLBACK");

  const headers = request.headers;
  const queryString = parse(request.querystring);

  log("info", "Checking querystring", queryString);
  if (queryString.error !== undefined && queryString.error?.length !== 0) {
    log("error", "OIDC CALLBACK ERROR", queryString.error);
    throw new UnauthorizedError();
  }

  log("info", "Checking for code", queryString.code);
  if (queryString.code === undefined || queryString.code === null) {
    log("warning", "OIDC CALLBACK CONTAINED NO CODE", queryString.error);
    throw new UnauthorizedError();
  }

  log("info", "Checking for nonce", headers.cookie[0].value);
  if (
    !("cookie" in headers) ||
    !(
      (process.env.NONCE_COOKIE_NAME ?? "NONCE") in
      Cookie.parse(headers.cookie[0].value)
    )
  ) {
    log("error", "Initial request does not contain nonce");
    throw new UnauthorizedError();
  }

  const { idToken, decodedToken, accessToken } = await getTokens(
    queryString.code
  );

  log("info", "Performing XSRF check");
  const originalNonce = Cookie.parse(headers.cookie[0].value)[
    process.env.NONCE_COOKIE_NAME ?? "NONCE"
  ];
  if (!(await xsrfCheck(idToken, decodedToken, originalNonce))) {
    throw new UnauthorizedError();
  }

  log("info", "Exchanging access token for signed cookie from auth API");
  const devAccessCookie = await getCookie(accessToken);
  return SUCCESS_REDIRECT(queryString, devAccessCookie);
};

const getTokens = async (code: string | string[] | undefined) => {
  const tokenRequestString = stringify({
    code,
    client_id: process.env.OIDC_CLIENT_ID,
    client_secret: process.env.OIDC_CLIENT_SECRET,
    redirect_uri: process.env.OIDC_REDIRECT_URI,
    grant_type: process.env.OIDC_GRANT_TYPE,
    scope: process.env.OIDC_SCOPES,
  });
  log("info", "Exchanging code for access token");
  const response = await axios.post(
    discoveryDocument.token_endpoint,
    tokenRequestString
  );
  log("info", "Got tokens", response.data);
  const decodedToken = decode(response.data.id_token, {
    complete: true,
  });
  return {
    idToken: response.data.id_token,
    decodedToken,
    accessToken: response.data.access_token,
  };
};

const xsrfCheck = async (
  idToken: string,
  decodedToken: any,
  nonce: any
): Promise<boolean> => {
  const rawPem = jwks.keys.filter(
    (k: any) => k.kid === decodedToken.header.kid
  )[0];
  if (rawPem === undefined) {
    return false;
  }
  const pem = JwkToPem(rawPem);
  log("info", "Verifying nonce against cookie's nonce");
  const decoded = await verifyJwt(idToken, pem, { algorithms: ["RS256"] });
  if (!validateNonce(decoded.nonce, nonce)) {
    log("warning", "Nonces did not match", decoded, nonce);
    return false;
  }
  return true;
};

const validateNonce = (nonce: any, hash: any) => {
  const other = createHmac("sha256", nonce).digest("hex");
  return other === hash;
};
