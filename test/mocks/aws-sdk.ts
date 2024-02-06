import { v4 as uuid4 } from "uuid";
import { PRIVATE_KEY, PUBLIC_KEY } from "./configs";
import { type SecretConfiguration } from "src/types";

const mockClientId = uuid4();
const mockClientSecret = uuid4();
export const SECRET_DATA: SecretConfiguration = {
    AUTH_REQUEST: {
        client_id: mockClientId,
        response_type: "code",
        scope: "openid email",
        redirect_uri: "https://localhost:5000/_callback",
    },
    TOKEN_REQUEST: {
        client_id: mockClientId,
        redirect_uri: "https://localhost:5000/_callback",
        grant_type: "authorization_code",
        client_secret: mockClientSecret,
    },
    DISTRIBUTION: "amazon-oai",
    AUTHN: "COGNITO",
    DISCOVERY_DOCUMENT: "https://example.com/.well-known/openid-configuration",
    SESSION_DURATION: 30,
    BASE_URL: "https://localhost:5000/",
    CALLBACK_PATH: "/_callback",
    AUTHZ: "COGNITO",
    PRIVATE_KEY,
    PUBLIC_KEY,
};

const mockSecretResponse = {
    config: Buffer.from(JSON.stringify(SECRET_DATA)).toString("base64"),
};

jest.mock("@aws-sdk/client-secrets-manager", () => ({
    SecretsManagerClient: jest.fn().mockImplementation(() => ({
        send: jest.fn().mockReturnValue(Promise.resolve({ SecretString: JSON.stringify(mockSecretResponse) })),
    })),
    GetSecretValueCommand: jest.fn().mockImplementation((SecretId: string) => ({
        SecretId,
    })),
}));
