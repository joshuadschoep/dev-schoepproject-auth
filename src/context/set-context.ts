import { setConfig } from "./config";
import { setDiscoveryDocument } from "./discovery";
import { setJwks } from "./jwks";
import { setPkceConfigs } from "./pkce";

export default async () => {
    await setPkceConfigs();
    await setConfig();
    await setDiscoveryDocument();
    await setJwks();
};
