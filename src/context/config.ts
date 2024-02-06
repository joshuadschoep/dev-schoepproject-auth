import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { pkceCodeChallenge, pkceCodeVerifier } from "./pkce";
import fs from "fs";
import log from "../log";
import { InternalServerError } from "../exceptions";
import { type SecretConfiguration } from "src/types";

export var config: SecretConfiguration;
export var secretId: string;

// setConfig sets the config object to the value from SecretsManager if it wasn't already set.
export const setConfig = async () => {
    if (config === undefined) {
        config = await fetchConfigFromSecretsManager();
    }

    // set PKCE values if client_secret is not present in configurations
    if (config.TOKEN_REQUEST.client_secret === undefined) {
        config.AUTH_REQUEST.code_challenge_method = "RS256";
        config.AUTH_REQUEST.code_challenge = pkceCodeChallenge;
        config.AUTH_REQUEST.state = "state";
        config.TOKEN_REQUEST.code_verifier = pkceCodeVerifier;
    }
};

async function fetchConfigFromSecretsManager() {
    // Get Secrets Manager Config Key from File since we cannot use environment variables.
    if (secretId === undefined) {
        try {
            secretId = fs.readFileSync("./sm-key.txt", "utf-8");
            secretId = secretId.replace(/(\r\n|\n|\r)/gm, "");
        } catch (err: any) {
            log("error", `ERROR GETTING SECRET_ID FROM FILE: ${err.message}`, err);
            throw new InternalServerError();
        }
    }
    const client = new SecretsManagerClient({ apiVersion: "2017-10-17", region: "us-east-1" });
    const secret = await client.send(new GetSecretValueCommand({ SecretId: secretId })); // eslint-disable-next-line no-buffer-constructor
    const buff = Buffer.from(JSON.parse(secret.SecretString ?? "").config, "base64");
    const decodedval = JSON.parse(buff.toString("utf-8"));
    return decodedval;
}
