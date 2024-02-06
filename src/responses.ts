import type { CloudFrontResponse } from "aws-lambda";
import Cookie from "cookie";
import { sign } from "jsonwebtoken";
import { config, discoveryDocument } from "./context";
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

export const SUCCESS_REDIRECT = (queryString: any, headers: any, decodedToken: any): CloudFrontResponse => ({
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
                value: Cookie.serialize(
                    "TOKEN",
                    sign({}, config.PRIVATE_KEY.trim(), {
                        audience: headers.host[0].value,
                        subject: decodedToken.payload.email,
                        expiresIn: config.SESSION_DURATION,
                        algorithm: "RS256",
                    }),
                    {
                        path: "/",
                        maxAge: config.SESSION_DURATION,
                    }
                ),
            },
            {
                key: "Set-Cookie",
                value: Cookie.serialize("NONCE", "", {
                    path: "/",
                    expires: new Date(1970, 1, 1, 0, 0, 0, 0),
                }),
            },
        ],
    },
});

export const OIDC_REDIRECT = (requestUri: string) => {
    const { nonce, hash } = getNonceAndHash();
    config.AUTH_REQUEST.nonce = nonce;
    config.AUTH_REQUEST.state = requestUri; // Redirect to Authorization Server

    return {
        status: "302",
        statusDescription: "Found",
        headers: {
            location: [
                {
                    key: "Location",
                    value: `${discoveryDocument.authorization_endpoint}?${stringify(config.AUTH_REQUEST)}`,
                },
            ],
            "set-cookie": [
                {
                    key: "Set-Cookie",
                    value: Cookie.serialize("TOKEN", "", {
                        path: "/",
                        expires: new Date(1970, 1, 1, 0, 0, 0, 0),
                    }),
                },
                {
                    key: "Set-Cookie",
                    value: Cookie.serialize("NONCE", hash, {
                        path: "/",
                        httpOnly: true,
                    }),
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
