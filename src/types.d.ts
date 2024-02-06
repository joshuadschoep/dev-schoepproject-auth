export interface SecretConfiguration {
    AUTH_REQUEST: {
        client_id: string;
        response_type: string;
        scope: string;
        redirect_uri: string;
        code_challenge_method?: string;
        code_challenge?: string;
        state?: string;
        nonce?: string;
    };
    TOKEN_REQUEST: {
        client_id: string;
        redirect_uri: string;
        grant_type: string;
        client_secret: string;
        code_verifier?: string;
    };
    DISTRIBUTION: string;
    AUTHN: string;
    DISCOVERY_DOCUMENT: string;
    SESSION_DURATION: number;
    BASE_URL: string;
    CALLBACK_PATH: string;
    AUTHZ: string;
    PRIVATE_KEY: string;
    PUBLIC_KEY: string;
}
