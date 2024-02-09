import type { CloudFrontResponse } from "aws-lambda";
import Cookie from "cookie";
import { discoveryDocument } from "./context";
import { stringify } from "querystring";
import Crypto from "crypto";

export const INTERNAL_SERVER_ERROR_RESPONSE: CloudFrontResponse = {
  status: "500",
  statusDescription: "An internal server error has occured",
  headers: {},
};

export const UNAUTHORIZED_ERROR: CloudFrontResponse = {
  status: "401",
  statusDescription: "You are not authorized to view this content",
  headers: {},
};

export const SUCCESS_REDIRECT = (
  queryString: any,
  signedCookie: string
): CloudFrontResponse => ({
  status: "302",
  statusDescription: "Found",
  headers: {
    location: [
      {
        key: "Location",
        value: queryString.state,
      },
    ],
    "set-cookie": [
      {
        key: "Set-Cookie",
        value: signedCookie,
      },
      {
        key: "Set-Cookie",
        value: Cookie.serialize(process.env.NONCE_COOKIE_NAME ?? "NONCE", "", {
          path: "/",
          expires: new Date(1970, 1, 1, 0, 0, 0, 0),
        }),
      },
    ],
  },
});

export const OIDC_REDIRECT = (requestUri: string) => {
  const { nonce, hash } = getNonceAndHash();

  const authRequest = {
    client_id: process.env.OIDC_CLIENT_ID,
    response_type: process.env.OIDC_RESPONSE_TYPE,
    scope: process.env.OIDC_SCOPES,
    redirect_uri: process.env.OIDC_REDIRECT_URI,
    state: requestUri,
    nonce,
  };

  return {
    status: "302",
    statusDescription: "Found",
    headers: {
      location: [
        {
          key: "Location",
          value: `${discoveryDocument.authorization_endpoint}?${stringify(authRequest)}`,
        },
      ],
      "set-cookie": [
        {
          key: "Set-Cookie",
          value: Cookie.serialize(process.env.COOKIE_NAME ?? "TOKEN", "", {
            path: "/",
            expires: new Date(1970, 1, 1, 0, 0, 0, 0),
          }),
        },
        {
          key: "Set-Cookie",
          value: Cookie.serialize(
            process.env.NONCE_COOKIE_NAME ?? "NONCE",
            hash,
            {
              path: "/",
              httpOnly: true,
            }
          ),
        },
      ],
    },
  };
};

function getNonceAndHash() {
  const nonce = Crypto.randomBytes(32).toString("hex");
  const hash = Crypto.createHmac("sha256", nonce).digest("hex");
  return { nonce, hash };
}
