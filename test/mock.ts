import { default as DiscoveryDocument } from "./discovery.json";
import { default as JwksDocument } from "./jwks.json";

jest.mock("axios", () => ({
  get: jest.fn().mockImplementation(async (uri: string) => {
    switch (uri) {
      case process.env.AUTH0_OIDC_CONFIG_URL:
        return await Promise.resolve({
          data: DiscoveryDocument,
        });
      case DiscoveryDocument.jwks_uri:
        return await Promise.resolve({
          data: JwksDocument,
        });
    }
  }),
}));
