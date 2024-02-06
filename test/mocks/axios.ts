import { DiscoveryDocument, JwksDocument } from "./configs";

jest.mock("axios", () => ({
    get: jest.fn().mockImplementation(async (uri: string) => {
        switch (uri) {
            case "https://example.com/.well-known/openid-configuration":
                return await Promise.resolve({
                    data: DiscoveryDocument,
                });
            case "https://example.com/.well-known/jwks.json":
                return await Promise.resolve({
                    data: JwksDocument,
                });
        }
    }),
}));
