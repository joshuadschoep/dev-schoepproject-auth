import axios from "axios";

export interface DiscoveryDocument {
  authorization_endpoint: string;
  jwks_uri: string;
  token_endpoint: string;
}

export var discoveryDocument: DiscoveryDocument;

// setDiscoveryDocument sets the discoveryDocument object if it wasn't already set.
export const setDiscoveryDocument = async () => {
  if (discoveryDocument === undefined) {
    discoveryDocument = (
      await axios.get(process.env.AUTH0_OIDC_CONFIG_URL ?? "")
    ).data;
  }
};
