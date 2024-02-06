import base64url from "base64url";
import { randomBytes, createHash } from "crypto";

export var pkceCodeVerifier: string;
export var pkceCodeChallenge: string;

export const setPkceConfigs = async () => {
    if (pkceCodeChallenge === undefined || pkceCodeVerifier === undefined) {
        pkceCodeVerifier = generatePkceCodeVerifier();
        pkceCodeChallenge = generatePkceCodeChallenge(pkceCodeVerifier);
    }
};

const generatePkceCodeVerifier = (size = 43) => {
    return randomBytes(size).toString("hex").slice(0, size);
};

function generatePkceCodeChallenge(codeVerifier: string) {
    const hash = createHash("sha256").update(codeVerifier).digest();
    return base64url.encode(hash);
}
