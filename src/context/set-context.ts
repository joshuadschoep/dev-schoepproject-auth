import { setDiscoveryDocument } from "./discovery";
import { setJwks } from "./jwks";

export default async () => {
  await setDiscoveryDocument();
  await setJwks();
};
